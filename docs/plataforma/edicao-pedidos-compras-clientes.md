# Edição de pedidos, compras e clientes — painel admin

> Decisão registrada em 2026-07-28. Complementa `docs/plataforma/arquitetura.md` (visão geral da plataforma) e `supabase/erp.sql` (módulo financeiro/ERP que introduziu `compras`, `retiradas` e o ledger único `transacoes`).

## Problema

Até aqui, `pedidos`, `compras` e `clientes` só podiam ser criados ou listados/buscados no painel — não havia edição. Como inserir um pedido/compra dispara triggers em cascata no Postgres (baixa/soma de estoque, custo médio ponderado, estatísticas do cliente, lançamento no ledger financeiro), editar um registro sem tratar isso deixaria estoque/custo médio/financeiro/cliente dessincronizados do valor real.

## Decisão

**Edição direta**: o usuário edita o pedido/compra/cliente e o sistema recalcula automaticamente estoque, custo médio e financeiro para refletir a correção — sem manter um registro de estorno visível na UI (diferente do padrão contábil de estorno + relançamento). Cliente ganhou criação e edição completa dos campos manuais (nome, whatsapp, cidade); os campos calculados (`valor_total_gasto`, `primeira_compra_em`, `ultima_compra_em`) continuam 100% automáticos e nunca aparecem em formulário.

## Backend — `supabase/edicoes.sql`

Arquivo aditivo (mesmo padrão de `erp.sql`): só `alter table add column if not exists` e `create`/`create or replace function`. Nenhum trigger de INSERT existente teve o comportamento alterado.

### Compras: recompute do zero em vez de reverter por delta

Reverter a média ponderada (`custo_medio`) por delta não é seguro quando outras compras já aconteceram depois da que está sendo editada. Em vez disso, `recompute_produto_estoque_custo(produto_id)` reprocessa **cronologicamente** todo o histórico do produto — compras (soma estoque + reaplica a fórmula de média ponderada de `handle_new_compra`) intercaladas com vendas via `pedido_itens` (só reduzem estoque, nunca alteram custo médio) — e escreve o resultado final em `produtos.estoque_atual`/`custo_medio`.

Importante: a função precisa **intercalar** compras e vendas em ordem cronológica (não apenas somar totais separados), porque a fórmula de `handle_new_compra` usa o `estoque_atual` no momento de cada compra como base do cálculo — um estoque que já reflete vendas anteriores. Somar compras isoladamente e só subtrair vendas no final produziria um `custo_medio` diferente do que os triggers incrementais teriam gerado.

Um trigger novo `compras_after_update_delete` (`AFTER UPDATE OR DELETE ON compras`) chama esse recompute para o produto novo e, se `produto_id` mudou na edição, também para o produto antigo.

RPC `atualizar_compra(compra_id, produto_id, quantidade, custo_unitario, data, observacao)`: faz o `UPDATE` da linha (o trigger acima cuida do recompute) e sincroniza a transação vinculada.

### Vínculo `transacoes.compra_id`

`transacoes` ganhou a coluna `compra_id` (mesmo padrão do `pedido_id` já existente), necessária para localizar a transação de uma compra editada sem duplicar linha no ledger. `handle_new_compra` foi recriado (`create or replace`) só para popular essa coluna — o cálculo de estoque/custo médio é idêntico ao de `erp.sql`.

Compras criadas **antes** desta migration não tinham esse vínculo. `edicoes.sql` faz um backfill best-effort casando por produto (extraído da descrição) + valor + `created_at` idêntico — dentro da mesma transação de banco, `now()` é constante, então a compra e a transação que ela gerou (inseridas na mesma trigger) sempre têm o mesmo `created_at`. Se algum registro muito antigo não achar par exato, ele só fica dessincronizado se aquela compra específica vier a ser editada — o resto do sistema não depende de `compra_id` estar preenchido.

### Pedidos: DELETE + INSERT dos itens dentro de uma RPC transacional

Um pedido pode ter N `pedido_itens`. A forma mais simples e correta de editar é apagar todos os itens antigos e inserir os novos, dentro de uma função RPC (não client-side solto, para garantir atomicidade).

