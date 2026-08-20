# Objetivos da Empresa — Aurum Peptide

Metas de negócio que o departamento de marketing/estratégia (todos os agentes do ecossistema) deve apoiar diretamente. Diferente dos demais documentos em `docs/`, este é o que muda com mais frequência — deve ser revisado e atualizado conforme as metas evoluem.

## Meta principal

**Aumentar vendas**, com meta financeira objetiva:

- **R$ 7.000/mês de faturamento até outubro de 2026.**
- Horizonte: aproximadamente 3 meses a partir de julho de 2026.

Toda priorização semanal/mensal feita pelo Strategic Manager (CMO) deve ser avaliada quanto ao impacto direto nessa meta.

## Estratégia central para atingir a meta

**Levar mais pessoas para o grupo de vendas do WhatsApp.** Esse grupo é identificado como o ambiente onde a Aurum Peptide consegue se aproximar do cliente e converter em venda com mais eficácia — é o principal canal de conversão hoje (coerente com `marca.md`, que já registra Instagram/WhatsApp/grupo como os canais atuais de venda).

Isso significa que, na prática, boa parte do funil de marketing do ecossistema deve ser desenhada como:

```
Atração (Instagram, tráfego pago) → Entrada no grupo de WhatsApp → Relacionamento/venda no grupo
```

## Implicação para os agentes

- **Strategic Manager (CMO):** deve tratar "quantidade de pessoas entrando no grupo de WhatsApp" e "faturamento mensal" como as duas métricas-guia de prioridade até outubro de 2026.
- **Traffic Manager:** campanhas (Meta, Google, TikTok Ads) devem ser desenhadas com o objetivo final de conversão sendo entrada no grupo de WhatsApp (ou venda direta), não apenas engajamento ou seguidores.
- **Marketing Manager:** conteúdo e relacionamento no Instagram/Facebook devem ter chamada clara para o grupo de WhatsApp como próximo passo; peças de venda devem sempre considerar o grupo como o ambiente onde a conversão de fato acontece, não apenas o post em si.
- **Analytics Manager:** deve acompanhar e reportar, no mínimo, (1) faturamento mensal vs. meta de R$ 7.000, e (2) volume de entradas no grupo de WhatsApp, como indicadores centrais de progresso.

## Atualização de estratégia central (17/08/2026) — Grupo VIP confirmado como canal ativo de conversão

O usuário confirmou diretamente que (a) o baseline de 16/07/2026 abaixo estava desatualizado — o patamar de vendas já era mais alto do que a estimativa verbal registrada naquela data — e (b) **as vendas atuais estão de fato mais altas agora, por conta do trabalho ativo que o próprio usuário vem fazendo dentro do Grupo VIP do WhatsApp.** Isso resolve, com dado real (não apenas hipótese), parte da divergência que o Analytics Manager havia sinalizado sem conseguir fechar em `docs/analytics/relatorios.md` (entrada 17/08/2026, "Ressalva 2").

**Implicação estratégica direta:** o Grupo VIP deixa de ser tratado como hipótese de funil ("provavelmente é onde a conversão acontece") e passa a ser um **canal comprovado de conversão, com histórico real de venda gerado por trabalho ativo nele** — não tráfego pago frio, não suposição. Isso muda a priorização entre as frentes já em andamento:

- **Alimentar o Grupo VIP com conteúdo/produto que gere entrada e reforce a conversão dentro dele passa a ter prioridade mais alta do que abrir frentes novas de tráfego pago sem validação própria** (ex.: Meta Ads, ainda não testado; Google Ads, com volume/prazo incertos e hoje bloqueado por verificação de conta). Tráfego pago continua relevante para *alimentar* o topo do funil (trazer gente nova para o grupo), mas não deve competir por atenção/recurso do departamento com o reforço do canal que já está, comprovadamente, convertendo.
- Reforça a leitura já registrada abaixo ("Implicação para os agentes") de que o Marketing Manager deve manter CTA claro para o grupo em todo conteúdo — mas agora com um motivo validado por resultado real, não apenas por hipótese de funil.

## Baseline real (fornecido pelo usuário em 16/07/2026) — ⚠️ frágil/desatualizado, não comparável 1:1 com dados a partir de agosto/2026

