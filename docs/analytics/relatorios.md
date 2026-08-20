# Relatórios de Acompanhamento da Meta — Aurum Peptide

Log cronológico do Analytics Manager sobre o progresso das duas métricas-guia definidas em `docs/objetivos.md` (faturamento mensal vs. meta de R$ 7.000/mês até outubro de 2026, e volume de entradas no grupo de WhatsApp/VIP). Entrada mais recente no topo.

---

## 17/08/2026 — Instagram (@aurumpeptide): primeira leitura real de desempenho via Meta Graph API — legado vs. ecossistema

### Contexto e pedido

Pedido do Strategic Manager (CMO): ancorar o próximo briefing de conteúdo de produto (CTA para o Grupo VIP, prioridade vigente conforme `docs/objetivos.md`, "Atualização de estratégia central 17/08/2026") em dado real de desempenho do Instagram, não em escolha às cegas. Método: `GET /{ig-user-id}/media` (fields `id,media_type,caption,permalink,timestamp,like_count,comments_count`, `limit=25`) e, quando possível, `GET /{media-id}/insights`, ambos via `scripts/meta_graph.py` (credenciais lidas do `.env`, nenhum token manipulado manualmente).

### Dado real coletado — nível de conta

`GET /{ig-user-id}?fields=followers_count,follows_count,media_count,username`:

| Métrica | Valor |
|---|---|
| Usuário | @aurumpeptide |
| Seguidores | 965 |
| Seguindo | 243 |
| Total de posts no feed | 15 |

Este é o **primeiro snapshot de seguidores registrado por este agente** — não há ponto anterior no tempo para calcular crescimento (variação) ainda; fica como baseline para a próxima leitura.

### Achado crítico — não misturar eras, mas também não presumir que os "4 posts do ecossistema" estão todos no ar

O feed real tem **15 posts no total**, com timestamps de 2026-03-31 a 2026-08-17. Cruzando cada `id`/`timestamp` retornado pela API com `docs/publicacao/log.md` e `docs/marketing/conteudo.md`:

- **Carrossel TG 60mg (28/07/2026) NÃO aparece no feed real.** Não há nenhum post com timestamp em 28/07, nem entre 27/07 e 29/07 — o post mais próximo nessa janela é de 29/07 (KPV, estilo legado, ver tabela abaixo). Isso é consistente com o que já está documentado: em `docs/marketing/conteudo.md` (entrada 2026-07-28), o item "Publishing Manager: publicar carrossel no Instagram e replicar na página do Facebook" está **desmarcado** (`[ ]`, não `[x]`); e `docs/design/pecas.md` (entrada 2026-08-12) já registrava, antes desta coleta, que "nenhum desses posts é o carrossel TG 60mg... a publicação ainda está pendente do Publishing Manager".
- **Conclusão: não tenho dado real de desempenho para o post de produto TG 60mg, porque ele nunca foi de fato publicado no Instagram via API — não existe like/comentário/alcance para medir.** Não vou estimar ou aproximar isso. Se em algum momento ele foi publicado manualmente por fora deste fluxo (ex.: direto pelo app, sem passar pelo Publishing Manager), não há registro disso nem no feed puxado agora nem na documentação — sinalizo a lacuna, não presumo.
- **Carrossel Semax vs. Selank original (14/08/2026, media ID `17896208916570217`) também não aparece no feed** — coerente com o que já está documentado: foi rejeitado e apagado pelo dono em 16/08/2026 (`docs/publicacao/log.md`). Não há dado de desempenho recuperável dele (removido do ar antes desta coleta); mantenho o mesmo cuidado já sinalizado na tarefa — não interpretar isso como "post fraco", ele nunca chegou a ser medido aqui, foi removido por motivo de conteúdo, não de performance.
- **Restam apenas 2 dos "4 posts do ecossistema" efetivamente ao vivo e mensuráveis hoje:** o carrossel educacional de 12/08 e a republicação corrigida de Semax vs. Selank de 17/08. **Isso é uma lacuna relevante para o pedido do CMO:** hoje não existe, no feed real, nenhum post do ecossistema com CTA de compra — logo, não é possível comparar "produto com CTA" vs. "educacional sem CTA" usando dado real do próprio ecossistema. A única fonte de conteúdo de produto no feed real é legada (pré-ecossistema, fora do padrão visual atual, ver abaixo).

### Posts do ecossistema — dados reais (2 confirmados ao vivo)

| Data | Media ID | Tipo | CTA de compra | Likes | Comentários | Tempo no ar até a coleta |
|---|---|---|---|---|---|---|
| 12/08/2026 15:17 UTC | `17955403536215292` | Educacional ("Evidência não é igual para todos" — Semaglutida/Tirzepatida/Retatrutida) | Não | 5 | 0 | ~5 dias |
| 17/08/2026 18:53 UTC | `18113777833767779` | Educacional (Semax vs. Selank, versão corrigida) | Não | 2 | 0 | poucas horas (publicado no mesmo dia desta coleta) |

**Ressalva de maturidade, explícita:** o post de 17/08 tem poucas horas de exposição no momento desta coleta — tratar "2 likes" como leitura muito prematura, não como desempenho final. O de 12/08 já tem ~5 dias, leitura um pouco mais estável, mas ainda é 1 único post por tema — não dá para generalizar "conteúdo educacional performa X" com n=2.

