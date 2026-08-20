# Peças Produzidas — Designer Manager

Log cronológico de peças visuais executadas (ou prompts gerados, quando a geração real não estiver disponível), conforme `.claude/agents/designer-manager.md`. Cada entrada registra: briefing de origem, ferramenta(s) usada(s), decisões visuais, validação contra `docs/identidade-visual.md` e status de entrega ao Publishing Manager.

---

## 2026-07-28 — Carrossel + Stories: TG 60MG (Tirzepatida)

**Briefing de origem:** `docs/marketing/conteudo.md`, entrada "2026-07-28 — Lançamento de conteúdo: TG 60MG (Tirzepatida)".

**Contexto:** primeiro ciclo de produção real de conteúdo ponta a ponta do ecossistema Aurum — primeira vez que a geração de imagem via API (OpenAI e Gemini) foi usada de fato, billing resolvido pelo usuário no mesmo dia.

### O que foi produzido

**Carrossel de feed (Instagram + Facebook), 5 slides, 1080×1350 (4:5):**
- `docs/design/2026-07-28-tg60mg/final/slide-1-capa.png`
- `docs/design/2026-07-28-tg60mg/final/slide-2-confianca.png`
- `docs/design/2026-07-28-tg60mg/final/slide-3-produto.png`
- `docs/design/2026-07-28-tg60mg/final/slide-4-preco.png`
- `docs/design/2026-07-28-tg60mg/final/slide-5-fechamento.png`

**Stories (Instagram), 4 peças, 1080×1920 (9:16):**
- `docs/design/2026-07-28-tg60mg/final/story-1-teaser.png`
- `docs/design/2026-07-28-tg60mg/final/story-2-reveal.png`
- `docs/design/2026-07-28-tg60mg/final/story-3-confianca.png`
- `docs/design/2026-07-28-tg60mg/final/story-4-cta.png`

Todas as peças já saem com o texto do briefing aplicado sobre a arte — prontas para publicar, não apenas fundos.

### Ferramentas usadas e como

1. **Fundo institucional (base única, reaproveitada em todas as 9 peças, para garantir unidade visual da sequência):**
   - Gerado em paralelo via **OpenAI (`gpt-image-1`)** e via **Gemini (`gemini-3.1-flash-image`)**, ambos com o mesmo prompt (paleta em hex, "editorial/minimalista/institucional/premium", proibições explícitas de `docs/identidade-visual.md`, nenhum elemento gráfico/logo/texto pedido à IA).
   - Arquivos brutos: `docs/design/2026-07-28-tg60mg/raw/bg-openai-01.png` e `raw/bg-gemini-01.png`.
   - **Comparação e escolha:** o resultado do Gemini posicionava o glow mais concentrado na parte inferior central, batendo com mais precisão na especificação "glow central inferior sutil" de `docs/identidade-visual.md`; o do OpenAI tinha gradiente mais central/verticalizado. Escolhido **`bg-gemini-01.png`** como base única de todas as peças. O arquivo do OpenAI fica salvo como alternativa/referência, não descartado.
   - Essa mesma imagem de fundo foi reenquadrada (resize + crop central, sem distorcer) para os dois formatos finais (1080×1350 no feed, 1080×1920 no story), garantindo que todo o carrossel e todos os stories compartilhem exatamente o mesmo fundo.

2. **Molécula/logo — nunca gerada pela IA, sempre derivada do arquivo oficial:**
   - Em vez de pedir para a IA "desenhar uma molécula dourada" (risco real de gerar uma versão alternativa da forma, proibido por `docs/identidade-visual.md`), o recorte da molécula e do lockup completo foi extraído por processamento de imagem (detecção de cor dourada/branca) diretamente de `assets/logo-oficial.png` e `assets/logo-oficial-com-nome.png` — sem redesenhar, sem alterar proporção, sem adicionar contorno/sombra/3D.
   - Recortes resultantes (fundo transparente): `docs/design/2026-07-28-tg60mg/raw/molecule-cutout.png` e `raw/lockup-cutout.png`.
   - Esses recortes foram reaproveitados: lockup completo (molécula + "Aurum Peptide") no Slide 1 (capa) e Slide 5 (fechamento), como briefado; molécula sozinha como hero gráfico do Slide 3 (Cenário 2, ver decisão abaixo) e do Story 2; molécula sozinha em opacidade baixa (8–9%) como marca d'água nos Slides 2 e 4 e no Story 3, dentro da faixa 5–15% especificada.

3. **Composição final (texto + logo + fundo):** feita via script Python/Pillow (`docs/design/2026-07-28-tg60mg/compose.py`, script auxiliar de recorte em `extract_cutouts.py`, mantidos aqui para permitir refazer a peça facilmente quando a foto real do produto chegar). Tipografia: Georgia (serif) para títulos em dourado `#C6A55A`; Segoe UI (sans-serif) para corpo em branco gelo. Motivo: os dois scripts de API (`openai_image.py`, `gemini_image.py`) só geram imagem a partir de texto — não fazem composição literal de layout/texto/logo com a precisão e a garantia de fidelidade ao arquivo oficial que este caso exigia, então o texto e a logo foram aplicados por composição direta em vez de pedidos à IA.

### Decisões visuais específicas

- **Slide 3 (produto) — Cenário 2 confirmado no briefing:** sem foto real do produto disponível, o "produto" é representado pelo motivo gráfico da molécula dourada oficial (recorte direto de `assets/logo-oficial.png`, em tamanho grande, sem rótulo/embalagem/selo inventado). Revisitar esta peça (recompor o Slide 3 e o Story 2) assim que o usuário enviar fotos reais do TG 60mg — o restante do carrossel não precisa ser refeito, só esses dois arquivos.
- **Unidade visual:** mesmo fundo em todas as 9 peças (ver acima), mesma paleta, mesma tipografia — carrossel e stories devem ser lidos como uma única sequência editorial.
- **Stories 2 e 4 — limite técnico sinalizado para o Publishing Manager:** os stickers nativos do Instagram (link "veja mais"/swipe e caixa de pergunta aberta) são elementos de interface da própria plataforma, adicionados no app no momento da publicação — não podem ser "assados" dentro de um PNG estático.
  - No Story 2, foi incluído um selo gráfico ("VEJA NO FEED") como reforço visual, mas o **Publishing Manager ainda precisa adicionar o sticker de link nativo** ao publicar, para que o story seja de fato clicável.
  - No Story 4, a peça já traz a pergunta em texto ("Deixe sua pergunta aqui nos stories."); o **Publishing Manager precisa adicionar o sticker nativo de pergunta aberta** por cima, para habilitar a coleta de respostas descrita no briefing.
