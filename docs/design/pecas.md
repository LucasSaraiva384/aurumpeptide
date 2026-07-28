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