### Posts legados (pré-ecossistema) — dados reais (13 posts, 31/03 a 29/07/2026)

Todos anteriores ao sistema de identidade visual documentado (`docs/identidade-visual.md`) e aos agentes do ecossistema — já sinalizado por padrão diferente (hashtags em volume alto, emojis, tom mais promocional) em `docs/design/pecas.md` (entrada 12/08). Incluído aqui **só como leitura de contexto/comparação de era, não como benchmark direto do padrão atual**:

| Data | Media ID | Tema | Likes | Comentários |
|---|---|---|---|---|
| 29/07/2026 | `18139788394499994` | KPV (inflamação) | 5 | 0 |
| 17/06/2026 | `18066056438443048` | 5 peptídeos em destaque | 11 | 4 |
| 12/06/2026 | `17971521993105082` | Peptídeos: ciência ou tendência | 5 | 0 |
| 10/06/2026 | `18362484592239789` | Tesamorelina/MOTS-C/CJC-1295 | 11 | 2 |
| 08/06/2026 | `18085730801566520` | Semaglutida→Tirzepatida→Retatrutida | 7 | 0 |
| 11/05/2026 | `18081713039140035` | GLOW (GHK-Cu/BPC-157/TB-500) | 12 | 4 |
| 07/05/2026 | `17911020162388811` | SLU-PP-332 | 10 | 0 |
| 06/05/2026 | `18090468896352919` | BPC-157 | 11 | 2 |
| 05/05/2026 | `18156495922457842` | TB-500 | 7 | 0 |
| 23/04/2026 | `17987364197979018` | MOTS-C | 6 | 0 |
| 08/04/2026 | `18321488335250169` | GHK-Cu | 12 | **17** |
| 04/04/2026 | `18581790940065370` | Tirzepatida (GLP-1+GIP) | 9 | 0 |
| 31/03/2026 | `18082575371063970` | Retatrutida (estudo pré-clínico câncer) | 13 | 0 |

**Ponto fora da curva identificado:** o post de GHK-Cu (08/04) tem 17 comentários, muito acima de qualquer outro post do levantamento (segundo colocado tem 4). Registro isso como dado real, não investigo o conteúdo dos comentários (não coletado nesta chamada) nem infiro causa — fica como ponto de atenção, não como conclusão.

### Insights por post (reach/saves/shares) — bloqueado, não coletado

Tentativa real: `GET /{media-id}/insights --param metric=reach,saved,shares,total_interactions,profile_visits,follows` nos 2 posts do ecossistema, e também no nível de conta (`GET /{ig-user-id}/insights`). Todas as chamadas retornaram o mesmo erro:

```json
{"error": {"message": "(#10) Application does not have permission for this action", "type": "OAuthException", "code": 10}}
```

Isso indica que o app/token atual não tem (ou não está autorizado a usar) permissão de `instagram_manage_insights` de fato ativa, apesar de estar listada como escopo desejado em `docs/integracoes/meta.md`. **Não tenho, e não vou estimar, alcance, impressões, salvamentos ou compartilhamentos de nenhum post — nem dos legados, nem dos do ecossistema.** Sinalizo como pendência técnica, não bloqueante para esta entrega (conforme instrução recebida), mas relevante: sem isso, o cálculo de engajamento abaixo usa seguidores como base, não alcance — método mais fraco, e a própria metodologia de engajamento deste agente (`.claude/agents/analytics-manager.md`) prefere alcance quando disponível.

### Engajamento calculado (base: seguidores, alcance indisponível — ver acima)

Fórmula usada: (curtidas + comentários) ÷ seguidores atuais (965). **Sem dado de compartilhamentos/salvamentos** (bloqueado, ver acima) — portanto este é um engajamento parcial, subestimado frente à fórmula completa do agente. **Limitação adicional importante:** uso o número de seguidores de **hoje** (965) como base para todos os 15 posts, inclusive os de março–junho, quando a conta provavelmente tinha menos seguidores — isso **subestima** o engajamento real dos posts mais antigos (dividir pelo mesmo denominador maior reduz a taxa calculada para eles). Não tenho o histórico de seguidores por data para corrigir isso. Trato os números abaixo como comparáveis apenas entre si com essa ressalva, não como taxa de engajamento "oficial".

- **Média dos 2 posts do ecossistema:** ≈0,37% ((0,21% + 0,52%) ÷ 2)
- **Média dos 13 posts legados:** ≈1,18%
- **Maior post legado:** GHK-Cu (08/04), ≈3,01% (puxado pelo volume de comentários)
- **Menor post do ecossistema:** Semax vs. Selank republicado (17/08), ≈0,21% — mas é o post mais novo do levantamento, com menos tempo de exposição que qualquer outro da tabela.

### Leitura / interpretação (separando dado de interpretação, como determina a metodologia deste agente)