- **Margens de segurança de Stories:** texto e selo posicionados respeitando a área "segura" de Stories do Instagram (longe do topo, onde ficam nome/foto de perfil, e da faixa inferior, onde fica a caixa de resposta).

### Validação contra `docs/identidade-visual.md`

Checklist aplicado a todas as 9 peças:
- [x] Paleta oficial — verde profundo `#0D1B16`/`#0F2E25` no fundo, dourado `#C6A55A` em todos os títulos, branco gelo no corpo. Nenhuma cor proibida (roxo, azul vibrante, vermelho, neon, gradiente exagerado) usada.
- [x] Fundo padrão — gradiente radial suave, glow inferior sutil, textura leve tipo canvas; sem bokeh, luzes laranja ou brilhos exagerados.
- [x] Marca d'água — molécula oficial, opacidade 8–9% (dentro de 5–15%), sem sombra/contorno/3D (recorte plano direto do arquivo oficial).
- [x] Tipografia — serif (Georgia) em títulos, sans-serif (Segoe UI) no corpo, espaçamento generoso.
- [x] Estilo geral — editorial, minimalista, institucional, premium; layout centrado e simétrico em todas as peças.
- [x] Proibições — logo/molécula nunca redesenhada, distorcida ou recolorida; sempre derivada de `assets/logo-oficial.png` / `assets/logo-oficial-com-nome.png` por recorte direto, com escala uniforme (sem esticar).

Nenhum conflito identificado entre o briefing e `docs/identidade-visual.md` — a peça foi executada como recebida, sem necessidade de reformular a direção.

### Postagem final entregue ao Publishing Manager

- **Carrossel (Instagram + Facebook, mesma peça nos dois canais):** os 5 arquivos de `final/slide-*.png`, nesta ordem, com a legenda já pronta no briefing (`docs/marketing/conteudo.md`, seção "Peça 1 — Carrossel de feed").
- **Stories (Instagram, mesmo dia):** os 4 arquivos de `final/story-*.png`, nesta ordem — **atenção:** Story 2 precisa do sticker de link nativo e Story 4 do sticker de pergunta nativo, adicionados no app no momento de postar (ver "Decisões visuais específicas" acima).
- **Mensagem ao Grupo VIP (WhatsApp):** texto já pronto no briefing (`docs/marketing/conteudo.md`, seção "Peça 3"); pode reaproveitar `final/slide-3-produto.png` como imagem de apoio opcional, sem necessidade de peça nova.
- Sequência de publicação recomendada: Grupo VIP → 30–60 min depois, carrossel no feed (Instagram + Facebook) → Stories ao longo do dia. (Detalhado em `docs/marketing/conteudo.md`.)

### Pendências

- Assim que o usuário enviar fotos reais do TG 60mg (60mg, não 15mg), recompor Slide 3 e Story 2 usando o Cenário 1 (foto real), reaproveitando o mesmo fundo/tipografia/paleta já estabelecidos aqui.
- Publishing Manager: aplicar os stickers nativos do Instagram nos Stories 2 e 4 antes de publicar (ver acima).

### Recomposição 2026-08-17 — Slide 4 (remoção de preço, nova diretriz permanente)

**Motivo:** o usuário rejeitou o formato original do Slide 4 ("R$ 1.200 — Disponível para clientes Aurum") — nova diretriz permanente registrada em `docs/tom-de-voz.md` ("Posts de produto no Instagram/Facebook — nunca preço nem 'disponível para venda'", 2026-08-17). Correção completa (motivo, copy antes/depois, legenda) documentada pelo Marketing Manager em `docs/marketing/conteudo.md`, entrada 2026-07-28, seção "Correção pós-nova-diretriz (2026-08-17) — remoção do slide de preço". Este registro cobre apenas a execução visual.

**Escopo:** apenas o Slide 4 foi recomposto. Slides 1, 2, 3 e 5 permanecem exatamente como estavam — confirmado por mtime de arquivo (1, 2, 3 e 5 preservam o timestamp original de 28/07; só o Slide 4 tem timestamp novo de hoje), mesmo padrão de verificação já usado nas recomposições anteriores (capa do carrossel de 12/08, páginas 1/2/6 do carrossel de 14/08).

**O que mudou:** saiu o tratamento de "número grande em destaque" (que dava peso visual ao preço "R$ 1.200"). Entrou o mesmo tratamento de corpo de texto + rodapé discreto já usado na Página 4 do carrossel educacional de 12/08 (`docs/design/2026-08-12-carrossel-evidencia/compose.py`, função `pagina4()`) — título serif dourado, corpo sans-serif em bloco centralizado (em vez de numeral gigante), rodapé pequeno para fonte/disclaimer, mesma cor `GOLD_DIM` adicionada ao script desta pasta para reproduzir o padrão. Conteúdo novo (educativo, sem preço): título "Tirzepatida: o que a evidência mostra", corpo sobre aprovação regulatória FDA/ANVISA e desenho do estudo SURMOUNT-1 (fase 3, controlado por placebo, multicêntrico em 9 países, N>2.500) — **deliberadamente sem nenhum percentual de eficácia/perda de peso**, conforme a régua mais conservadora justificada pelo Marketing Manager (produto nomeado = risco maior de leitura como propaganda disfarçada). Rodapé cita a fonte (SURMOUNT-1, PMID 35658024, NEJM 2022, indexado PubMed/NIH) e o disclaimer padrão (conteúdo informativo, não constitui indicação de uso, não substitui avaliação de profissional de saúde habilitado).

**Como foi executado:** edição direta da função `slide4()` em `docs/design/2026-07-28-tg60mg/compose.py` — mesmo fundo (`raw/bg-gemini-01.png`), mesma marca d'água da molécula (recorte oficial, opacidade 8%, centralizada), mesma tipografia (Georgia serif dourado no título, Segoe UI branco gelo no corpo, Segoe UI Light no rodapé). Reexecutada isoladamente só a função `slide4()` (`import compose; compose.slide4()`), sem regenerar as demais funções/arquivos.

