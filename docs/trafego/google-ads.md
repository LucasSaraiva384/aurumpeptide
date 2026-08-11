# Google Ads — Plano de Configuração e Campanha Inicial

Registrado em 2026-08-05 pelo Traffic Manager, a pedido do usuário (dono da Aurum Peptide), via Strategic Manager. Cobre o caminho completo: criação da conta → rastreamento de conversão → estrutura de campanha inicial → monitoramento contínuo. Segue o padrão de rastreabilidade do `CLAUDE.md` (seção 7) e o formato já usado em `docs/integracoes/meta.md`.

## Contexto (não repetir decisões já tomadas em outro lugar)

- **Meta de negócio e funil:** R$ 7.000/mês até outubro de 2026, funil = Atração → entrada no grupo de WhatsApp → venda (`docs/objetivos.md`). O evento de conversão principal de qualquer campanha Google Ads também é a **entrada em contato via WhatsApp** (proxy web mais próximo da entrada no grupo — a entrada no grupo em si não é rastreável do lado do site).
- **Site:** aurumpeptide.com.br (Next.js, `apps/site`), catálogo real com ~12 produtos, linhas Tirzepatida/Retatrutida/GHK-Cu, sem checkout — CTA sempre leva a um link `wa.me` (`apps/site/lib/whatsapp.ts`).
- **Rastreamento já instalado:** Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) e GA4 (`NEXT_PUBLIC_GA_ID`) já ativos em produção desde 2026-07-30 (ver `apps/site/app/layout.tsx`). Isso significa que **não partimos do zero** — falta apenas configurar o evento de conversão específico dentro do GTM/GA4 já existente, não instalar uma tag nova no site.
- **Avatar/tom/valores:** 25–55 anos, motivação estética, maior objeção é medo de golpe/produto ruim (`docs/avatar-do-cliente.md`); proibido urgência artificial ou promessa exagerada (`docs/valores.md`); registro institucional, sem termo médico infundado (`docs/tom-de-voz.md`). Isso vale igualmente para anúncios de texto no Google Ads.
- **Sem integração de API** para Google Ads hoje (diferente do Meta, que tem `scripts/meta_graph.py`). Monitoramento inicial será manual.

## Risco crítico a resolver antes de investir tempo/orçamento

Google Ads tem uma política restritiva para **"Farmacêuticos e suplementos não aprovados"** (Restricted Content Policy) que historicamente afeta peptídeos vendidos sem prescrição/registro regulatório — contas do nicho são frequentemente reprovadas na revisão de anúncio ou exigem certificação adicional (ex.: LegitScript) dependendo de como o produto é enquadrado e anunciado. Isso **não está confirmado nem descartado** para a Aurum Peptide especificamente — não tenho como saber o resultado sem testar na prática com a conta real.

Recomendação: tratar isso como **piloto de baixo risco**, não como aposta de orçamento alto:
- Primeiro anúncio criado deve ser revisado com atenção ao motivo de reprovação, se houver (a interface do Google Ads mostra a política violada).
- Evitar qualquer alegação médica/de resultado no texto do anúncio (já é regra da marca, ver `docs/tom-de-voz.md`, mas aqui também é proteção contra reprovação).
- Não escalar orçamento até o primeiro conjunto de anúncios ser aprovado e rodando establemente.
- Se a conta for suspensa, é uma informação real e deve ser reportada ao Strategic Manager como constatação, não escondida ou contornada com conta nova sem avaliar a causa.

## Pré-requisitos — o que o usuário precisa ter em mãos

Estes itens só o usuário pode fornecer/decidir (dados de negócio e de pagamento não são algo que eu deva presumir ou automatizar):

1. **Conta Google** dedicada ao negócio (recomendado não usar um Gmail pessoal genérico, para manter propriedade clara do ativo).
2. **Dados de faturamento:** nome/razão social, endereço, e forma de pagamento (cartão de crédito). `docs/marca.md` ainda não documenta a razão social/CNPJ por trás da marca — **pendência aberta**, ver seção "Perguntas em aberto".
3. **Acesso ao Google Tag Manager e à propriedade GA4** já usados no site (login do Google associado a eles) — necessário para linkar com a nova conta Google Ads e configurar o evento de conversão.
4. **Decisão de orçamento mensal/diário** disponível para Google Ads (separado do que já é ou venha a ser gasto em Meta Ads) — ver seção de orçamento abaixo.