- **Dado real:** os 2 posts do ecossistema hoje ao vivo têm engajamento (por seguidor, sem alcance) mais baixo do que a média dos posts legados, mesmo com a ressalva do denominador desatualizado favorecendo os legados (ou seja: mesmo essa correção provavelmente ampliaria, não reduziria, essa diferença, já que os legados tinham base de seguidores menor na época).
- **Leitura, não conclusão:** com apenas 2 pontos de dado do ecossistema (um deles com poucas horas no ar), **não é estatisticamente sólido** concluir "o padrão de conteúdo do ecossistema engaja menos que o legado" — é cedo demais para essa afirmação. O que dá para dizer com confiança é: os números observados até agora não mostram o ecossistema superando o legado, e a amostra é pequena demais para o contrário também.
- **Não é possível, com os dados de hoje, responder à pergunta central do pedido** ("produto com CTA vs. educacional sem CTA, o que performa melhor") — porque **não existe nenhum post de produto do ecossistema ao vivo para medir** (TG 60mg nunca foi publicado). Essa é a lacuna mais relevante desta leitura.
- **Padrão observado no legado, só como contexto (não benchmark direto):** posts sobre peptídeos individuais específicos (BPC-157, TB-500, GHK-Cu, MOTS-C) tiveram engajamento consistente e, no caso do GHK-Cu, o maior comentário de toda a amostra — pode ser sinal de interesse por conteúdo de peptídeo único e aprofundado, mas é leitura de uma era de conteúdo com tom e formato diferentes do padrão atual (`docs/identidade-visual.md`, `docs/tom-de-voz.md`), não deve ser copiado 1:1.

### O que isso implica para o briefing do próximo ciclo (sinalização de dado, não decisão de conteúdo — isso é do Marketing Manager e do CMO)

1. **Não há dado real de post de produto do ecossistema para embasar "que tipo de conteúdo de produto performa melhor".** Qualquer escolha de tema/formato para a peça de produto do próximo ciclo, se ancorada em dado real deste ecossistema, só pode se apoiar nos 2 posts educacionais existentes (ainda insuficientes para conclusão robusta) — não em comparação real produto vs. educacional.
2. Os únicos dados reais de conteúdo de produto disponíveis são do feed legado (pré-ecossistema) — utilizáveis apenas como contexto de tema (quais peptídeos geraram mais conversa historicamente), não como referência de formato/copy/CTA, já que o padrão visual e de voz mudou.
3. Recomendo (sinalização, não decisão) que o CMO trate a ausência do TG 60mg no ar como uma pendência a resolver antes ou em paralelo ao próximo briefing — hoje ele é uma peça pronta (`docs/design/2026-07-28-tg60mg/final/`), aprovada, nunca publicada.

### Alerta para o Strategic Manager (CMO)

- **Requer atenção agora:** o carrossel TG 60mg (28/07), único conteúdo de produto com CTA de compra já produzido pelo ecossistema, **nunca foi publicado no Instagram** — confirmado por ausência no feed real e pelo checklist não marcado em `docs/marketing/conteudo.md`. Isso significa que o pedido de "ancorar o próximo briefing em dado real de produto" não pode ser atendido com dado de produto do próprio ecossistema — só existe dado real de produto no feed legado, de outra era de marca.
- **Pendência técnica sinalizada, não bloqueante:** `GET /{media-id}/insights` e `GET /{ig-user-id}/insights` retornam erro de permissão (`code 10`) — sem alcance, salvamentos ou compartilhamentos, o engajamento calculado aqui é parcial (só curtidas+comentários) e usa seguidores atuais como base para todos os posts, incluindo os mais antigos, o que distorce a comparação histórica. Recomendo revisitar o escopo `instagram_manage_insights` do token/app (`docs/integracoes/meta.md`) quando possível.
- **Amostra do ecossistema ainda pequena (n=2, ambos educacionais) para qualquer leitura robusta de padrão** — não uso isso para recomendar tema/formato ainda; será atualizado a cada novo post real.

Leitura consolidada por tipo de conteúdo, atualizável a cada novo post, registrada em `docs/analytics/memoria/instagram-organico.md`.

---

## 17/08/2026 (fechamento) — Divergência de faturamento com o baseline de julho: explicada e confirmada pelo usuário

### Dado real reportado (pelo usuário, resposta direta ao alerta deste agente, 17/08/2026)

O usuário respondeu diretamente à divergência sinalizada na entrada anterior (mesma data, abaixo — "Ressalva 2") entre o baseline verbal de 16/07/2026 (R$ 2.000–3.000/mês, ticket médio R$ 200–300) e os dados extraídos do banco em 28/07–13/08 (ticket médio R$ 1.329,23, receita R$ 17.280,00 no período). Explicação do usuário, tratada aqui como dado real reportado, não como hipótese deste agente:

- **As vendas já estavam nesse patamar mais alto antes** — ou seja, o baseline de 16/07/2026 (R$ 2.000–3.000/mês) já estava **desatualizado/incompleto** no momento em que foi informado, não é que o negócio saltou de patamar entre julho e agosto.
- **E, adicionalmente, mais vendas estão saindo agora** por causa de ações diretas do próprio usuário no **Grupo VIP do WhatsApp** — ou seja, há também um efeito real de crescimento no período mais recente, não é só correção de uma estimativa antiga.

### Leitura / interpretação (fecha a divergência, das três hipóteses levantadas na entrada anterior)

Das três hipóteses não confirmadas listadas na entrada "17/08/2026 (atualização)" (fonte/janela diferente; sub/sobre-registro de pedidos; catch-up retroativo no lançamento do painel), a explicação do usuário **confirma essencialmente a primeira** (o baseline de julho era uma estimativa de memória, feita antes de existir qualquer registro formal em banco, e não capturava o patamar real de vendas) **e acrescenta um fator novo que nenhuma das três hipóteses cobria**: o Grupo VIP do WhatsApp como canal ativo de conversão, mexido diretamente pelo usuário — não uma execução de terceiros nem um efeito passivo de funil.