**Validação contra `docs/identidade-visual.md` (releitura direta da imagem):**
- [x] Dimensão 1080×1350 mantida.
- [x] Paleta oficial — fundo verde profundo `#0D1B16` (mesmo asset-base herdado), título em dourado `#C6A55A`, corpo em branco gelo, rodapé em dourado discreto (`GOLD_DIM`, mesma cor já validada no carrossel de 12/08). Nenhuma cor proibida.
- [x] Fundo — mesmo sistema institucional (gradiente radial suave, glow inferior sutil, textura canvas), inalterado, herdado de 28/07 sem regeneração.
- [x] Marca d'água — molécula oficial em opacidade 8% (dentro de 5–15%), sem sombra/contorno/3D, centralizada, idêntica à versão anterior deste mesmo slide.
- [x] Tipografia — serif (Georgia) no título, sans-serif (Segoe UI/Segoe UI Light) no corpo/rodapé, espaçamento amplo entre título, corpo e rodapé.
- [x] Estilo geral — editorial, minimalista, institucional, premium; layout centrado e simétrico, mesmo tratamento de "bloco de texto centralizado no espaço disponível" já usado na Página 4 do carrossel de 12/08.
- [x] Proibições — nenhuma alteração à logo/molécula oficial; nenhum elemento 3D, contorno ou versão alternativa introduzida.
- [x] Texto renderizado idêntico, caractere a caractere, ao copy corrigido em `docs/marketing/conteudo.md` (seção "Correção pós-nova-diretriz") — conferido por releitura direta da imagem gerada.

**Critério de bloqueio desta tarefa — confirmado explicitamente:** o novo Slide 4 **não contém preço** (nenhuma menção a "R$", valor numérico monetário ou moeda) **nem qualquer menção a "disponível para venda"/"disponível para clientes"** ou equivalente — confirmado por releitura direta do texto renderizado na imagem final (título, corpo e rodapé). Também não contém nenhum percentual de eficácia/resultado clínico, conforme a régua conservadora do briefing.

**Arquivo final atualizado:** `docs/design/2026-07-28-tg60mg/final/slide-4-preco.png` (nome do arquivo mantido, conforme instrução — só o conteúdo mudou).

**Carrossel completo, pronto para nova aprovação do usuário (não publicar ainda — decisão do Strategic Manager, não do Publishing Manager):**
1. `docs/design/2026-07-28-tg60mg/final/slide-1-capa.png` (inalterado)
2. `docs/design/2026-07-28-tg60mg/final/slide-2-confianca.png` (inalterado)
3. `docs/design/2026-07-28-tg60mg/final/slide-3-produto.png` (inalterado)
4. `docs/design/2026-07-28-tg60mg/final/slide-4-preco.png` (recomposto — sem preço)
5. `docs/design/2026-07-28-tg60mg/final/slide-5-fechamento.png` (inalterado)

Legenda associada: versão corrigida já registrada em `docs/marketing/conteudo.md`, entrada 2026-07-28, seção "Correção pós-nova-diretriz (2026-08-17)" ("Legenda — depois").

**Atualização 2026-08-18:** usuário aprovou a peça corrigida; Strategic Manager autorizou a publicação do ciclo completo. Publicado pelo Publishing Manager no Instagram (media ID `18081087101682407`) e na Página do Facebook (post ID `1186905547834934_122125795449356392`) — detalhes completos em `docs/publicacao/log.md`, entrada "2026-08-18 — Ciclo de conteúdo TG 60mg".

---

## 2026-08-12 — Carrossel educacional: peptídeos com mais evidência científica

**Briefing de origem:** `docs/marketing/conteudo.md`, entrada "2026-08-12 — Carrossel educacional: peptídeos com mais evidência científica" (Semaglutida, Tirzepatida, Retatrutida — comparativo, conteúdo puramente educacional, sem CTA de compra/preço/produto Aurum).

### Passo obrigatório cumprido: consulta aos posts reais do feed via Meta Graph API

Antes de desenhar, rodei (conforme pedido explícito do usuário):

```
MSYS_NO_PATHCONV=1 PYTHONIOENCODING=utf-8 python scripts/meta_graph.py get /17841448618880474/media --param fields=id,media_type,media_url,permalink,caption,timestamp --param limit=12
```

(Nota técnica registrada aqui para o próximo uso: no Git Bash, além do `MSYS_NO_PATHCONV=1` já documentado em `docs/integracoes/meta.md`, também foi necessário `PYTHONIOENCODING=utf-8` — sem isso o script quebra com `UnicodeEncodeError` ao imprimir caracteres acentuados/gregos de legendas reais no console Windows, cujo charset padrão é cp1252.)

Baixei e inspecionei visualmente (via WebFetch/urllib) as imagens de capa dos 3 posts mais recentes do feed real. **Achado relevante, sinalizado aqui como conflito em vez de simplesmente copiado:** o feed real hoje usa um estilo visivelmente diferente do que está formalizado em `docs/identidade-visual.md` — capas com renders de rosto humano com "pele molecular" dourada brilhante, frascos/vidros de produto fotorrealistas com tampa metálica e rótulo fabricado (ex.: "AURUM PEPTIDE — KPV 10mg", produto que não existe no catálogo real), hélices de DNA brilhantes, ícones de "check" estilo relatório clínico, e efeitos de glow/brilho intensos — o que viola diretamente as proibições explícitas do documento normativo (bokeh/luzes exageradas, elementos decorativos desnecessários, 3D chamativo, "nunca criar versões alternativas da molécula" — o ícone usado nesses posts não é derivado de `assets/logo-oficial.png`). Também identifiquei, de passagem, uma alegação factualmente imprecisa num desses posts legados ("5 Peptídeos Aprovados pela FDA" — apenas 2 dos 5 citados têm aprovação FDA, achado que não me cabe corrigir aqui mas que sinalizo por rastreabilidade; não é do escopo desta entrega).

**Confirmação cronológica relevante:** nenhum desses posts é o carrossel TG 60mg (produzido em 28/07) — o status em `docs/marketing/conteudo.md` (entrada 28/07) mostra que a publicação ainda está pendente do Publishing Manager. Ou seja, **todo o conteúdo hoje ao vivo no feed é anterior ao sistema de identidade visual documentado e aos agentes do ecossistema** — não há, até esta data, nenhuma peça publicada que já reflita `docs/identidade-visual.md`.