## Passo a passo ordenado

### 1. Decisões prévias do usuário (antes de abrir a conta)
- [x] Orçamento confirmado em 2026-08-05: **R$ 400/mês, recorrente** (não é piloto único de curto prazo). Ver leitura honesta sobre o que esse valor permite na seção "Orçamento" abaixo.
- [x] Abrangência geográfica confirmada em 2026-08-05: usuário delegou a escolha ao Traffic Manager. Recomendação e justificativa na seção "Abrangência geográfica" abaixo.
- [ ] Razão social/CNPJ ainda **pendente** — usuário preencherá diretamente no cadastro de faturamento do Google Ads; não bloqueia o planejamento, só o passo 2 (criação da conta em si).

### 2. Criar a conta Google Ads (manual, só o usuário)
1. Acessar [ads.google.com](https://ads.google.com) com a conta Google do negócio.
2. Escolher o modo **"Especialista"** durante o onboarding (o modo "Smart"/simplificado tem menos controle de segmentação e tipo de campanha — não recomendado para o nível de controle que este plano pede).
3. Preencher fuso horário (Brasil) e moeda (BRL) — **não podem ser alterados depois**, conferir com atenção antes de confirmar.
4. Preencher dados de faturamento (nome/razão social, endereço, cartão de crédito).
5. Ignorar/pular a criação de campanha guiada automática do onboarding — a estrutura de campanha será montada manualmente conforme a seção abaixo, para manter o padrão de segmentação e negativação de palavras-chave.

### 3. Vincular GA4 à conta Google Ads (manual, com orientação)
1. Dentro do Google Ads: Ferramentas e configurações → Configuração → **Contas vinculadas** → Google Analytics (GA4) → selecionar a propriedade GA4 já ativa no site → Vincular.
2. Isso permite importar eventos do GA4 como conversões do Google Ads, sem precisar duplicar tags no site.

### 4. Configurar o evento de conversão (WhatsApp) — compartilhado
Este é o passo mais importante do ponto de vista de dado — sem ele, qualquer otimização de campanha é feita às cegas.

**Opção recomendada — evento de clique explícito (mais confiável):**
- Pequena alteração de código em `apps/site` (apoio técnico/dev, não é algo que eu deva executar sem coordenação, já que é código do site): ao clicar em qualquer CTA que chama `buildWhatsappLink()`, disparar `window.dataLayer.push({ event: "whatsapp_click", produto: <nome ou "geral"> })` antes de abrir o link. Isso cobre `CTAFinal.tsx`, `Hero.tsx`, `Header.tsx`, `ProductCard.tsx`, `Footer.tsx`, `EmptyState.tsx` e a página de produto — todos os pontos que já usam `buildWhatsappLink` hoje.
- No GTM (console web, login do usuário): criar um **Trigger** de Evento Personalizado (`whatsapp_click`) e uma **Tag** de evento GA4 correspondente (ex.: `clique_whatsapp`).
- No GA4: marcar o evento `clique_whatsapp` como conversão (Admin → Eventos → marcar como conversão-chave).
- No Google Ads: Conversões → Nova conversão → **Importar do Google Analytics (GA4)** → selecionar o evento `clique_whatsapp`.

**Opção alternativa — mais simples, menos precisa:** Trigger de clique de link no GTM, filtrando URLs que contenham `wa.me`, sem alteração de código. Mais rápido de configurar, porém menos confiável para links que abrem em nova aba (`target="_blank""`), podendo perder alguns cliques na medição.

Recomendo a primeira opção. Ambas dependem do GTM já instalado — nenhuma exige reinstalar tag no site.

- [x] Alteração de código (dataLayer push) — feito (commit `eb67d50`, deployado). Ver `docs/trafego/campanhas.md`, entradas de 2026-08-05.
- [x] Trigger + Tag no GTM — feito e confirmado pelo usuário.
- [x] Evento marcado como conversão no GA4 — feito e confirmado pelo usuário.
- [x] Importação da conversão para o Google Ads — feito e confirmado pelo usuário.

**Status: rastreamento ponta a ponta confirmado em produção** (evento `whatsapp_click` verificado chegando ao `dataLayer`/GTM ao vivo em `aurumpeptide.com.br`, ver `docs/trafego/campanhas.md`).

### 5. Estrutura de campanha inicial — ver detalhe na próxima seção. Montada por mim, aprovada pelo usuário antes de ativar.

### 6. Lançamento — só depois do passo 4 confirmado funcionando (testar clicando no botão de WhatsApp em produção e verificar se o evento aparece em GA4 Realtime antes de ligar a campanha).

### 7. Monitoramento contínuo (eu, Traffic Manager)
Sem integração de API para Google Ads ainda, o acompanhamento será manual:
- Cadência sugerida: revisão semanal de impressões, cliques, CTR, CPC médio, custo total, conversões (cliques em WhatsApp) e CPA.
- O usuário precisa me repassar esses números (export/print da interface do Google Ads) até que uma integração equivalente ao `scripts/meta_graph.py` exista — não tenho hoje uma forma de puxar esse dado sozinho. Isso é uma limitação a registrar, não a inventar contorno.
- Toda decisão de escalar orçamento ou pausar segue o mesmo rigor do Meta: número real + tamanho de amostra, nunca impressão.

## Estrutura de campanha recomendada

> **Histórico de idas e voltas nesta seção (2026-08-05), preservado para rastreabilidade — detalhe completo de cada etapa em `docs/trafego/campanhas.md`:**
> 1. Estrutura original: grupo por produto ("Tirzepatida", termos transacionais tipo "tirzepatida comprar").
> 2. Pivô para campanha institucional/discreta (grupo "Biotecnologia", sem nome de substância/"comprar") — motivo: preferência de posicionamento de marca do usuário, não risco de política.
> 3. **Reversão de volta à estrutura original (esta versão), decidida pelo usuário depois de pesar o alerta de volume que dei no pivô** — avaliou que o risco de a campanha institucional não conseguir gastar nem o próprio orçamento diário pesa mais do que a preferência por discrição, e priorizou captar demanda real de compra agora. A estrutura abaixo é, portanto, a mesma da primeira versão, restaurada.

**Tipo de campanha:** Pesquisa (Search). Justificativa: peptídeos são produtos de nicho com busca ativa e intenção explícita ("comprar X", "onde encontrar X") — Pesquisa captura demanda existente, ao contrário de Display/YouTube, que são melhores para criar demanda nova (e têm risco de política ainda maior para este nicho por exibirem criativo visual amplamente, sem controle de contexto de busca). Não recomendo Display/YouTube nesta fase inicial.

- **Redes:** apenas Rede de Pesquisa. Desmarcar "Incluir parceiros de pesquisa" e Rede de Display no início — controle mais apertado sobre onde o anúncio aparece, importante dado o risco de política, e evita vazar uma verba pequena para inventário de qualidade mais baixa.
- **Local:** ver seção "Abrangência geográfica" abaixo — Sudeste + Sul + DF (SP/RJ/MG/PR/SC/RS/DF), decisão confirmada em 2026-08-05, não afetada por nenhuma das mudanças de estrutura.
- **Idioma:** Português.
- **Estratégia de lances:** Manual CPC (teto de CPC baixo, ex.: R$ 1,50–R$ 2,50 por clique, a calibrar com o Planejador de Palavras-chave assim que rodar) ou "Maximize cliques" com teto de CPC equivalente. Não usar "Maximize conversões"/tROAS ainda — essas estratégias de lance automático precisam de volume de conversão (a própria Google recomenda ~30 conversões/30 dias) que uma conta de R$ 400/mês dificilmente vai atingir rápido; usar lance automático cedo demais tende a gastar mal.
- **Orçamento:** R$ 400/mês confirmado — ver leitura completa na seção "Orçamento" abaixo, incluindo o alerta sobre volume de dado esperado.

### Grupos de anúncios propostos — ajustado para R$ 400/mês

Com um orçamento desse tamanho, cobrir as três linhas (Tirzepatida, Retatrutida, GHK-Cu) com peso igual dilui o já pouco tráfego disponível a ponto de nenhuma delas gerar sinal útil rápido. Recomendação: **concentrar no início em uma única linha**, não em três frentes rasas.

1. **Tirzepatida (ad group único, ativo desde o lançamento)** — recomendo começar por aqui porque, por conhecimento geral de mercado (não é dado específico da Aurum, é o fato público de que agonistas GIP/GLP-1 como a tirzepatida tiveram grande exposição de mídia em emagrecimento no Brasil e no mundo), é a linha com maior probabilidade de ter volume de busca suficiente para uma campanha pequena efetivamente gastar o orçamento diário e gerar cliques — ao contrário de termos muito mais estreitos (Retatrutida, GHK-Cu), que arriscam ter volume de busca baixo demais para R$ 13/dia produzirem qualquer clique de forma consistente.
2. **Retatrutida e GHK-Cu — adiados**, não descartados. Retomar como grupos adicionais quando (a) o orçamento subir, ou (b) o Planejador de Palavras-chave do Google Ads confirmar que essas linhas têm volume de busca real que justifique dividir a verba.
3. **Institucional/Marca — adiado também.** Com verba tão pequena, proteger buscas de marca é menos prioritário do que captar demanda de produto; buscas pelo nome "Aurum Peptide" tendem a ter CPC baixo e podem ser revisitadas depois, sem custar caro para adicionar futuramente. (O grupo "Institucional/Biotecnologia" testado no pivô de 2026-08-05 também fica registrado aqui como candidato a retomar futuramente, caso o usuário queira revisitar a discrição mais adiante — ver keywords preservadas abaixo.)

> Antes de finalizar palavras-chave e anúncios, confirmar contra o catálogo real (`aurumpeptide.com.br/produtos`) os nomes exatos de produto e variações de dosagem ativas hoje — não vou inventar SKUs/dosagens específicas aqui sem checar a página ao vivo no momento de montar os anúncios. Também é o momento de rodar o Planejador de Palavras-chave para confirmar/corrigir a hipótese acima sobre volume de busca por linha antes de descartar de vez Retatrutida/GHK-Cu.

### Palavras-chave candidatas — grupo Tirzepatida (único ativo no lançamento)

Cauda longa e correspondência de frase/exata (não ampla), priorizando termos de menor CPC esperado em vez de termos genéricos caros ("emagrecimento" isolado, por exemplo, tende a ter CPC alto por concorrência ampla de outros nichos — evitar termos guarda-chuva):
- "tirzepatida comprar"
- "tirzepatida onde comprar"
- "comprar tirzepatida original"
- "onde encontrar tirzepatida"

**Candidatas para quando Retatrutida/GHK-Cu forem retomados** (manter registradas aqui para não perder o trabalho de levantamento, mas não subir agora):
- Retatrutida: "retatrutida comprar", "retatrutida onde comprar", "retatrutida original"
- GHK-Cu: "ghk-cu comprar", "peptídeo para pele comprar", "peptídeo regenerador de pele"
- Institucional/marca: "aurum peptide", "aurum peptide comprar"

**Candidatas institucionais/de categoria (preservadas do pivô de 2026-08-05, revertido — não ativas agora, mas registradas caso o usuário queira retomar o tom mais discreto no futuro, por exemplo como grupo adicional em paralelo depois que houver mais orçamento):** "peptídeos premium importados", "biotecnologia longevidade", "otimização humana peptídeos", "ciência aplicada longevidade", "peptídeos importados alta qualidade", "onde encontrar peptídeos importados", "peptídeos para performance e regeneração".

**Negativas sugeridas (aplicar ao grupo ativo):** "grátis", "download", "pdf", "curso", "bula", "manipulado barato", "manipulação caseira", "receita caseira", "emprego", "vaga", "estudo científico" (termos claramente informacionais/sem intenção de compra, dado que o objetivo é conversão, não tráfego/educação). Ajustar depois de ver os termos de pesquisa reais no relatório de Termos de Pesquisa — não travar a lista aqui como definitiva.

### Anúncios (Responsive Search Ads)
- Textos seguindo `docs/tom-de-voz.md` (institucional, sem termo médico infundado) e `docs/valores.md` (sem urgência artificial, sem promessa de resultado). Endereçar a objeção de confiança (`docs/avatar-do-cliente.md`) diretamente na copy — ex.: menção a procedência/seriedade, não desconto.
- Copy final deve ser produzida em conjunto com o Marketing Manager antes de subir, como em qualquer outra peça da marca.
- **Landing page:** página de produto específica (`/produtos/[slug]`) de cada linha, não a home — melhora relevância/Índice de Qualidade e leva a pessoa direto ao CTA de WhatsApp daquele produto.

## Orçamento

**Confirmado pelo usuário em 2026-08-05: R$ 400/mês, recorrente** (não é um piloto de curto prazo isolado — é o teto mensal contínuo, salvo revisão futura). Isso equivale a aproximadamente **R$ 13,33/dia** (R$ 400 ÷ 30).

Ainda não sei se esse valor é adicional ao que se pensa gastar em Meta Ads ou se divide um teto único entre os dois canais — decisão de alocação entre canais é estrutural e cabe ao Strategic Manager, não a mim; sinalizo aqui para não presumir.

### Leitura honesta sobre o que R$ 400/mês permite

Preciso ser direto sobre isso em vez de tratar o orçamento como "resolvido": **R$ 400/mês é um valor pequeno para Google Ads Pesquisa**, e é bem provável que não seja suficiente para gerar dado estatisticamente robusto rápido. Não tenho CPC real da conta (ela ainda nem existe), então o que segue é uma faixa estimada por conhecimento geral de mercado para nicho de saúde/estética no Brasil, não um número medido — trato como faixa, não como fato:

- Se o CPC médio ficar entre R$ 1,50 e R$ 4,00 (faixa plausível para o nicho, a confirmar no Planejador de Palavras-chave), R$ 13,33/dia compra entre **~3 e ~9 cliques por dia**, ou seja, **algo entre ~90 e ~270 cliques por mês**.
- Nem todo clique vira conversão (clique no WhatsApp). Sem taxa de conversão real ainda, mesmo em um cenário otimista de conversão de clique-para-WhatsApp, é plausível que o volume de conversões fique na casa de **dezenas por mês, não centenas** — abaixo do parâmetro de ~30 conversões/30 dias que o próprio Google recomenda para lances automáticos funcionarem bem, e abaixo do que normalmente se considera amostra confortável para declarar um teste A/B vencedor (ver critério de "amostra suficiente" que já sigo em Meta Ads).
- **Na prática:** é razoável esperar que leve **mais de um ciclo mensal (possivelmente 2–3 meses)** para acumular volume suficiente para uma leitura de CPA confiável, e ainda mais tempo para rodar um teste A/B de criativo/palavra-chave com significância real. Isso não significa que R$ 400/mês seja inútil — é suficiente para validar se a conta é aprovada, se o rastreamento funciona, e para começar a ver *direção* (não certeza) de custo por clique/conversão — mas não é suficiente para decisões rápidas de otimização com confiança estatística alta.

Não escondo esse ponto para "parecer resolvido": se a expectativa do usuário for ver resultado/decisão rápida com esse valor, é importante alinhar isso agora. Se o objetivo for validar viabilidade (conta aprovada, rastreamento funcionando, primeira direção de custo) antes de decidir aumentar, R$ 400/mês cumpre esse papel.

Como referência de metodologia (não como número de negócio): a abordagem de "piloto pequeno" descrita na seção de risco acima continua válida mesmo com orçamento recorrente — significa rodar as primeiras semanas monitorando de perto aprovação de anúncio e funcionamento do rastreamento, antes de considerar qualquer aumento, não que o valor em si seja temporário.

> **Nota de rastreabilidade (2026-08-05):** esta leitura foi feita para a estrutura por produto ("tirzepatida comprar" etc.). No mesmo dia, a campanha foi temporariamente redirecionada para termos institucionais (o que teria apertado ainda mais este cenário — ver `docs/trafego/campanhas.md`) e depois revertida de volta para a estrutura por produto acima, justamente por causa do risco de volume que essa mudança institucional teria trazido. A leitura de "~90–270 cliques/mês, 2–3 meses para CPA confiável" acima volta a valer como está, sem o agravante do pivô institucional.

## Abrangência geográfica

**Decisão delegada pelo usuário ao Traffic Manager em 2026-08-05** (ele não tem preferência própria de estado/região e pediu recomendação com base em algo real e defensável).

**Dado real que eu não tenho:** não existe, até o momento, nenhum registro em `docs/` de origem geográfica real dos clientes atuais da Aurum Peptide (o painel administrativo tem um campo `cidade` por cliente, conforme `docs/plataforma/arquitetura.md`, mas não fui informado do conteúdo desses registros, nem tenho acesso a consultá-los diretamente). Também não tenho, hoje, acesso a relatórios de localização do GA4 (ativo desde 30/07/2026, portanto pode já ter alguma leitura de tráfego orgânico/direto por região, mesmo que pequena) — não vou inventar esse dado. **Recomendo, como próximo passo separado, que alguém puxe esses dois dados reais** (cidade dos clientes já cadastrados no admin, e relatório de localização do GA4) para refinar esta segmentação assim que possível — provavelmente uma tarefa para o Analytics Manager.

**Na ausência desse dado, a recomendação abaixo se apoia em conhecimento público/geral sobre concentração de renda e população no Brasil (não é dado específico da Aurum) — critério: onde a concentração de população com poder aquisitivo compatível com um ticket médio de R$ 200–300 (`docs/objetivos.md`) é mais alta, já que o avatar da marca é classe média para cima (`docs/avatar-do-cliente.md`).**

**Recomendação:** não segmentar "Brasil inteiro" de forma uniforme com um orçamento de R$ 13/dia — isso dilui ainda mais uma verba pequena em regiões de menor probabilidade de conversão. Concentrar a segmentação geográfica nos estados do **Sudeste e Sul**, que concentram a maior parte da população de renda média/alta do país (é fato amplamente documentado por institutos como IBGE, não específico desta marca):

- **São Paulo** (capital + Região Metropolitana) — maior concentração populacional e de renda do país, prioridade 1.
- **Rio de Janeiro** (capital + Região Metropolitana).
- **Minas Gerais** (Belo Horizonte e região).
- **Paraná, Santa Catarina, Rio Grande do Sul** (capitais e regiões metropolitanas) — Sul tem renda per capita historicamente entre as mais altas do país.
- Incluir também **Distrito Federal (Brasília)** — maior renda per capita do país, apesar de população menor.

Excluir, nesta fase inicial, segmentação nacional uniforme incluindo regiões Norte/Nordeste/Centro-Oeste (exceto DF) — não por qualquer julgamento sobre o público dessas regiões, mas porque, sem dado de conversão real ainda, concentrar o pouco orçamento onde a probabilidade de match com o ticket médio é estatisticamente mais alta é a decisão mais defensável hoje. **Isso deve ser revisto assim que houver dado real de conversão por região** (o próprio Google Ads relata performance por localização depois de rodando) — a recomendação acima é ponto de partida, não posição definitiva.

## Divisão de responsabilidade

| Etapa | Quem faz |
|---|---|
| Login e criação da conta Google Ads | Usuário (dados de login/pagamento não são automatizáveis por mim) |
| Dados de faturamento (razão social/CNPJ, cartão) | Usuário |
| Vínculo GA4 ↔ Google Ads | Usuário, com orientação passo a passo minha |
| Trigger/Tag no GTM para o evento de conversão | Usuário (login no GTM), com orientação passo a passo minha |
| Alteração de código (`dataLayer.push` no clique do WhatsApp) | Apoio técnico/dev (fora do meu escopo de execução direta — coordenar via Strategic Manager) |
| Estrutura de campanha, grupos de anúncio, palavras-chave, copy de anúncio | Eu (Traffic Manager), copy final em conjunto com Marketing Manager |
| Aprovação da estrutura antes de ativar | Usuário |
| Monitoramento e otimização tática dentro da campanha | Eu (Traffic Manager), com dados repassados manualmente pelo usuário |
| Mudança estrutural (orçamento total, sair do canal) | Recomendação minha ao Strategic Manager, não decisão unilateral |

## Perguntas em aberto (preciso de resposta do usuário, não vou presumir)

1. ~~Orçamento mensal/diário disponível para Google Ads.~~ **Respondido em 2026-08-05: R$ 400/mês, recorrente.**
2. ~~Abrangência geográfica desejada.~~ **Respondido em 2026-08-05: delegado ao Traffic Manager — recomendação registrada na seção "Abrangência geográfica" acima.**
3. **Razão social/CNPJ da empresa por trás da Aurum Peptide** (pendência já registrada em `docs/marca.md`) — ainda em aberto. Não bloqueia o planejamento; o usuário preenche isso direto no cadastro de faturamento do Google Ads quando for criar a conta.
4. Se o orçamento de R$ 400/mês é adicional ao que se pensa gastar em Meta Ads ou divide um teto único entre os dois canais — decisão de alocação entre canais, cabe ao Strategic Manager.
5. Se já existe alguma conta Google Ads anterior (mesmo pausada/antiga) associada à marca ou ao domínio, para evitar duplicidade de conta.
6. Se o usuário está ciente e de acordo com a leitura honesta da seção "Orçamento" (R$ 400/mês provavelmente não gera dado estatisticamente robusto rápido) e com rodar um piloto pequeno primeiro, dado também o risco de política de "Farmacêuticos e suplementos não aprovados" descrito acima, antes de qualquer escalada de orçamento.
7. Pedir ao Analytics Manager (ou ao próprio usuário) para checar se há dado real de origem geográfica de clientes já cadastrados no admin (campo `cidade`) e/ou relatório de localização do GA4, para refinar a segmentação geográfica com dado real em vez da estimativa por conhecimento geral usada acima.

## Status

- [x] Conta Google Ads criada (modo Especialista, cartão cadastrado)
- [x] GA4 vinculado à conta Google Ads
- [x] Evento de conversão (clique WhatsApp) configurado e testado (confirmado em produção via `dataLayer`/GTM)
- [x] Conversão importada no Google Ads
- [x] Rodar Planejador de Palavras-chave — feito em 2026-08-06, dado real confirmou volume maior que o esperado para Retatrutida e GHK-Cu (ver `docs/trafego/campanhas.md`, entrada 2026-08-06) — expandiu a estrutura para 3 grupos de anúncios.
- [x] Campanha "Tirzepatida - Pesquisa" criada, com 3 grupos (Tirzepatida, Retatrutida, GHK-Cu), keywords em correspondência de frase, 11 negativas de campanha, orçamento/geo/idioma/lances configurados — **mantida em pausa**.
- [ ] **Bloqueio ativo:** conta pede verificação de identidade (prazo 20/08/2026) para salvar qualquer anúncio de pesquisa responsivo — nenhum anúncio foi criado ainda em nenhum grupo. Ação do usuário, não automatizável. Copy dos 3 grupos já pronta em `docs/marketing/conteudo.md`.
- [ ] Primeira campanha ativada — só depois da verificação + criação dos anúncios + revisão do usuário.
- [ ] Primeiro ciclo de anúncios aprovado pela revisão do Google (sem reprovação por política restrita).

Atualizar os checkboxes conforme cada etapa for concluída, e registrar decisões/ajustes de campanha em `docs/trafego/campanhas.md` a partir do lançamento.