Isso muda duas coisas na leitura consolidada deste ecossistema, a partir de agora:

1. **O baseline de R$ 2.000–3.000/mês (16/07/2026) deve ser tratado como frágil/desatualizado — não comparável 1:1 com dados a partir de agosto/2026.** Não descarto o registro histórico (ele fica documentado como está, para rastreabilidade), mas ele não deve mais ser usado como ponto de partida de comparação para calcular crescimento percentual ou distância até a meta a partir de agora. O ponto de partida mais confiável para leituras daqui para frente é o dado do banco (Query 2 da entrada anterior: R$ 17.280,00 em 13 pedidos, 28/07–13/08/2026), com a ressalva já registrada de que ainda não sei separar quanto disso é julho vs. agosto.
2. **O Grupo VIP do WhatsApp é hoje um canal comprovadamente ativo de conversão, não apenas uma hipótese de funil.** Isso é uma confirmação relevante da estratégia central registrada em `docs/objetivos.md` ("Levar mais pessoas para o grupo de vendas do WhatsApp") — o mecanismo já está funcionando na prática, por ação direta do usuário no grupo, e não é mais apenas um racional teórico de funil (Atração → Entrada no grupo → Relacionamento/venda). Continuo sem dado histórico de entradas no grupo ao longo do tempo (pendência já registrada em 16/07) — essa confirmação é sobre o grupo **converter**, não sobre o **ritmo de crescimento do grupo em si**, que segue sem dado.

### O que fica ressalvado, mesmo com a divergência fechada

- A **Ressalva 1** da entrada anterior (amostra pequena — 2 casos de recompra, 11 clientes) continua de pé, não foi afetada por esta explicação.
- Continuo sem a distribuição de pedidos por data individual — não calculo "faturamento de agosto até 13/08 vs. meta de R$ 7.000" com precisão a partir do agregado de R$ 17.280,00.
- Não faço, e não é meu papel fazer, a leitura estratégica de quanto desse novo patamar de vendas é atribuível ao Grupo VIP especificamente (ex.: % da receita originada de conversas no grupo) — isso exigiria dado de canal por pedido, que não tenho hoje, e mesmo que tivesse, a decisão de como agir sobre isso é do Strategic Manager.

### Alerta para o Strategic Manager (CMO)

- **Divergência fechada — pode seguir usando o dado do banco (a partir de 28/07/2026) como referência mais confiável de faturamento/ticket médio, sem precisar reconciliar com o baseline de julho.**
- **Sinal positivo confirmado, não apenas hipótese:** o Grupo VIP do WhatsApp está gerando venda de fato, por ação direta do usuário nele. Vale considerar (sinalização, não decisão) se esse tipo de ação (movimentação ativa do usuário no grupo) deve ser sistematizada/replicada como parte da operação padrão, já que hoje parece depender de uma ação pontual do usuário, não de um processo do ecossistema de agentes — decisão de priorização que cabe ao CMO.
- Sigo sem conseguir separar a receita por mês (julho vs. agosto) dentro do agregado de R$ 17.280,00 — se isso for necessário para o próximo relatório de progresso vs. meta, preciso dos pedidos individuais com data, não só do resumo.

---

## 17/08/2026 (atualização) — Clientes únicos e taxa de recompra obtidos (bloqueio anterior contornado pelo CMO)

### Fonte e proveniência do dado

O bloqueio de acesso registrado na entrada anterior (mesma data, abaixo) continua tecnicamente válido para este agente — não existe `service_role` key no repositório e a chave `anon` é filtrada por RLS nas tabelas `clientes`/`pedidos`, conforme testado. O Strategic Manager (CMO) contornou o bloqueio por um caminho que este agente não tinha disponível: rodou as queries diretamente no **Supabase SQL Editor**, com sessão de browser autenticada (login do usuário), e repassou os resultados agregados. Não reconsultei o banco — apenas processo e documento os números fornecidos pelo CMO, que classifico como **dado real reportado** (não coletado diretamente por mim).

### Dado real reportado (via CMO, consulta ao banco de produção em 17/08/2026)

**Query 1 — clientes únicos e recompra** (join `clientes` × `pedidos` por `cliente_id`, agrupado por cliente):

| Métrica | Valor |
|---|---|
| Total de clientes | 11 |
| Clientes sem nenhum pedido | 0 |
| Clientes com 1 compra | 9 |
| Clientes com recompra (>1 pedido) | 2 |
| Taxa de recompra | 18,2% |
| Ticket médio — clientes de compra única | R$ 1.166,67 |
| Ticket médio — pedidos de clientes que recompram | R$ 1.695,00 |
| Total de pedidos (via join) | 13 |

**Query 2 — visão geral de pedidos** (tabela `pedidos`, sem join):

| Métrica | Valor |
|---|---|
| Primeira data de pedido | 28/07/2026 |
| Última data de pedido | 13/08/2026 |
| Total de pedidos | 13 |
| Receita total (soma dos pedidos) | R$ 17.280,00 |
| Ticket médio geral | R$ 1.329,23 |