Primeiros dados reais de negócio recebidos pelo ecossistema — antes disso, o departamento operava sem baseline. Os valores abaixo foram informados pelo usuário **como faixas**, não como valores pontuais exatos:

- **Faturamento mensal atual (à época):** R$ 2.000 a R$ 3.000/mês.
- **Ticket médio atual (à época):** R$ 200 a R$ 300.
- **Tamanho atual do grupo de WhatsApp/VIP:** em média 90 pessoas.

**Atualização confirmada pelo usuário em 17/08/2026:** este baseline já estava desatualizado/incompleto no momento em que foi informado — as vendas já aconteciam num patamar mais alto do que essa faixa sugere. Fica mantido aqui como registro histórico (rastreabilidade), mas **não deve ser usado como ponto de comparação 1:1 para calcular crescimento ou distância até a meta a partir de agosto/2026 em diante**. O ponto de partida mais confiável hoje é o dado extraído diretamente do banco (Supabase, tabelas `clientes`/`pedidos`) a partir de 28/07/2026 — ver `docs/analytics/relatorios.md`, entradas de 17/08/2026. Além disso, o usuário confirmou que parte do patamar mais alto de vendas observado agora é efeito real de ação direta dele no **Grupo VIP do WhatsApp** — ou seja, o grupo é hoje um canal **comprovadamente ativo de conversão**, não apenas uma hipótese de funil (reforça a "Estratégia central" abaixo).

Leitura detalhada, cálculos derivados e alertas de ritmo vs. meta estão registrados em `docs/analytics/relatorios.md` (entrada de 16/07/2026 para o baseline original; entradas de 17/08/2026 para os dados de banco e o fechamento desta divergência), mantido pelo Analytics Manager.

## Pendências / a aprofundar

- Metas após outubro de 2026 (o que vem depois de atingir/reavaliar essa meta).
- Metas secundárias além do faturamento e do crescimento do grupo (ex.: construção de autoridade/conteúdo, lançamento de novas linhas — ver pendência em `marca.md`).
- **[RESOLVIDA em 17/08/2026] Número de clientes ativos/únicos e taxa de recompra.** Este agente permanece bloqueado por credencial (chave `anon` filtrada por RLS nas tabelas `clientes`/`pedidos`, sem `service_role` key no repositório — ver detalhe técnico em `docs/analytics/relatorios.md`, entrada de 17/08/2026 "bloqueado"), mas o Strategic Manager (CMO) contornou o bloqueio rodando as queries diretamente no Supabase SQL Editor (sessão de browser autenticada) e repassou o resultado. **Dado obtido:** 11 clientes únicos, 0 sem pedido, 9 de compra única, 2 com recompra (>1 pedido) → taxa de recompra 18,2%; 13 pedidos no total; receita total registrada de R$ 17.280,00 no período 28/07–13/08/2026; ticket médio geral R$ 1.329,23; ticket médio de compra única R$ 1.166,67; ticket médio de pedidos de quem recompra R$ 1.695,00. Cálculo completo, cross-checks e leitura em `docs/analytics/relatorios.md`, entrada "17/08/2026 (atualização)".
  - **Ressalva de amostra:** apenas 2 casos de recompra — tratar 18,2% como primeira referência, não como taxa estatisticamente estável.
  - **Divergência com o baseline de 16/07/2026 — FECHADA em 17/08/2026, confirmada pelo usuário (não é mais hipótese).** O ticket médio e o ritmo de receita observados no banco (28/07–13/08, ticket médio R$1.329,23 vs. R$200–300 do baseline) destoavam fortemente do baseline verbal. Explicação confirmada diretamente pelo usuário: (1) o baseline de R$2.000–3.000/mês de 16/07 já estava frágil/desatualizado no momento em que foi informado — as vendas já aconteciam nesse patamar mais alto antes; e (2) mais vendas estão saindo agora, de fato, por causa das movimentações diretas do usuário no **Grupo VIP do WhatsApp**, que passa a ser tratado como canal comprovadamente ativo de conversão, não apenas hipótese de funil (ver "Atualização de estratégia central" e "Baseline real" acima). Detalhe completo em `docs/analytics/relatorios.md`, entrada "17/08/2026 (fechamento)". Segue de pé apenas a ressalva de amostra pequena (recompra) e a limitação de não haver distribuição de pedidos por data individual para separar receita de julho vs. agosto.