**Decisão tomada diante do conflito:** segui a instrução do briefing ("usar como referência de estilo real, além — não em vez — do que já está formalizado em `docs/identidade-visual.md` e do precedente do carrossel TG 60mg") e mantive `docs/identidade-visual.md` + o sistema já validado do carrossel TG 60mg como autoridade máxima, sem incorporar os elementos do feed legado que violam as proibições do documento normativo (nada de rosto humano, frasco/rótulo fabricado, DNA brilhante ou glow exagerado nesta peça). Não executei "como pedido implícito" pelo padrão do feed real onde ele conflita com a regra escrita — sinalizo aqui para o Strategic Manager/usuário decidir, em algum momento futuro, se o padrão visual documentado deve ser formalmente reforçado como o único válido daqui para frente (recomendo que sim, dado que é isso que o próprio usuário pediu ao criar `docs/identidade-visual.md` e ao aprovar o precedente de 28/07).

### O que foi produzido

**Carrossel de feed (Instagram), 6 páginas, 1080×1350 (4:5):**
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-1-capa.png`
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-2-contexto.png`
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-3-criterio.png`
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-4-ranking.png`
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-5-nao-significa.png`
- `docs/design/2026-08-12-carrossel-evidencia/final/pagina-6-fechamento.png`

Todas as 6 páginas já saem com o texto do briefing composto sobre a arte (não são apenas fundos) — prontas para publicar, dimensões conferidas (1080×1350 nas 6).

### Ferramentas usadas e como

1. **Fundo institucional — reaproveitado do carrossel TG 60mg (28/07), por decisão explícita permitida no próprio briefing** ("pode reaproveitar a base já aprovada em 28/07... ou gerar equivalente novo — critério do Designer Manager"). Optei por reaproveitar `docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png` (copiado para `docs/design/2026-08-12-carrossel-evidencia/raw/bg-gemini-01-reused.png`) em vez de gerar um fundo novo via OpenAI/Gemini — decisão deliberada para maximizar unidade visual entre os dois primeiros carrosséis reais do feed (mesmo fundo institucional nas duas peças = leitura de sequência editorial consistente, não apenas peças isoladas com "estilo parecido").
2. **Molécula/logo — nunca gerada por IA, sempre derivada dos arquivos oficiais**, reaproveitando os recortes já extraídos em 28/07 (`molecule-cutout.png`, `lockup-cutout.png`, copiados para o `raw/` desta pasta) — mesmo processo de recorte por detecção de cor sobre `assets/logo-oficial.png`/`assets/logo-oficial-com-nome.png`, sem redesenho, sem alteração de proporção/cor, sem contorno/sombra/3D.
3. **Composição final (texto + logo + fundo):** script Python/Pillow novo, `docs/design/2026-08-12-carrossel-evidencia/compose.py`, seguindo o mesmo padrão do `compose.py` do TG 60mg (mesmas fontes: Georgia serif para títulos em `#C6A55A`, Georgia Bold para nomes de peptídeo/numerais da página 3, Segoe UI para corpo em branco gelo, Segoe UI Semilight para o subtítulo da capa e o rodapé de fonte da página 4). Mesmo motivo da entrega anterior: os scripts de API de imagem (`openai_image.py`, `gemini_image.py`) geram só a partir de texto, sem controle de layout/tipografia com a precisão exigida aqui — texto e logo aplicados por composição direta.
4. **Não usei geração de imagem nova via OpenAI/Gemini/Midjourney nesta peça** — as 6 páginas são 100% tipografia + fundo reaproveitado + logo oficial, sem elemento fotográfico ou ilustrativo novo (coerente com o próprio briefing, que pede um resultado "editorial", sem qualquer imagem de seringa/frasco/comprimido/jaleco — mais seguro não introduzir nenhum elemento visual novo gerado por IA que pudesse, por acidente, produzir algo parecido com o proibido).

### Decisões visuais específicas

- **Página 3 (critério) — lista numerada:** usei numerais grandes em dourado (Georgia Bold, sem contorno/3D) ao lado de cada item, com respiro generoso entre blocos — exatamente o recurso pedido no briefing para "evitar visual de tabela clínica/bula/relatório de laboratório". Testei o resultado visualmente (Read da imagem) antes de aceitar.
- **Página 4 (ranking) — 2 iterações:** a primeira versão deixava um vão em branco grande entre o conteúdo e o rodapé de fonte; ajustei o script para centralizar o bloco dos 3 peptídeos no espaço disponível entre título e rodapé, evitando desequilíbrio. Cada peptídeo é tratado com peso visual idêntico (mesmo tamanho de fonte para nome e corpo, mesma cor dourada no nome) — reforça a leitura de "comparação neutra", não de "um se destaca sobre os outros", alinhado com a decisão de enquadramento registrada no briefing (evitar leitura de "post pró-Tirzepatida").
- **Nenhuma imagem/ícone de seringa, agulha, frasco, comprimido, jaleco ou "check" de laboratório em nenhuma das 6 páginas** — confirmado por inspeção visual de cada arquivo antes de aceitar.
- **Nenhum nome de produto do catálogo Aurum, preço, CTA de compra ou link/menção a WhatsApp/Grupo VIP em nenhuma das 6 páginas** — confirmado por releitura do texto renderizado em cada imagem (a página 6 fecha com convite genérico a comentar, sem qualquer elemento comercial, conforme a exceção deliberada registrada no briefing).
- **Unidade com o precedente de 28/07:** mesmo fundo, mesma paleta, mesma tipografia, mesmo tratamento de logo/marca d'água — as duas peças devem ser lidas como parte do mesmo padrão de feed, não como estilos concorrentes.

### Validação contra `docs/identidade-visual.md`

Checklist aplicado às 6 páginas:
- [x] Paleta oficial — verde profundo `#0D1B16` no fundo (herdado do mesmo asset validado em 28/07), dourado `#C6A55A` em todos os títulos/numerais/nomes de peptídeo, branco gelo no corpo. Nenhuma cor proibida usada.
- [x] Fundo padrão — gradiente radial suave, glow inferior sutil, textura leve tipo canvas (mesmo arquivo-base já validado em 28/07); sem bokeh, luzes laranja ou brilhos exagerados.
- [x] Marca d'água — molécula oficial em opacidade 8% (dentro de 5–15%) nas páginas 2 e 5, sem sombra/contorno/3D.
- [x] Tipografia — serif (Georgia/Georgia Bold) em títulos e nomes de peptídeo, sans-serif (Segoe UI) no corpo, espaçamento generoso.
- [x] Estilo geral — editorial, minimalista, institucional, premium; layout centrado e simétrico nas 6 páginas.
- [x] Proibições — logo/molécula nunca redesenhada, distorcida ou recolorida; sempre derivada dos arquivos oficiais por recorte direto (reaproveitado do recorte já usado em 28/07).
- [x] Proibições específicas desta peça — nenhuma imagem de seringa/agulha/frasco/comprimido/jaleco/estética de laboratório clínico; nenhum nome de produto Aurum, preço, CTA de compra ou link de WhatsApp/Grupo VIP em qualquer página.