### Cálculos derivados (fórmulas explícitas, a partir dos números acima)

**Cross-check de consistência entre as duas queries** (bate, dá confiança nos números):

- 9 clientes de compra única × R$ 1.166,67 = R$ 10.500,03
- Pedidos de clientes que recompram = 13 − 9 = 4 pedidos (2 clientes, média de 2 pedidos cada)
- 4 pedidos × R$ 1.695,00 = R$ 6.780,00
- Soma: R$ 10.500,03 + R$ 6.780,00 = R$ 17.280,03 ≈ **R$ 17.280,00** (receita_total da Query 2 — diferença de R$ 0,03 é arredondamento). As duas queries são consistentes entre si.

**Valor médio gasto por cliente (lifetime, não por pedido):**

- Cliente de compra única: R$ 1.166,67 (um único pedido = seu total gasto)
- Cliente que recompra: R$ 6.780,00 ÷ 2 clientes = **R$ 3.390,00** em média, ao longo de ~2 pedidos cada
- Razão: cliente que recompra gastou, em média, **≈2,9x mais** no total do que um cliente de compra única — mas isso vem de **apenas 2 clientes**, tratar como sinal direcional, não como padrão estatisticamente sólido (ver ressalva abaixo).

**Pedidos por cliente (frequência geral):** 13 pedidos ÷ 11 clientes ≈ **1,18 pedidos/cliente** em média.

**Janela coberta e projeção linear simples (só para dimensionar, não para tomar como faturamento real):**

- Período: 28/07/2026 a 13/08/2026 = 17 dias corridos.
- Receita/dia no período = R$ 17.280,00 ÷ 17 ≈ **R$ 1.016,47/dia**.
- Projeção linear simples para 30 dias = R$ 1.016,47 × 30 ≈ **R$ 30.494,10/mês**.
- Esta projeção é uma extrapolação simples (regra de três), **não** uma medição de faturamento mensal real — está isolada aqui explicitamente como cálculo derivado de alto risco de erro (ver ressalvas abaixo).

### Ressalva 1 — amostra pequena, taxa de recompra estatisticamente frágil

n=11 clientes, apenas **2 casos de recompra**. Uma taxa de 18,2% construída sobre 2 casos muda inteiramente se 1 único cliente a mais (ou a menos) recomprar — viraria ~27% ou ~9%. O mesmo vale para "ticket médio de quem recompra" (R$ 1.695,00): é a média de apenas 4 pedidos. **Não trato 18,2% como uma taxa de recompra estável do negócio** — é o retrato pontual de uma base ainda muito pequena, útil como primeiro ponto de referência, não como métrica confiável para projeção ou decisão. Precisa de mais volume de dados (mais clientes, mais meses) para virar um número em que se possa confiar.

### Ressalva 2 — divergência com o baseline de 16/07/2026 (FECHADA — ver entrada "17/08/2026 (fechamento)" acima, com a explicação confirmada pelo usuário: baseline de julho desatualizado/incompleto + efeito real de crescimento via Grupo VIP)