- Trigger novo `pedido_itens_before_delete` (`BEFORE DELETE ON pedido_itens`): reverte a baixa de estoque (soma a quantidade de volta) e registra o estorno em `estoque_movimentos`. A trigger `AFTER INSERT` existente (`handle_new_pedido_item`) já cuida de aplicar a baixa dos itens novos — não foi alterada.
- RPC `atualizar_pedido(pedido_id, cliente_id, forma_pagamento, observacao, itens jsonb)`: dentro de uma transação — apaga os itens antigos (dispara o estorno), atualiza a linha de `pedidos`, insere os itens novos (dispara baixa de estoque + snapshot de custo via triggers já existentes), sincroniza (`UPDATE`, nunca um segundo `INSERT`) a transação de venda vinculada e recalcula as estatísticas do cliente — do cliente novo e, se `cliente_id` mudou, também do cliente antigo.
- `p_itens` é um array jsonb `{"produtoId", "quantidade", "precoUnitario"}` — mesmo formato do estado `itens` do `PedidoForm` no frontend.

### Estatísticas do cliente: recompute do zero

`recompute_cliente_estatisticas(cliente_id)` recalcula `valor_total_gasto` (`SUM`), `primeira_compra_em` (`MIN`) e `ultima_compra_em` (`MAX`) por agregação real sobre todos os pedidos do cliente, em vez de patchear por delta — mais robusto e barato o suficiente dado o volume de dados atual.

### Permissões

`grant execute ... to authenticated` explícito nas funções chamadas via `supabase.rpc(...)` (RPCs e os dois helpers de recompute), para garantir que o PostgREST não recuse a chamada independente dos privilégios default do projeto. RLS das tabelas envolvidas não muda — já era `for all to authenticated using (true) with check (true)`.

## Frontend — `apps/admin`

- **`components/PedidoForm.tsx`**: ganhou props opcionais `pedido?`/`itensIniciais?` (mesmo padrão de `ProdutoForm`). Em modo edição, busca todos os produtos (não só ativos, para não esconder um produto referenciado por um item antigo já descontinuado) e chama `supabase.rpc("atualizar_pedido", ...)` no submit em vez de `insert`.
- **`components/CompraForm.tsx`**: ganhou prop opcional `compra?`. Em modo edição chama `supabase.rpc("atualizar_compra", ...)`.
- **`components/ClienteForm.tsx`** (novo): criação e edição de cliente (nome, whatsapp, cidade) via `insert`/`update` direto — sem RPC, já que esses campos não disparam nenhum trigger. Os campos calculados nunca aparecem no formulário.
- **Páginas novas**: `app/(dashboard)/pedidos/[id]/page.tsx`, `app/(dashboard)/compras/[id]/page.tsx`, `app/(dashboard)/clientes/[id]/page.tsx`, `app/(dashboard)/clientes/novo/page.tsx` — mesmo padrão de `app/(dashboard)/produtos/[id]/page.tsx` (server component busca o registro, `notFound()` se não existir, renderiza o form em modo edição).
- **Listagens**: `pedidos/page.tsx`, `compras/page.tsx` e `clientes/page.tsx` ganharam uma coluna de ação com botão "Editar" linkando para a página `[id]`; `clientes/page.tsx` também ganhou o botão "Novo cliente".
- **`lib/types.ts`**: `Transacao.compra_id` adicionado; `Database.public.Functions` deixou de ser `Record<string, never>` e passou a tipar `atualizar_pedido`/`atualizar_compra` (com um tipo `Json` novo, mesmo padrão dos tipos gerados pelo Supabase CLI) para que `supabase.rpc(...)` type-check corretamente.

## Verificação feita

- `pnpm --filter admin lint` e `pnpm --filter admin build` passam limpos (TypeScript incluído no build).
- **Não foi possível testar contra o Supabase real deste ambiente**: `apps/admin/.env.local` só tem a chave `anon` (sem `SUPABASE_SERVICE_ROLE_KEY`, connection string ou Supabase CLI disponíveis), e `supabase/edicoes.sql` — como todo o resto do schema — é aplicado manualmente pelo usuário no SQL Editor do Supabase Dashboard. A revisão foi feita por leitura cuidadosa do SQL (incluindo o traço manual do cenário "compra → venda → compra" para validar que o recompute intercalado reproduz a mesma média ponderada que os triggers incrementais produziriam).

## Pendências / próximos passos

- Depois de rodar `supabase/edicoes.sql` no SQL Editor, testar manualmente: editar um pedido (trocando item/quantidade/cliente), editar uma compra (trocando produto/quantidade/custo) e editar um cliente — e conferir via query direta que `produtos.estoque_atual`/`custo_medio`, `transacoes.valor` e `clientes.valor_total_gasto`/`primeira_compra_em`/`ultima_compra_em` ficaram corretos.
- Excluir pedidos/compras (não só editar) não foi pedido nesta leva e não tem UI — mas o trigger `compras_after_update_delete` já cobre `DELETE` em `compras` caso uma tela de exclusão seja adicionada depois.
