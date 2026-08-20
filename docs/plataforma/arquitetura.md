# Arquitetura — Plataforma Aurum Peptide (catálogo + painel administrativo)

> Decisão registrada em 2026-07-20. Complementa os gaps de tooling identificados no audit estratégico de 2026-07-16 (ver `docs/objetivos.md`) — em especial a ausência de CRM/planilha de vendas e de histórico de clientes únicos/recompra.

## Contexto e decisão

A empresa precisa de dois produtos digitais distintos:

1. **Catálogo público** — vitrine dos produtos Aurum Peptide. Sem carrinho/checkout: a compra é sempre fechada manualmente no WhatsApp.
2. **Painel administrativo** — controle de fluxo de caixa, estoque e dados de clientes para prospecção futura. Uso interno, protegido por login.

Decisão: **duas aplicações separadas**, não uma só com uma rota `/admin` escondida. Motivo: dados financeiros e de clientes exigem um perímetro de segurança isolado do site público. Uma falha na vitrine (pública, exposta a qualquer visitante) não deve nunca ser um caminho de acesso a faturamento/estoque/clientes. O isolamento é garantido no banco de dados (Row Level Security), não apenas na aplicação.

## Decisões confirmadas com o usuário (2026-07-20)

- **Hospedagem/infra:** stack gratuita (Vercel + Supabase, planos free) — custo ~R$0/mês na escala atual.
- **Acesso ao painel admin:** um único usuário administrador por enquanto. Schema já preparado para múltiplos usuários/roles no futuro, sem redesenho.
- **Domínio:** ainda não registrado — é o passo 0 do plano de execução.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS, para os dois apps.
- **Backend/dados:** Supabase (Postgres gerenciado + Auth + Storage para imagens de produto).
- **Hospedagem:** Vercel, um projeto por app (free/hobby tier).
- **Monorepo:** pnpm workspaces —
  - `apps/site` — catálogo público
  - `apps/admin` — painel administrativo
  - `packages/ui` — componentes/design system compartilhado, seguindo `docs/identidade-visual.md`

## Domínio

- A registrar (sugestão: `.com.br` via Registro.br, ~R$40/ano, mercado é Brasil).
- `aurumpeptide.com.br` → catálogo público (`apps/site`)
- `admin.aurumpeptide.com.br` → painel administrativo (`apps/admin`)

## Segurança / isolamento de dados

Banco único no Supabase, com Row Level Security (RLS) ativado por tabela:

- `produtos` — política pública de **leitura** (SELECT), sem autenticação. É o que alimenta o catálogo.
- `transacoes`, `estoque_movimentos`, `clientes`, `pedidos` — **sem** política pública nenhuma. Só acessíveis com sessão autenticada do admin.
- `apps/site` usa a chave `anon` do Supabase (somente leitura de produtos, nunca grava).
- `apps/admin` usa Supabase Auth (login e-mail+senha).

## Modelo de dados (v1)

- **`produtos`** — id, nome, descrição, preço, categoria, imagem_url, estoque_atual, estoque_minimo, ativo (exibir/ocultar no catálogo).
- **`estoque_movimentos`** — id, produto_id, tipo (entrada/saída), quantidade, data, motivo/observação.
- **`clientes`** — id, nome, whatsapp, cidade, primeira_compra_em, ultima_compra_em, valor_total_gasto, tags (segmentação para prospecção).
- **`pedidos`** — id, cliente_id, data, itens (produto + quantidade + preço), valor_total, forma_pagamento, canal (whatsapp), observação.
- **`transacoes`** — id, data, tipo (receita/despesa), categoria, valor, pedido_id (opcional), descrição.

Registrar um pedido no painel deve, automaticamente: dar baixa no estoque + gerar a transação de receita + atualizar o histórico do cliente — evita reentrada manual tripla da mesma informação.

## Fluxo de uso do dia a dia

1. Cliente vê o catálogo em `aurumpeptide.com.br`, manda mensagem no WhatsApp.
2. Venda é fechada manualmente no WhatsApp (fora do site, como já é feito hoje).
3. Usuário registra o pedido no painel admin (produto, cliente, valor, forma de pagamento).
4. Sistema atualiza automaticamente: estoque, fluxo de caixa, histórico do cliente.
5. Com o tempo, esses dados fecham o gap de clientes únicos/recompra sinalizado ao `analytics-manager`, e podem alimentar diretamente os relatórios do agente.

## Custo estimado

- Hospedagem + banco: ~R$0/mês na escala atual (Vercel Hobby + Supabase Free).
- Único custo real recorrente: domínio (~R$40/ano).

## Próximos passos

1. Registrar domínio.
2. Criar projeto Supabase + schema SQL (tabelas acima + RLS policies).
3. Scaffold do monorepo (`apps/site`, `apps/admin`, `packages/ui`).
4. Construir catálogo público — fase de criação (Fable 5).
5. Construir painel admin — fase de criação (Fable 5).
6. Deploy e testes.

## Pendências

- Definir se `.com.br` ou `.com` para o domínio.
- Confirmar categorias/atributos finais de produto (hoje só documentado ticket médio geral, não por linha — ver gap em `docs/objetivos.md`).
- **SEO de produtos (17/08/2026):** auditoria completa do SEO técnico (`apps/site/lib/seo.ts`, sitemap, robots, JSON-LD) não encontrou bug de código, mas nenhum dos 29 produtos ativos/publicados tinha os campos `seo_title`/`seo_description`/`seo_slug` preenchidos — todos rodavam no fallback automático (meta description cortada no meio de palavra, muitas vezes começando com o texto de template do fornecedor; slugs com sufixo de UUID). Conteúdo corrigido para os 29 produtos em `supabase/seo-conteudo-produtos.sql` (aplicar via Supabase SQL Editor, mesmo fluxo dos demais arquivos em `supabase/`). Também identificado: o produto "Biovant Peptides® Semax 10mg" não tem `categoria_id` nem categoria legada — não existe categoria "Semax"/nootrópico em `categorias`; não criei uma nova categoria unilateralmente (decisão de taxonomia do catálogo, não de copy de SEO). Decidir se cria categoria própria ou reaproveita uma existente.