A receita total de R$ 17.280,00 em 13 pedidos, no período de 17 dias (28/07–13/08), **diverge fortemente** do baseline informado pelo usuário em 16/07/2026 (faturamento R$ 2.000–3.000/**mês**, ticket médio R$ 200–300) e registrado na entrada abaixo deste relatório:

- Ticket médio: R$ 1.329,23 (dado agora, via banco) vs. R$ 200–300 (baseline verbal) — **≈4,4x a 6,6x maior**.
- Receita: mesmo pela leitura mais conservadora possível (tratando os R$ 17.280,00 como cobrindo só o mês de agosto até 13/08, o que não posso confirmar — ver limitação abaixo), o valor já supera sozinho tanto o baseline de R$ 2.000–3.000/mês quanto a própria meta de R$ 7.000/mês.

**Não resolvo essa divergência — sinalizo para o Strategic Manager, com hipóteses não confirmadas, nenhuma delas descartada:**

1. **Fontes/janelas diferentes.** O baseline de 16/07 foi uma estimativa verbal do usuário, "como faixas, não como valores pontuais exatos" (registrado na entrada de 16/07 abaixo) — pode simplesmente ter sido uma estimativa por baixo, feita de memória, sem consulta a registro formal (que na época nem existia: o painel admin foi decidido em 20/07/2026 e foi ao ar em 30/07/2026, segundo o histórico do projeto). Já o dado de agora vem direto do banco de produção.
2. **Nem toda venda real vira "pedido" registrado, ou o inverso.** O fluxo documentado em `docs/plataforma/arquitetura.md` é: venda fecha no WhatsApp → depois é registrada manualmente no painel. Isso abre duas possibilidades opostas: (a) parte das vendas reais ainda não foi registrada como pedido (o que faria o número real de vendas ser subestimado, não superestimado — não explicaria a divergência para cima); ou (b) os 13 pedidos registrados incluem lançamentos que não refletem o padrão normal de venda (ex.: pedidos de teste ao validar o painel recém-lançado, pedidos combinando vários produtos/itens em um valor total alto por registro, o que infla o "ticket médio por pedido" frente à noção de "ticket médio por item" que pode ter embasado a estimativa original de R$200–300).
3. **Coincidência temporal com o lançamento da plataforma.** A primeira data de pedido (28/07) fica a apenas 2 dias do painel admin ter ido ao ar (30/07, conforme histórico do projeto) — é plausível que esses 13 pedidos incluam um lançamento retroativo/catch-up de vendas represadas ao começar a usar o sistema, o que inflaria artificialmente a taxa diária observada nesses 17 dias frente a um ritmo real sustentável.

**Limitação que impede reconciliar com mais precisão:** não tenho a distribuição dos 13 pedidos por data individual (só a data mínima e a máxima do período agregado) — não posso separar quanto da receita de R$ 17.280,00 cai em julho vs. em agosto, nem calcular com confiança o "faturamento de agosto até 13/08 vs. meta de R$ 7.000" a partir desse agregado. Isso exigiria os pedidos individuais com data, não apenas o resumo.

### Leitura / interpretação

- **O dado de clientes únicos/recompra chegou e é utilizável, com a ressalva de amostra pequena (Ressalva 1) já registrada.** Isso resolve a lacuna informacional que impedia calibrar captação vs. recompra — mas o resultado em si (n pequeno, 18,2%) não é forte o suficiente para embasar sozinho uma virada de estratégia; é o primeiro ponto de referência real, a ser atualizado conforme mais pedidos entrarem no sistema.
- **O sinal direcional mais interessante desta leitura**, apesar da amostra pequena, é que clientes que recompram gastaram, em média, quase 3x mais no total (R$ 3.390 vs. R$ 1.166,67) do que clientes de compra única — mas com 2 casos, isso não deve ser tratado como conclusão, apenas como hipótese a confirmar com mais dados.
- **A divergência de receita/ticket médio frente ao baseline de julho é o achado mais relevante desta atualização, e fica em aberto — não decidi qual número é "o certo".** Se a leitura via banco (ticket médio ~R$1.329, ritmo de receita muito acima do baseline) refletir a realidade recente com mais precisão do que a estimativa verbal de julho, isso muda substancialmente a leitura de progresso vs. a meta de R$ 7.000/mês registrada até aqui — para melhor. Mas não posso confirmar isso sozinho; depende de reconciliação humana (ex.: o usuário confirmar se os 13 pedidos refletem vendas normais e completas do período, ou se há registros atípicos/de teste no meio).

### Alerta para o Strategic Manager (CMO)

- **Requer atenção agora, não pode esperar o próximo ciclo:** a divergência entre o baseline de faturamento/ticket médio de 16/07/2026 e os dados agora extraídos do banco (28/07–13/08) é grande demais para ser ignorada — se o dado do banco for mais fiel à realidade, a leitura de "quão longe da meta de R$7.000 a empresa está" pode estar desatualizada e otimista demais no lado errado (ou seja, a empresa pode estar mais perto da meta do que o relatório de 16/07 sugeria). Recomendo (sinalização, não decisão) que o CMO valide com o usuário se os 13 pedidos registrados representam o volume real e completo de vendas do período, e se algum desses pedidos é atípico (teste, backfill, pedido combinado de múltiplos itens) antes de decidir qualquer redirecionamento de estratégia com base nesses números.
- **Taxa de recompra (18,2%) e ticket médio de recompra (R$1.695) chegaram, mas com amostra muito pequena (2 clientes) — não usar como número definitivo para decisão de captação vs. recompra ainda.** Recomendo tratá-los como primeira leitura, a ser atualizada assim que houver mais volume de pedidos.
- Assim que houver mais pedidos registrados (mais semanas de uso do painel admin), volto a calcular esses números com uma base maior e mais confiável — e, se for fornecida a distribuição de pedidos por data individual, calculo a reconciliação de julho vs. agosto e a comparação direta com a meta de R$ 7.000/mês do mês corrente.

---

## 17/08/2026 — Tentativa de puxar clientes únicos/taxa de recompra (Supabase) — bloqueado

### Contexto

Pendência aberta desde 16/07/2026 (ver entrada abaixo e `docs/objetivos.md`): faltava saber o número de clientes únicos e a taxa de recompra para calibrar se o caminho mais rápido até a meta de R$ 7.000/mês é captar cliente novo ou aumentar recompra. O Strategic Manager (CMO) confirmou em 17/08/2026 que esse dado já existe na plataforma (tabelas `clientes` e `pedidos` no Supabase, ver `docs/plataforma/arquitetura.md`) e pediu para puxar agora.

### O que foi tentado

Consulta direta às tabelas `clientes` e `pedidos` via API REST do Supabase (`https://vxejfmyifbggfyjiofyb.supabase.co/rest/v1/...`), usando a chave `anon` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) disponível em `apps/admin/.env.local` e `apps/site/.env.local` — única credencial de Supabase presente no repositório (não existe `service_role` key em nenhum `.env`, decisão de arquitetura documentada explicitamente em `apps/admin/.env.local`: "Não usar service_role aqui").

Resultado empírico (comandos rodados e verificados nesta análise):

- `GET /rest/v1/clientes?select=id` → HTTP 200, corpo `[]`, header `Content-Range: */0`.
- `GET /rest/v1/pedidos?select=id` → HTTP 200, corpo `[]`, header `Content-Range: */0`.
- Teste de controle — `GET /rest/v1/produtos?select=id&limit=3` (tabela com política pública) → HTTP 200, retornou dados reais normalmente. Isso confirma que a chave, a URL e a conexão estão corretas; o problema é específico das tabelas `clientes`/`pedidos`.

### Leitura do resultado — bloqueio confirmado, não dado zero

`Content-Range: */0` com a chave `anon` em uma tabela sem política pública de SELECT (RLS) é o comportamento esperado do Supabase quando o Row Level Security filtra todas as linhas para um usuário sem permissão — a API responde 200 com lista vazia, **não** com erro 401/403 explícito. Isso é exatamente o comportamento descrito em `docs/plataforma/arquitetura.md` ("`clientes`, `pedidos` — sem política pública nenhuma. Só acessíveis com sessão autenticada do admin").

**Importante:** não é possível, com a credencial disponível, distinguir entre "a tabela está vazia de fato" e "a tabela tem dados mas o RLS está filtrando tudo para a chave anon". O array vazio retornado **não deve ser lido como "zero clientes/zero pedidos"** — seria uma aproximação indevida. É um bloqueio de acesso, não um dado.

### Bloqueio técnico e o que resolveria

Não tenho, e não vou inventar, o número de clientes únicos, taxa de recompra, ticket médio por segmento ou tempo médio entre primeira e segunda compra. Para desbloquear, é necessário um dos caminhos abaixo (nenhum executável por este agente com o acesso atual):

1. O usuário (dono, com login no painel admin) rodar a query diretamente no **Supabase SQL Editor**, autenticado — ex.: `select count(*) from clientes;`, `select count(*) from pedidos group by cliente_id having count(*) > 1;` (ajustar conforme necessidade) — e reportar o resultado a este agente.
2. O usuário exportar os dados de `clientes`/`pedidos` do painel admin (`apps/admin`, autenticado) e fornecer o export.
3. Alguém com acesso ao projeto Supabase gerar uma `service_role` key **temporária**, usá-la fora deste repositório (nunca commitada, conforme a decisão de arquitetura já registrada) para uma consulta pontual, e depois revogá-la — decisão de segurança que não cabe a este agente tomar unilateralmente, apenas sinalizar como opção técnica.

Assim que um desses caminhos trouxer o dado real, calculo e documento aqui: número de clientes únicos, quantos têm mais de um pedido (recompra) vs. só um, taxa de recompra, ticket médio geral vs. ticket médio de quem recompra, e tempo médio entre primeira e segunda compra (se a amostra permitir com confiança).

### Alerta para o Strategic Manager (CMO)

- **Pendência de dado continua aberta** — não foi possível puxar clientes únicos/taxa de recompra com o acesso disponível a este agente. Isso não é falta de esforço de coleta (o CMO já havia confirmado que o dado existe na plataforma); é uma limitação de permissão de acesso (RLS + ausência de `service_role` key no repositório, por desenho de segurança).
- **Ação necessária não é minha, é de acesso:** para resolver, alguém com sessão autenticada no admin (ou acesso ao Supabase SQL Editor) precisa rodar a consulta ou exportar os dados — ver as três opções acima. Recomendo (sinalização, não decisão) que o CMO direcione essa ação ao usuário ou avalie se cabe abrir esse acesso ao Publishing/Traffic Manager de alguma forma segura — decisão de vocês, não minha.
- Enquanto esse dado não vier, a leitura registrada em 16/07/2026 sobre "não dá para calibrar captação vs. recompra" continua sendo a leitura válida — nada mudou nessa frente hoje.

---

## 16/07/2026 — Primeiro baseline real recebido

### Dado real reportado (pelo usuário, ao vivo)

- **Faturamento mensal atual:** R$ 2.000 a R$ 3.000/mês — **faixa**, não valor pontual.
- **Ticket médio atual:** R$ 200 a R$ 300 — **faixa**, não valor pontual.
- **Tamanho atual do grupo de WhatsApp/VIP:** em média 90 pessoas.

Estes são os **primeiros números reais de negócio** recebidos por este ecossistema. Até esta data, o departamento operava sem baseline (nenhuma fonte de dado real conectada — ver pendências em `.claude/agents/analytics-manager.md`). Nenhuma outra métrica (Instagram, Meta Ads, ROI, ROAS, engajamento) foi fornecida até o momento; portanto este relatório cobre exclusivamente faturamento, ticket médio e tamanho do grupo.

### Cálculo derivado (fórmulas explícitas — projeção simples a partir das faixas informadas)

**Distância até a meta de faturamento (R$ 7.000/mês):**

- % da meta atingida hoje = faturamento atual ÷ 7.000
  - Cenário baixo: R$ 2.000 ÷ 7.000 = **28,6% da meta**
  - Cenário alto: R$ 3.000 ÷ 7.000 = **42,9% da meta**
  - Ou seja, o faturamento atual representa **entre 28,6% e 42,9%** da meta mensal.
- Falta faturar por mês = 7.000 − faturamento atual
  - Cenário baixo (faturamento de R$ 2.000): falta **R$ 5.000/mês**
  - Cenário alto (faturamento de R$ 3.000): falta **R$ 4.000/mês**
  - Ou seja, falta **entre R$ 4.000 e R$ 5.000/mês** para bater a meta, a depender de onde dentro da faixa o faturamento real está hoje.
- Multiplicador necessário = 7.000 ÷ faturamento atual
  - Cenário baixo: 7.000 ÷ 2.000 = **3,5x**
  - Cenário alto: 7.000 ÷ 3.000 = **≈2,33x**
  - Ou seja, é preciso multiplicar o faturamento atual por algo entre **2,33x e 3,5x** para atingir R$ 7.000/mês.

**Prazo:** hoje é 16/07/2026, meta é até outubro de 2026 → restam aproximadamente **3,5 meses** (de meados de julho ao fim de outubro).

**Volume de vendas/transações mensais implícito** (faturamento ÷ ticket médio — não é dado direto, é derivado combinando as duas faixas, tratando cada extremo isoladamente):

- Cenário mínimo de transações: R$ 2.000 ÷ R$ 300 (ticket alto) = **≈6,7 vendas/mês**
- Cenário máximo de transações: R$ 3.000 ÷ R$ 200 (ticket baixo) = **15 vendas/mês**
- Ou seja, o volume atual de vendas/transações por mês está, pela combinação das faixas informadas, **entre aproximadamente 7 e 15 por mês**. Importante: isso é número de **transações**, não necessariamente de **clientes únicos** — não temos dado sobre recompra, então uma pessoa pode estar sendo contada mais de uma vez aqui.

**Volume de vendas necessário para bater a meta, se o ticket médio não mudar** (7.000 ÷ ticket médio atual):

- Com ticket médio de R$ 300: 7.000 ÷ 300 = **≈23,3 vendas/mês**
- Com ticket médio de R$ 200: 7.000 ÷ 200 = **35 vendas/mês**
- Ou seja, mantendo o ticket médio na faixa atual, seriam necessárias **entre ~23 e 35 vendas/mês**, contra as ~7 a 15 de hoje — um salto de aproximadamente **2,3x a 5x** no volume de vendas, dependendo de qual extremo de cada faixa está mais próximo da realidade.

**Grupo de WhatsApp/VIP vs. teto técnico:** o WhatsApp tem um teto técnico de 1.024 membros por grupo (referência registrada em memória de sessões anteriores deste ecossistema, não em `docs/`, sinalizado aqui para rastreabilidade).

- 90 ÷ 1.024 = **≈8,8% do teto técnico ocupado**.
- Ou seja, há folga de aproximadamente **934 vagas** até o teto técnico do grupo atual.

### Leitura / interpretação

- **O ritmo atual não bate com a meta se nada mudar.** As faixas de faturamento informadas (R$ 2.000–3.000) estão muito abaixo dos R$ 7.000/mês — é necessário um crescimento de faturamento de **2,33x a 3,5x** em cerca de **3,5 meses** restantes até outubro de 2026. Isso é uma leitura de magnitude do desafio, não uma recomendação de como fechar o gap (fora do meu escopo).
- **Não é possível, com os dados atuais, dizer com segurança se a meta depende mais de trazer clientes novos ou de aumentar recompra/ticket médio.** Falta o número de clientes únicos/ativos e a taxa de recompra (pendência já registrada em `docs/objetivos.md`). O que dá para dizer: mantendo o ticket médio na faixa atual (R$ 200–300), o caminho para R$ 7.000 passa por mais que dobrar (e possivelmente até quintuplicar) o volume de vendas mensais — de ~7–15 para ~23–35. Se o ticket médio subir (upsell, recompra, produtos de maior valor), o número de vendas novas necessárias cai proporcionalmente. Sem saber quantas dessas vendas atuais já são recompra, não dá para calibrar melhor.
- **O grupo de WhatsApp/VIP está longe de qualquer limite técnico relevante** (~8,8% de um teto de 1.024). Ou seja, hoje o tamanho do grupo não é um fator restritivo para crescimento — há bastante espaço para trazer mais pessoas antes de esbarrar em qualquer limite técnico da plataforma.
- **Não tenho dado de entradas no grupo ao longo do tempo** (só a foto atual de "em média 90 pessoas"), portanto não é possível ainda calcular crescimento (variação absoluta/percentual) desse indicador, nem dizer se o ritmo de entrada no grupo está ou não alinhado com o ritmo necessário de faturamento. Isso fica marcado como dado pendente para o próximo ciclo.

### Alerta para o Strategic Manager (CMO)

- **Requer atenção agora, não pode esperar o próximo ciclo:** o gap entre faturamento atual (R$ 2.000–3.000/mês) e a meta (R$ 7.000/mês até out/2026) é grande relativo ao tempo restante (~3,5 meses) — é necessário mais que dobrar o faturamento mensal. Vale o CMO considerar se as ações em andamento (tráfego, conteúdo, funil para o grupo) têm potencial de gerar esse salto de 2,33x–3,5x no prazo, ou se a meta/prazo precisam ser revisitados — decisão que cabe ao CMO, não a este agente.
- **Dado crítico ainda faltando para decisão mais precisa:** número de clientes únicos/ativos e taxa de recompra. Sem isso, qualquer estratégia (focar em captação vs. focar em recompra/upsell) está sendo decidida sem visibilidade completa. Recomendo (como sinalização, não decisão) priorizar a coleta desse dado.
- **Sem alerta quanto ao grupo de WhatsApp em si:** não há indício de limite técnico próximo (~8,8% do teto de 1.024) — não é um gargalo hoje. Porém não há como avaliar o *ritmo* de entrada no grupo por falta de dado histórico; assim que houver mais de um ponto no tempo, isso passa a ser acompanhável.
