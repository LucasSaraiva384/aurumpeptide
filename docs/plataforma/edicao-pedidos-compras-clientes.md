# Edição e exclusão de pedidos, compras e clientes — painel admin

> Decisão registrada em 2026-07-28. Complementa `docs/plataforma/arquitetura.md` (visão geral da plataforma) e `supabase/erp.sql` (módulo financeiro/ERP que introduziu `compras`, `retiradas` e o ledger único `transacoes`). A seção "Exclusão" abaixo foi adicionada na mesma data, como segunda leva sobre o mesmo arquivo `supabase/edicoes.sql`.

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

## Pendências / próximos passos (edição)

- ✅ Testado pelo usuário no Supabase real (aplicou `supabase/edicoes.sql` no SQL Editor e confirmou editar pedido/compra/cliente corretamente) — ver seção "Exclusão" abaixo para o que veio depois.

---

## Exclusão de pedidos, compras e clientes

> Adicionado em 2026-07-28, depois de editar já estar validado em produção. Mesmo arquivo aditivo `supabase/edicoes.sql` (seção nova no final do arquivo, nada do que já existia foi alterado além de duas constraints de FK — ver abaixo).

### Problema

Editar já estava resolvido; faltava apagar um pedido/compra/cliente e reverter estoque/custo médio/financeiro do mesmo jeito que a edição já faz — sem manter estorno visível na UI (mesmo modelo de "edição direta" já adotado).

### Backend — novidades em `supabase/edicoes.sql`

Boa parte da engenharia pesada já existia da leva de edição e só precisava ser destravada ou complementada:

- **Compras**: o trigger `compras_after_update_delete` (`AFTER UPDATE OR DELETE ON compras`, já criado na leva de edição) **já cobria o `DELETE`** — `handle_compra_alterada` já chama `recompute_produto_estoque_custo(old.produto_id)` também para `tg_op = 'DELETE'`. Não precisou de nenhuma trigger nova. O que faltava: `transacoes.compra_id` tinha sido criada como `references compras(id)` puro (sem `ON DELETE`), então apagar uma compra falhava com violação de FK por causa da transação vinculada. Corrigido com `ALTER TABLE transacoes DROP CONSTRAINT transacoes_compra_id_fkey` + `ADD CONSTRAINT ... ON DELETE CASCADE` — apagar a compra agora remove também a transação de compra correspondente do ledger (mesmo modelo de "sem relançamento visível").
- **Pedidos**: `pedido_itens.pedido_id` já tinha `ON DELETE CASCADE` desde `supabase/schema.sql` original, e a trigger `pedido_itens_before_delete` (criada na leva de edição) já reverte o estoque de cada item apagado — então apagar um pedido **já revertia o estoque automaticamente via cascade**, sem precisar de nada novo ali. Faltavam duas peças: (1) a mesma correção de FK em `transacoes.pedido_id` (mesmo problema/mesma solução — `ON DELETE CASCADE`); (2) uma trigger nova `pedidos_after_delete` (`AFTER DELETE ON pedidos`) chamando `recompute_cliente_estatisticas(old.cliente_id)`, já que só a RPC `atualizar_pedido` recalculava as estatísticas do cliente — apagar o pedido inteiro não acionava nada disso antes.
- **Clientes**: nenhuma mudança de schema. `pedidos.cliente_id references clientes(id)` continua **sem** `ON DELETE` — de propósito. Decisão de design: um cliente com pedidos vinculados **não pode** ser apagado, silenciosamente ou não, porque isso apagaria rastro de vendas reais do negócio. A violação de FK (`23503`) é o guarda-corpo correto aqui; não foi "corrigida" porque não é um bug.

Nenhum trigger de INSERT/UPDATE existente (da leva de edição ou de `erp.sql`/`schema.sql`) foi tocado — só as duas constraints de FK citadas e uma trigger nova (`pedidos_after_delete`).

### Frontend — `apps/admin`

- **`components/ui/alert-dialog.tsx`** (novo, via `npx shadcn add alert-dialog`): o admin já tinha `Dialog` (usado por `DeleteButton.tsx`, exclusivo de produtos), mas não `AlertDialog`. Instalado pelo fluxo padrão do shadcn, sem tocar em `DeleteButton`/produtos.
- **`components/ExcluirButton.tsx`** (novo): botão de exclusão genérico com confirmação via `AlertDialog`, usado por pedidos/compras/clientes (produtos continua usando `DeleteButton`, que já resolvia o mesmo problema com `Dialog` — não foi migrado para não arriscar regressão numa tela que não fazia parte deste pedido). Aceita `descricao` (texto rico explicando o que será revertido) e `mapearErro` opcional (usado só por clientes, para trocar a violação de FK crua por "Este cliente tem pedidos registrados e não pode ser excluído."). Importante: `AlertDialogAction` do Radix fecha o diálogo sozinho ao clicar — o handler chama `event.preventDefault()` como a primeira linha (antes de qualquer `await`) para poder manter o diálogo aberto se o delete falhar, fechando manualmente (`setOpen(false)`) só no sucesso.
- **Listagens**: `pedidos/page.tsx`, `compras/page.tsx` e `clientes/page.tsx` ganharam o botão "Excluir" ao lado de "Editar", cada um com uma descrição de preview específica:
  - Pedido: menciona cliente, valor total, e que os itens vendidos voltam ao estoque e a transação vinculada some do financeiro.
  - Compra: menciona quantidade + nome do produto (que volta a sair do estoque, recalculando o custo médio) e o valor removido do financeiro.
  - Cliente: confirmação simples (não há reversão de estoque/financeiro); se o delete falhar por FK, o toast de erro mostra a mensagem amigável em vez do erro cru do Postgres.