**Conflito identificado e não incorporado (ver seção acima):** o padrão visual real hoje ao vivo no feed (@aurumpeptide) diverge de `docs/identidade-visual.md` em vários pontos. Segui o documento normativo e o precedente de 28/07, não o padrão legado — decisão registrada aqui para rastreabilidade e para eventual validação do Strategic Manager/usuário.

### Postagem final entregue ao Publishing Manager

- **Carrossel (Instagram, 6 páginas), nesta ordem:**
  1. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-1-capa.png`
  2. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-2-contexto.png`
  3. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-3-criterio.png`
  4. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-4-ranking.png`
  5. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-5-nao-significa.png`
  6. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-6-fechamento.png`
- **Legenda:** já pronta em `docs/marketing/conteudo.md`, entrada "2026-08-12 — Carrossel educacional: peptídeos com mais evidência científica", seção "Legenda (caption)" — reproduzida abaixo por conveniência:

> Evidência científica não é igual para todos os peptídeos — e essa diferença importa mais do que parece.
>
> Neste carrossel, mostramos como a ciência classifica o grau de comprovação de uma substância (da evidência pré-clínica até a aprovação por agências regulatórias internacionais) e quais peptídeos reúnem hoje o maior volume de estudos clínicos sérios sobre si.
>
> Conteúdo educacional, baseado em estudos publicados em periódicos científicos revisados por pares. Não é indicação de uso, orientação de aplicação nem promessa de resultado — apenas o retrato mais honesto que a ciência permite, até esta data.
>
> Qual peptídeo você gostaria de ver analisado com este mesmo critério? Conta pra gente nos comentários.
>
> #AurumPeptide

- **Republicação no Facebook:** não decidida neste briefing — fica com o Strategic Manager/usuário (ver `docs/marketing/conteudo.md`, seção "Status" da mesma entrada).

### Pendências

- Strategic Manager/usuário: decidir se replica no Facebook.
- Publishing Manager: publicar no Instagram, na ordem acima, com a legenda pronta.
- Sinalizado para o Strategic Manager: avaliar formalmente o descompasso entre o padrão visual real do feed (posts legados, anteriores ao ecossistema) e `docs/identidade-visual.md`, incluindo a alegação "5 Peptídeos Aprovados pela FDA" (factualmente imprecisa) identificada de passagem num post legado — nenhuma ação foi tomada sobre o feed existente, apenas registrado aqui.

### Revisão 2026-08-12 — ajuste pontual na Página 1 (capa), pós-aprovação do conteúdo

Usuário aprovou o conteúdo das 6 páginas e pediu uma única mudança: a capa (Página 1), antes texto puro (lockup pequeno + título + subtítulo), deveria ficar "mais chamativa, estilo feed do Instagram", com um elemento visual que remetesse a ciência, sem reabrir as páginas 2 a 6.