### Verificação feita

- `pnpm --filter admin build` e `pnpm --filter admin lint` passam limpos.
- Mesma limitação da leva de edição: sem `SUPABASE_SERVICE_ROLE_KEY`/connection string/CLI neste ambiente, não foi possível aplicar `supabase/edicoes.sql` nem testar contra o Supabase real. Revisão feita por leitura cuidadosa do SQL, incluindo confirmação de que `AlertDialogAction` é implementado sobre `DialogPrimitive.Close` do Radix (`node_modules/@radix-ui/react-dialog`) e que `event.preventDefault()` síncrono de fato bloqueia o auto-close via `composeEventHandlers`.

### Pendências / próximos passos (exclusão)

- Depois de rodar a seção nova de `supabase/edicoes.sql` no SQL Editor (o arquivo é cumulativo — rodar o arquivo inteiro de novo é seguro, todos os `create`/`alter` novos usam `create or replace`/`if not exists`/`if exists` onde relevante, exceto as duas `create function`/`create trigger` novas desta leva, que falhariam num segundo `run` se o arquivo inteiro já tivesse sido aplicado — nesse caso, rodar só a seção "Exclusão" a partir do comentário `-- Exclusão de pedidos, compras e clientes`), testar manualmente: apagar uma compra e conferir que estoque/custo médio do produto recalculam e a transação some do financeiro; apagar um pedido e conferir que o estoque volta, a transação de venda some e as estatísticas do cliente recalculam; tentar apagar um cliente com pedidos e confirmar a mensagem amigável (depois apagar um cliente sem pedidos e confirmar que funciona).

---

## Compras com múltiplos produtos — "grupo leve" (2026-08-13)

> Pedido do usuário: ele sempre compra 3+ produtos do mesmo fornecedor de uma vez, pagando um frete só, e queria lançar isso numa única operação em vez de repetir o formulário de compra produto a produto (o que também tornava fácil "perder" o frete — problema real que apareceu nesta mesma conversa antes desta feature).

### Decisão: não reestruturar `compras` em cabeçalho + itens

Duas arquiteturas foram avaliadas com o usuário, com preview visual de cada uma:

1. **Cabeçalho + itens**, replicando `pedidos`/`pedido_itens`: uma compra vira uma entidade só (data/frete/observação no cabeçalho, N produtos como itens), com edição/exclusão em nível de compra inteira. Mais fiel ao conceito, mas exigiria renomear a tabela `compras` existente, migrar as compras já reais em produção pro novo formato, relincar `transacoes.compra_id` e reescrever `recompute_produto_estoque_custo`/`atualizar_compra`/os triggers de compra — mexendo na estrutura dos dados financeiros já existentes.
2. **Grupo leve** (escolhida): `compras` continua exatamente como é — 1 linha por produto — e ganha só uma coluna opcional `grupo_compra_id uuid null` que marca linhas lançadas juntas no mesmo envio do formulário.

O usuário escolheu a opção 2: preferiu risco zero sobre os dados reais já existentes a ter edição/exclusão em nível de "compra inteira".

### Como funciona

- `supabase/compras-grupo.sql`: `alter table compras add column if not exists grupo_compra_id uuid;` — aditivo, sem rename, sem backfill. Compras antigas ficam com `grupo_compra_id = null` e continuam aparecendo normalmente.
- Nenhum trigger, RPC ou agregação financeira existente (`handle_new_compra`, `recompute_produto_estoque_custo`, `atualizar_compra`, `lib/finance.ts`) foi alterado — todos continuam vendo compras linha a linha, do jeito que sempre viram. `grupo_compra_id` é só uma tag de exibição.
- **Frete do grupo**: lançado inteiro na 1ª linha inserida do grupo; as demais ficam com `frete = 0`. Evita contar o mesmo frete duas vezes no ledger (cada linha já soma certinho via o trigger de sempre, sem precisar dividir/ratear nada).
- **Criação** (`components/CompraForm.tsx`, modo não-edição): virou lista de itens (`+ adicionar produto`, mesmo padrão de `PedidoForm.tsx`), com frete/data/observação como campos únicos no topo. No submit, gera um `crypto.randomUUID()` client-side (só quando há mais de 1 item) e insere todas as linhas numa única chamada `supabase.from("compras").insert([...])`, cada uma já com o `grupo_compra_id` compartilhado.
- **Edição continua por produto**, sem nenhuma mudança: `CompraForm` em modo edição (`compra` prop presente) usa exatamente os mesmos campos escalares e a mesma RPC `atualizar_compra` de sempre.
- **Listagem** (`app/(dashboard)/compras/page.tsx`): agrupa visualmente as linhas com o mesmo `grupo_compra_id` (função `agruparCompras`, agrupa por id em vez de assumir adjacência no resultado da query, já que linhas do mesmo grupo têm `created_at` idêntico e a ordenação não garante uma ordem relativa entre elas). Linhas de um grupo ganham uma borda esquerda sutil, a célula Frete mostra "—" nas linhas com frete 0 dentro de um grupo (em vez de "R$ 0,00", pra deixar claro que o frete está em outra linha do mesmo grupo) e uma linha de legenda abaixo do grupo mostra o frete total lançado. Ao excluir a linha que carrega o frete do grupo, o diálogo de confirmação avisa que as outras linhas do grupo não têm frete próprio.

### Fora de escopo (decidido com o usuário)

- Edição/exclusão em nível de grupo (continuam por produto, como sempre foram).
- Divisão do frete proporcional entre os itens — fica inteiro na primeira linha por simplicidade (a soma total continua correta de qualquer forma).