**O que mudou:** a molécula oficial (a mesma peça já usada como marca d'água nas páginas 2 e 5, derivada sem alteração de `assets/logo-oficial.png`) passou a ser o elemento gráfico protagonista da capa — grande escala (560px de largura, ~52% da largura do canvas), opacidade total, posicionada no topo. O lockup completo (molécula + "Aurum Peptide", derivado de `assets/logo-oficial-com-nome.png`) migrou do topo para o rodapé da capa, no mesmo espírito do rodapé já usado na Página 6 — efeito de moldura entre abertura e fechamento do carrossel. Título e subtítulo (texto idêntico ao aprovado) permanecem, agora abaixo da molécula grande. Isso também resolveu o vão vazio que existia na metade inferior da versão anterior. Arquivo: `docs/design/2026-08-12-carrossel-evidencia/final/pagina-1-capa.png` (1080×1350, confirmado). Mudança feita só na função `pagina1()` de `docs/design/2026-08-12-carrossel-evidencia/compose.py`; rodada isoladamente (`import compose; compose.pagina1()`), sem tocar nas demais páginas — timestamps confirmam que `pagina-2` a `pagina-6` não foram regeradas.

**Distinção aplicada (científico decorativo vs. farmacêutico/produto — mapeada com o Research Manager mais cedo no mesmo dia):** a proibição de "frasco/ampola" do briefing original é sobre frasco farmacêutico/injetável (rótulo, tampa de borracha, aparência de medicamento pronto para uso — risco regulatório de publicidade indireta/instrução de aplicação, ANVISA RDC 96/2008 e RDC 44/2009). Essa proibição segue valendo integralmente e foi respeitada aqui. O pedido desta revisão era outro: um elemento "científico" genérico e decorativo — optei pela rota mais segura sugerida no próprio pedido (motivo gráfico da molécula-logo, mais protagonista/maior), em vez de vidraria de laboratório estilizada, por derivar diretamente do ícone oficial e não introduzir nenhuma forma nova.

**Checagem visual antes de aceitar como final (Read direto da imagem gerada):**
- [x] Paleta oficial — fundo verde profundo institucional (mesmo asset-base já validado), dourado `#C6A55A` na molécula e no título, branco gelo no subtítulo. Nenhuma cor proibida.
- [x] Fundo — gradiente radial suave, glow inferior sutil, textura canvas; sem bokeh, luz laranja ou brilho exagerado.
- [x] Molécula — mesmo recorte oficial já usado no resto da peça (sem redesenho, sem contorno, sem sombra, sem 3D, sem alteração de proporção/cor); usada duas vezes na página (hero grande + dentro do lockup no rodapé), ambas idênticas ao arquivo oficial, só em escalas diferentes — não é "versão alternativa da molécula".
- [x] Tipografia — serif (Georgia) no título, sans-serif (Segoe UI Light) no subtítulo, tipografia original do lockup preservada (sem recriação em fonte diferente).
- [x] Estilo geral — editorial, minimalista, institucional, premium; composição centralizada e simétrica (margem superior ~85px, inferior ~83px).
- [x] **Verificação específica pedida pelo usuário — nada de frasco farmacêutico/rótulo/tampa de borracha/agulha/seringa/comprimido/jaleco em nenhum ponto da imagem.** Confirmado por inspeção visual direta: o único elemento gráfico novo é a molécula (linhas e nós geométricos dourados), sem qualquer forma que remeta a produto/medicamento pronto para uso.
- [x] Texto idêntico ao aprovado — título "Evidência não é igual para todos." e subtítulo "Os peptídeos com mais comprovação científica até hoje.", sem alteração de conteúdo.

Nenhum conflito encontrado; peça aceita como final sem necessidade de nova iteração.

### Postagem final atualizada — pronta para o Publishing Manager

Carrossel completo (6 páginas), com a nova capa substituindo a versão anterior, nesta ordem:
1. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-1-capa.png` (versão revisada acima)
2. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-2-contexto.png` (inalterada)
3. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-3-criterio.png` (inalterada)
4. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-4-ranking.png` (inalterada)
5. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-5-nao-significa.png` (inalterada)
6. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-6-fechamento.png` (inalterada)

Legenda: a mesma já registrada acima, sem alteração. Usuário já autorizou a publicação — não há nova rodada de checagem prevista antes do publish.

**Status de publicação (Publishing Manager, 2026-08-12):** publicado no feed do Instagram (@aurumpeptide) — media ID `17955403536215292`, permalink https://www.instagram.com/p/Db8dzKGmvkL/. Publicação na Página do Facebook decidida mas ainda não concluída, bloqueada por um gap técnico de autenticação (token de Página vs. token de System User), não relacionado à peça em si. Detalhes completos em `docs/publicacao/log.md`.

---

## 2026-08-14 — Carrossel educacional: Semax vs. Selank (peptídeos nootrópicos russos, fora do catálogo)

**Briefing de origem:** `docs/marketing/conteudo.md`, entrada "2026-08-14 — Carrossel educacional: Semax vs. Selank (peptídeos nootrópicos russos, fora do catálogo)". Pedido do Strategic Manager (CMO), roteirizado pelo Marketing Manager com insumo científico do Research Manager (`docs/pesquisa/cientifico.md`, mesma data).

**Verificação de credenciais antes de iniciar (passo obrigatório do briefing):** conferido no `.env` do projeto — `OPENAI_API_KEY` e `GEMINI_API_KEY` estão ambas preenchidas. Não houve bloqueio de credencial nesta entrega.

### O que foi produzido

**Carrossel de feed (Instagram + Facebook, mesma peça nos dois canais), 6 páginas, 1080×1350 (4:5), confirmado por inspeção de dimensão em todos os arquivos:**
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-1-capa.png`
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-2-contexto.png`
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-3-semax.png`
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-4-selank.png`
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-5-comparacao.png`
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-6-fechamento.png`

Todas as 6 páginas já saem com o texto do briefing composto sobre a arte — prontas para publicar.

### Ferramentas usadas e como

1. **Página 1 (capa) — elemento gráfico novo, gerado via OpenAI (`gpt-image-1`), por pedido explícito do usuário/briefing:** rodado `python scripts/openai_image.py "<prompt>" --out docs/design/2026-08-14-carrossel-semax-selank/raw/capa-cerebro-openai-01.png --size 1024x1536`. Prompt incorporou explicitamente: paleta em hex (`#0D1B16` fundo, `#C6A55A` linhas/nós), estilo "editorial, minimalista, institucional, premium, como capa de revista científica de alto padrão", instrução de que o cérebro deveria ser tratado como motivo gráfico decorativo/conceitual (linhas/nós geométricos, mesma lógica visual de uma molécula estilizada) — nunca anatômico/realista/render 3D/ilustração médica — e proibições explícitas do briefing (nenhum frasco, seringa, agulha, jaleco, rosto humano, glow exagerado, bokeh, luzes laranja, texto/letras/logotipo embutido na imagem). A chamada funcionou de primeira, sem necessidade de segunda tentativa.
2. **Fundo institucional (páginas 2 a 6) — reaproveitado, por decisão do Designer Manager (opção explicitamente permitida pelo briefing):** optei por reaproveitar `docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png` (via cópia já existente em `docs/design/2026-08-12-carrossel-evidencia/raw/bg-gemini-01-reused.png`, recopiada para `docs/design/2026-08-14-carrossel-semax-selank/raw/bg-gemini-01-reused.png`) em vez de gerar um fundo novo via Gemini. Motivo: esta é a terceira peça consecutiva do feed real (28/07, 12/08, 14/08) — manter o mesmo fundo-base nas três reforça a leitura de sequência editorial única da marca, e o briefing deixou esse critério explicitamente a cargo do Designer Manager. Não houve necessidade de nova chamada ao Gemini para geração de fundo nesta entrega (o Gemini não foi usado nesta peça — só o OpenAI, para a capa).
3. **Molécula/logo — nunca gerada por IA, sempre derivada dos arquivos oficiais:** reaproveitados os recortes já extraídos em 28/07 e usados novamente em 12/08 (`molecule-cutout.png`, `lockup-cutout.png`, copiados para o `raw/` desta pasta) — mesmo recorte por detecção de cor sobre `assets/logo-oficial.png`/`assets/logo-oficial-com-nome.png`, sem redesenho, sem alteração de proporção/cor, sem contorno/sombra/3D.
4. **Composição final (texto + logo + fundo):** script novo `docs/design/2026-08-14-carrossel-semax-selank/compose.py`, seguindo o mesmo padrão dos dois `compose.py` anteriores — Georgia serif (títulos, `#C6A55A`) e Georgia Bold (nomes "Semax"/"Selank" na Página 5), Segoe UI (corpo, branco gelo), Segoe UI Light (subtítulo da capa e rodapé de fonte da Página 5). Mesmo motivo já registrado nas entradas anteriores: os scripts de API de imagem geram só a partir de texto, sem controle de layout/tipografia com a precisão exigida — texto e logo aplicados por composição direta em Python/Pillow.

### Decisões visuais específicas

- **Página 1 — a imagem gerada pela OpenAI virou a base completa da capa, não um recorte colado sobre o fundo institucional padrão:** pedi no próprio prompt que a IA já gerasse o cérebro sobre o sistema de fundo institucional (verde profundo, gradiente radial suave, glow inferior sutil, textura canvas), em vez de gerar só o motivo isolado para depois colar sobre `bg-gemini-01.png`. Decisão deliberada: colar um recorte retangular de fundo gerado por uma chamada independente sobre o fundo institucional já validado corria risco real de criar uma emenda visível (tons de verde nunca são pixel-idênticos entre duas gerações distintas); pedir a mesma especificação de fundo dentro do próprio prompt evita esse problema e ainda assim mantém a peça inteiramente dentro do sistema documentado.
- **Página 1 — enquadramento da imagem gerada:** a IA retornou o cérebro posicionado no centro/meio da imagem (1024×1536), não no terço superior como pedido no prompt. Em vez de regenerar, ajustei o enquadramento por script: `bottom_align_resize()` (função nova em `compose.py`) ancora o recorte de 1080×1350 na base da imagem gerada em vez de centralizar verticalmente — isso preserva o máximo de área calma abaixo do cérebro para compor título/subtítulo/lockup sem cortar o motivo gráfico. Depois de uma primeira renderização em que o título ficava colado ao "caule" do cérebro, reduzi a margem inferior de 70px para 45px (abrindo ~25px extras de respiro entre o motivo gráfico e o título) — ajuste feito por inspeção visual direta antes de aceitar como final.
- **Página 5 (comparação) — 1 iteração por desequilíbrio vertical:** a primeira renderização deixava um vão grande e vazio entre o corpo de texto e o rodapé de fonte. Reescrevi a função para centralizar verticalmente o bloco inteiro (colunas Semax/Selank + parágrafo de fechamento) no espaço disponível entre o fim do título e o início do rodapé — mesmo ajuste já usado na Página 4 do carrossel de 12/08 pela mesma razão. Os dois blocos (Semax/Selank) usam fonte e cor idênticas (Georgia Bold dourado no nome, Segoe UI branco gelo no corpo, mesma largura de coluna) — sem hierarquia de "vencedor", conforme pedido. O elemento de conexão é uma linha fina dourada com um nó dourado central ligando os dois blocos, no lugar de qualquer ícone de "vs."/separador adversarial.
- **Nenhuma imagem/ícone de seringa, agulha, frasco, comprimido, jaleco, rosto humano, "check" de laboratório ou estética de farmácia/clínica fria em nenhuma das 6 páginas** — confirmado por inspeção visual de cada arquivo antes de aceitar.
- **Nenhum nome de produto do catálogo Aurum, preço, CTA de compra ou link/menção a WhatsApp/Grupo VIP em nenhuma das 6 páginas** — confirmado por releitura do texto renderizado (Página 6 fecha com convite genérico a comentar, mesma exceção deliberada já registrada em 12/08).
- **Restrições científicas do briefing (nenhuma linguagem "duplo-cego randomizado", "mecanismos opostos", "eficácia comprovada" Tier 1, uso crônico seguro, ou "estudo publicado no PubMed" sem qualificação) verificadas por releitura literal do texto renderizado em cada página** contra a lista de restrições do briefing — nenhuma violação encontrada; a qualificação de fonte ("publicado em periódico científico russo, indexado no PubMed", "o resumo disponível não confirma...") está presente no corpo das Páginas 3 e 4, como pedido.
- **Unidade com os dois precedentes (28/07, 12/08):** mesmo fundo nas páginas 2–6, mesma paleta, mesma tipografia, mesmo tratamento de logo/marca d'água (molécula em opacidade 8% na Página 2, dentro de 5–15%) — as três peças devem ser lidas como parte do mesmo padrão de feed.

### Validação contra `docs/identidade-visual.md`

Checklist aplicado às 6 páginas:
- [x] Paleta oficial — verde profundo `#0D1B16` no fundo (páginas 2–6 herdadas do asset validado em 28/07; página 1 gerada já dentro dessa mesma especificação de cor), dourado `#C6A55A` em títulos/nomes/nós, branco gelo no corpo. Nenhuma cor proibida (roxo, azul vibrante, vermelho, neon, gradiente exagerado) usada em nenhuma página.
- [x] Fundo padrão — gradiente radial suave, glow inferior sutil, textura leve tipo canvas nas 6 páginas; sem bokeh, luzes laranja ou brilhos exagerados (checagem específica na Página 1, por ser imagem nova gerada por IA, não só reaproveitada).
- [x] Marca d'água — molécula oficial em opacidade 8% (dentro de 5–15%) na Página 2, sem sombra/contorno/3D.
- [x] Tipografia — serif (Georgia/Georgia Bold) em títulos e nomes de peptídeo, sans-serif (Segoe UI/Segoe UI Light) no corpo/subtítulo/rodapé, espaçamento generoso.
- [x] Estilo geral — editorial, minimalista, institucional, premium; layout centrado e simétrico nas 6 páginas (Página 5 corrigida por iteração, ver acima).
- [x] Proibições — logo/molécula nunca redesenhada, distorcida ou recolorida; sempre derivada dos arquivos oficiais por recorte direto (reaproveitado dos recortes já usados em 28/07 e 12/08). O cérebro da capa é um elemento gráfico novo e deliberadamente diferente da molécula — não é apresentado nem tratado como "versão alternativa da molécula-logo", é um motivo conceitual à parte (metáfora de mente/cognição), com o lockup oficial completo, não alterado, no rodapé da mesma página.
- [x] Proibições específicas desta peça (briefing) — nenhum frasco, seringa, agulha, jaleco, rosto humano ou glow exagerado na capa; nenhuma estética de farmácia genérica/clínica fria em nenhuma das 6 páginas; nenhum ícone de "vs."/separador adversarial na Página 5.
- [x] Nenhum nome de produto Aurum, preço, CTA de compra ou link de WhatsApp/Grupo VIP em qualquer página.

Nenhum conflito identificado entre o briefing e `docs/identidade-visual.md` — peça executada como recebida, sem necessidade de reformular a direção.

### Postagem final entregue ao Publishing Manager

- **Carrossel (Instagram + Facebook, mesma peça nos dois canais), 6 páginas, nesta ordem:**
  1. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-1-capa.png`
  2. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-2-contexto.png`
  3. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-3-semax.png`
  4. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-4-selank.png`
  5. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-5-comparacao.png`
  6. `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-6-fechamento.png`
- **Legenda (idêntica nos dois canais):** já pronta em `docs/marketing/conteudo.md`, entrada "2026-08-14 — Carrossel educacional: Semax vs. Selank (peptídeos nootrópicos russos, fora do catálogo)", seção "Legenda (caption, idêntica no Instagram e no Facebook)".
- Sem stories, sem mensagem ao Grupo VIP nesta entrega — não fazem parte do briefing (conteúdo puramente educacional, sem relação com produto vendido).

### Pendências (na publicação original)

- ~~Strategic Manager/usuário: aprovar copy e briefing antes da publicação~~ — publicado em 14/08 (Instagram media ID `17896208916570217`, Facebook post ID `1186905547834934_122125024929356392`).
- ~~Publishing Manager: publicar no feed do Instagram e replicar na Página do Facebook~~ — feito. **Porém a peça foi rejeitada pelo dono da Aurum Peptide em 16/08 e apagada dos dois canais** — ver subseção "Recomposição pós-correção (2026-08-16/17)" abaixo para o motivo, a correção e o status atual.

### Recomposição pós-correção (2026-08-16/17)

**Motivo:** a peça publicada em 14/08 foi rejeitada e apagada pelo dono da Aurum Peptide em 16/08 — a copy mencionava explicitamente que Semax e Selank estão "fora do portfólio Aurum"/"não constam no portfólio comercializado pela Aurum Peptide", algo considerado irrelevante e indevido para conteúdo puramente educacional. Correção completa (motivo, diretriz permanente, texto antes/depois de cada ponto e legenda corrigida) documentada pelo Marketing Manager em `docs/marketing/conteudo.md`, entrada de 14/08, seção "Correção pós-rejeição (2026-08-16)" — este registro cobre apenas a execução visual da correção.

**Escopo da recomposição:** apenas as Páginas 1, 2 e 6 foram recompostas. Páginas 3, 4 e 5 permanecem exatamente as mesmas arquivas geradas em 14/08 — não foram reabertas nem resalvas, confirmado por timestamp de arquivo (3/4/5 preservam o mtime original de 14/08; 1/2/6 têm mtime novo de hoje), mesmo padrão de verificação já usado na revisão pontual de capa do carrossel de 12/08.

**O que mudou em cada página (texto renderizado apenas — fundo, tipografia, paleta, logo e layout idênticos ao original):**
- **Página 1 (capa):** subtítulo alterado de "O que a ciência estuda sobre Semax e Selank — peptídeos russos fora do portfólio Aurum." para "O que a ciência estuda sobre Semax e Selank — peptídeos russos." Título ("Duas moléculas. Duas perguntas sobre a mente humana.") e o elemento gráfico do cérebro estilizado dourado não mudaram — mesma arte-base `raw/capa-cerebro-openai-01.png`.
- **Página 2 (contexto):** segundo parágrafo ("Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide...") removido inteiramente. Corpo passou a ter apenas dois parágrafos, que fluem naturalmente sem a frase removida. Marca d'água da molécula (opacidade 8%) não mudou.
- **Página 6 (disclaimer/fechamento):** primeira frase do corpo alterada — removida apenas a cláusula "e não constam no portfólio comercializado pela Aurum Peptide" (o disclaimer regulatório real, FDA/ANVISA/registro na Rússia, permanece intacto). Segundo e terceiro parágrafos, pergunta de fechamento e lockup completo (`assets/logo-oficial-com-nome.png`) não mudaram.

**Como foi executado:** edição direta dos literais de texto em `docs/design/2026-08-14-carrossel-semax-selank/compose.py` (funções `pagina1()`, `pagina2()`, `pagina6()`) para refletir o texto corrigido de `docs/marketing/conteudo.md` — nenhuma mudança de layout, fonte, cor ou lógica de composição. Reexecutadas apenas essas três funções (via chamada isolada em Python, não o script inteiro) para não regravar as Páginas 3, 4 e 5.

**Validação contra `docs/identidade-visual.md` (releitura das 3 imagens novas):**
- [x] Dimensão 1080×1350 mantida nas 3 páginas recompostas (e nas 6 no total).
- [x] Paleta oficial — fundo verde profundo `#0D1B16`, título/subtítulo/nomes em dourado `#C6A55A`, corpo em branco gelo; nenhuma cor proibida.
- [x] Fundo — mesmo sistema institucional (gradiente radial suave, glow inferior sutil, textura canvas) herdado sem alteração das versões de 14/08; Página 1 mantém a mesma arte de cérebro estilizado gerada via OpenAI, sem regeneração.
- [x] Marca d'água — molécula em opacidade 8% na Página 2, sem sombra/contorno/3D, inalterada.
- [x] Logo/lockup — `assets/logo-oficial-com-nome.png` nas Páginas 1 e 6, sem distorção, sem recorte novo (reaproveitado o mesmo `lockup-cutout.png` de 14/08).
- [x] Texto renderizado idêntico, caractere a caractere, ao texto corrigido em `docs/marketing/conteudo.md` (seção "Correção pós-rejeição") — conferido por releitura direta de cada imagem.
- [x] Nenhuma menção a portfólio/venda/catálogo Aurum permanece em nenhuma das 3 páginas recompostas — confirmado.
- [x] Nenhum elemento proibido novo introduzido (sem seringa, frasco, jaleco, rosto humano, glow exagerado, cor fora da paleta).

**Arquivos finais atualizados:**
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-1-capa.png` (recomposta)
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-2-contexto.png` (recomposta)
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-6-fechamento.png` (recomposta)
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-3-semax.png` (intocada, mtime original de 14/08)
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-4-selank.png` (intocada, mtime original de 14/08)
- `docs/design/2026-08-14-carrossel-semax-selank/final/pagina-5-comparacao.png` (intocada, mtime original de 14/08)

**Entregue ao Publishing Manager:** as 6 páginas acima (3 recompostas + 3 originais) formam o carrossel corrigido, completo e pronto para nova publicação, na mesma ordem de páginas de 14/08. A legenda associada é a versão corrigida já registrada em `docs/marketing/conteudo.md`, entrada de 14/08, seção "Correção pós-rejeição (2026-08-16)" — parágrafo de portfólio removido da legenda também. Publicação depende de nova aprovação do Strategic Manager/usuário antes de seguir (não republicar automaticamente só porque a arte está pronta — mesma trava já usada na primeira publicação desta peça).
