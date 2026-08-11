# Conteúdo de Marketing — Aurum Peptide

Log cronológico de todo conteúdo produzido pelo Marketing Manager (copy, roteiros, briefings de peça) para rastreabilidade. Cada entrada é um pacote completo, pronto para o Designer Manager executar a peça e/ou para o Publishing Manager publicar — o Marketing Manager não desenha nem publica (ver `.claude/agents/marketing-manager.md` — ou equivalente — e `CLAUDE.md`).

Contexto lido antes desta entrega: `docs/marca.md`, `docs/missao.md`, `docs/valores.md`, `docs/tom-de-voz.md`, `docs/identidade-visual.md`, `docs/avatar-do-cliente.md`, `docs/objetivos.md`, `docs/plataforma/arquitetura.md`.

---

## 2026-07-28 — Lançamento de conteúdo: TG 60MG (Tirzepatida)

### Contexto

Primeiro ciclo de produção real de conteúdo ponta a ponta do ecossistema Aurum (nunca rodou antes — geração de imagem via API estava bloqueada por billing, resolvido pelo usuário). Primeiro produto real cadastrado na plataforma (site + admin), adicionado ao catálogo em 20/07/2026: **TG 60mg**, à base de **Tirzepatida**, **R$ 1.200** (preço confirmado direto no Supabase em 28/07 — corrigido aqui, o valor de R$750 usado na primeira versão deste brief estava desatualizado), linha de emagrecimento/metabolismo.

Não existe, até esta data, nenhuma peça de marketing publicada apresentando este ou qualquer outro produto — este é o primeiro "momento de apresentação" de produto da marca dentro do ecossistema.

### Decisão de formato

**Carrossel de Instagram (5 slides)**, publicado de forma idêntica na página do Facebook, complementado por (a) uma sequência curta de Stories no mesmo dia e (b) uma mensagem dedicada ao Grupo VIP do WhatsApp, enviada antes da publicação pública.

**Por quê carrossel, e não post único ou vídeo:**

- A maior objeção do avatar é **medo de golpe/produto ruim** (`docs/avatar-do-cliente.md`), e essa objeção deve ser endereçada **antes ou junto** do argumento de produto (`docs/avatar-do-cliente.md`, `docs/missao.md`). Um post único não dá espaço para sequenciar "confiança primeiro, produto depois" sem parecer um bloco de texto genérico em cima da imagem; o carrossel permite ritmo editorial: contexto → confiança/seriedade → produto → preço/acesso → CTA.
- É o primeiro produto real apresentado pela marca dentro deste ecossistema — vale tratá-lo como um "momento", não como mais um post de catálogo. O formato carrossel, com estética editorial/minimalista (`docs/identidade-visual.md`), comunica isso melhor do que uma imagem única.
- Não há recurso de vídeo/roteiro solicitado nem canal de vídeo (TikTok/YouTube) ativo (`docs/marca.md`) — reels fica fora de escopo por ora.
- A mensagem ao Grupo VIP antes do post público usa uma forma real de exclusividade (acesso prioritário de fato, não uma alegação fabricada) — compatível com `docs/valores.md`, que proíbe urgência artificial, mas não proíbe dar acesso prioritário real a quem já é do grupo.

### Ângulo / mensagem-chave

"Confiança antes de produto." Antes de qualquer menção a preço ou a Tirzepatida em si, o carrossel afirma o critério da marca (seriedade sobre o que vende, sem exagero — `docs/valores.md`) como resposta direta, ainda que implícita, ao medo de golpe do avatar. Só depois disso o produto é nomeado e posicionado dentro do portfólio (linha de emagrecimento/metabolismo), com preço e caminho de compra (WhatsApp/Grupo VIP), nunca com promessa de resultado.

### Lacunas sinalizadas (não presumidas neste conteúdo)

1. **Nenhum claim científico/mecanismo de ação da Tirzepatida está documentado em `docs/`.** O copy abaixo cita o nome do princípio ativo como fato de composição do produto, mas **não afirma nenhum efeito, benefício ou resultado** (ex.: "auxilia no emagrecimento", "reduz apetite"). Se a marca quiser comunicar isso no futuro, precisa vir do Research Manager com respaldo, coerente com `docs/tom-de-voz.md` ("termos médicos sem embasamento").
2. **Nenhuma restrição regulatória específica** (ANVISA, política de anúncio de saúde da Meta para peptídeos/GLP-1) está documentada em `docs/`. Este brief é para conteúdo orgânico, não para tráfego pago — antes de qualquer campanha impulsionada com este produto, o Traffic Manager/Strategic Manager devem validar isso separadamente.
3. **Confirmado em 28/07: não há foto real válida do TG 60mg disponível ainda.** As duas imagens hoje no campo `imagens` deste produto no Supabase mostram uma caixa "T.G. 15 — Tirzepatida 15mg/0,5mL" (fabricante Indufarma/Lifetech) — dosagem errada (15mg, não 60mg). Usuário confirmou que o cadastro (60mg) está certo e a foto é que está errada. Até novas fotos corretas serem enviadas, usar o **Cenário 2** da direção visual (Slide 3): motivo gráfico da molécula dourada / silhueta genérica, sem rótulo ou embalagem fabricada.
4. **Sem informação sobre apresentação, dosagem ou modo de uso** — não incluída no copy por não estar documentada/confirmada.
5. **Observação estratégica (não bloqueante):** R$ 1.200 é sensivelmente acima do ticket médio atual da marca (R$ 200–300, `docs/objetivos.md`). Não é um problema para este brief, mas vale o Strategic/Analytics Manager acompanhar como esse produto afeta o ticket médio nos próximos relatórios.

### Sequência de publicação recomendada

1. Mensagem ao **Grupo VIP** (acesso prioritário).
2. 30–60 minutos depois: **carrossel no feed do Instagram**, republicado de forma idêntica na **página do Facebook**.
3. Ao longo do mesmo dia: **sequência de Stories** no Instagram, reforçando o post do feed.

---

### Peça 1 — Carrossel de feed (Instagram + Facebook)

**Formato técnico:** 5 slides, proporção 4:5 (1080×1350), idênticos nos dois canais.

**Copy por slide:**

**Slide 1 — Capa**
- Título (serif, dourado): "Uma nova adição ao portfólio Aurum."
- Abaixo (sans-serif, branco gelo, menor): "TG 60MG"

**Slide 2 — Confiança antes de produto**
- Corpo (sans-serif, branco gelo/grafite):
  "No mercado de peptídeos, a maior dúvida de quem compra não é sobre resultado — é sobre em quem confiar.
  Por isso, todo produto que entra no portfólio Aurum segue o mesmo critério: seriedade sobre o que é vendido, sem exageros e sem promessas que a marca não possa sustentar."

**Slide 3 — Apresentação do produto**
- Título (serif, dourado): "TG 60MG"
- Corpo (sans-serif): "À base de Tirzepatida, TG 60MG é a mais nova adição à linha de emagrecimento e metabolismo do portfólio Aurum Peptide."
- (Nenhuma alegação de efeito/benefício — ver Lacuna 1.)

**Slide 4 — Preço e acesso**
- Título (serif, dourado): "R$ 1.200"
- Corpo (sans-serif): "Disponível para clientes Aurum. Informações completas e orientação, diretamente com a nossa equipe."

**Slide 5 — Fechamento / CTA**
- Corpo (sans-serif, centralizado): "Fale com a Aurum Peptide.
  Grupo VIP e atendimento via WhatsApp — link na bio."
- Logo (lockup com nome) centralizado, fechando a peça.

**Legenda (idêntica no Instagram e no Facebook):**

> Apresentamos a mais nova adição ao portfólio Aurum Peptide: TG 60MG, à base de Tirzepatida — parte da linha de emagrecimento e metabolismo da marca.
>
> Sabemos que, neste mercado, a decisão de compra passa antes de tudo por uma pergunta: em quem confiar. Por isso tratamos cada produto do nosso portfólio com o mesmo rigor — sem promessas exageradas, com a seriedade que sustenta a confiança dos nossos clientes.
>
> Informações completas, orientação e disponibilidade: fale com a nossa equipe pelo WhatsApp (link na bio) ou pelo Grupo VIP.
>
> #AurumPeptide

**CTA:** Falar via WhatsApp (link na bio) ou Grupo VIP — não há checkout no site (`docs/plataforma/arquitetura.md`), a venda sempre fecha no WhatsApp.

### Briefing visual para o Designer Manager (peça 1)

Referência normativa: `docs/identidade-visual.md` — aplicar integralmente, este briefing só destaca os pontos críticos para esta peça específica.

- **Fundo:** verde profundo institucional (`#0D1B16`), gradiente radial muito suave, glow central inferior sutil, textura leve tipo canvas premium — igual nos 5 slides, para manter unidade da sequência.
- **Paleta de texto/acento:** dourado premium (`#C6A55A`) para títulos (serif); branco gelo para corpo (sans-serif); grafite escuro como alternativa de contraste se necessário. **Nunca** roxo, azul vibrante, vermelho chamativo, neon ou gradientes exagerados.
- **Tipografia:** título serif elegante e sofisticada; corpo sans-serif limpa e moderna; espaçamento amplo, respiro visual generoso entre elementos — o carrossel deve parecer editorial, não um post de e-commerce.
- **Logo:** usar `assets/logo-oficial-com-nome.png` no Slide 1 (capa) e Slide 5 (fechamento). Marca d'água da molécula (`assets/logo-oficial.png`, opacidade 5–15%, sem sombra/contorno/3D) pode aparecer sutil nos slides 2–4. Nunca distorcer, alterar proporção, cor ou criar variações da molécula.
- **Slide 3 (produto) — decidido em 28/07: usar o Cenário 2.** Não há foto real válida do TG 60mg (ver Lacuna 3) — usar apenas o motivo gráfico da molécula dourada (ou uma silhueta elegante e genérica, sem rótulo/selo fabricado). **Não criar um rótulo, embalagem ou selo de certificação que não existam de fato**, para não sugerir uma procedência/certificação não confirmada. Revisitar o Cenário 1 (foto real composta) assim que o usuário enviar fotos corretas do produto de 60mg.
- **Evitar:** bokeh, luzes laranja, efeitos brilhantes exagerados, elementos decorativos desnecessários, qualquer estética de "farmácia genérica" ou "clínica fria" que rompa o tom premium/editorial.
- **Mood geral:** editorial, minimalista, institucional, premium — como a apresentação de um item novo em uma revista de marca, não um anúncio promocional.

---

### Peça 2 — Sequência de Stories (Instagram, mesmo dia)

Reforça o carrossel do feed; não precisa repetir todo o argumento, apenas os pontos altos + engajamento direto.

1. **Teaser:** "Algo novo chegou ao portfólio Aurum." — fundo padrão da marca, sem revelar o produto ainda.
2. **Reveal:** reaproveitar o Slide 3 do carrossel (produto) + sticker "Veja no feed" apontando para o post.
3. **Confiança (versão curta):** cartão-frase com o texto do Slide 2, condensado: "Seriedade sobre o que vendemos. Sem exageros, sem promessas que não possamos sustentar."
4. **CTA + engajamento:** "Dúvidas sobre o TG 60MG?" com sticker de pergunta aberta (coleta objeções reais dos seguidores — insumo útil para atendimento e para calibrar conteúdo futuro) + sticker de link para o WhatsApp.

**Briefing visual:** mesmo sistema do carrossel (fundo, paleta, tipografia, logo/marca d'água) — os stories 1, 3 e 4 podem ser gerados como cartões de texto simples sobre o fundo padrão; o story 2 reaproveita o asset do Slide 3.

---

### Peça 3 — Mensagem ao Grupo VIP (WhatsApp)

Enviada **antes** da publicação pública, reforçando o acesso prioritário real do grupo (não uma urgência fabricada — é a ordem real de comunicação).

> Aviso aos membros do Grupo VIP Aurum:
>
> Antes de qualquer anúncio público, o Grupo VIP tem acesso prioritário: TG 60MG, à base de Tirzepatida, acaba de entrar no portfólio Aurum Peptide, na linha de emagrecimento e metabolismo.
>
> R$ 1.200. Para informações completas e para garantir o seu, fale diretamente com a nossa equipe por aqui.

**Apoio visual (opcional):** pode reaproveitar o Slide 3 do carrossel como imagem de apoio na mensagem, sem necessidade de peça nova.

**CTA:** responder diretamente na conversa do grupo/DM para fechar com a equipe.

---

### Status

- [x] Confirmar com o usuário se existe foto real do produto físico TG 60mg para o Slide 3 (ver Lacuna 3) — confirmado 28/07: não existe ainda, usar Cenário 2 (molécula/silhueta).
- [x] Corrigir preço no brief: R$750 (desatualizado) → R$1.200 (real, confirmado via Supabase 28/07).
- [ ] Usuário: enviar/corrigir fotos reais do produto TG 60mg (60mg, não 15mg) no Supabase Storage — as duas imagens atuais no campo `imagens` são de outro produto (T.G. 15, Indufarma/Lifetech) e não devem ser usadas.
- [ ] Usuário/dev: limpar o campo `imagem_url` do produto TG 60mg no Supabase, que ainda aponta para o link hotlinkado de um concorrente (farmaciasantarita.com.py) — resquício do problema sinalizado em 21/07, ainda não resolvido no banco.
- [x] Designer Manager: executar o carrossel (5 slides) + os 4 stories, conforme briefing acima (Slide 3 = Cenário 2, molécula/silhueta) — concluído 28/07, peças e decisões registradas em `docs/design/pecas.md` e arquivos finais em `docs/design/2026-07-28-tg60mg/final/`. Entregue ao Publishing Manager (ver pendência de stickers nativos do Instagram nos Stories 2 e 4, sinalizada no log).
- [ ] Publishing Manager: publicar carrossel no Instagram e replicar na página do Facebook, na sequência descrita em "Sequência de publicação recomendada".
- [ ] Usuário/atendimento: disparar a mensagem do Grupo VIP antes da publicação pública.

---

## 2026-08-05 — Copy de Responsive Search Ad (Google Ads, grupo "Tirzepatida")

### Contexto

Pedido feito pelo Strategic Manager, a pedido do usuário: copy de anúncio de texto (RSA) para o grupo de anúncios "Tirzepatida", parte da primeira campanha de Google Ads da Aurum Peptide (plano completo em `docs/trafego/google-ads.md`, histórico de decisões — incluindo a reversão do pivô institucional de volta à estrutura por produto — em `docs/trafego/campanhas.md`). Este é um entregável de copy pura para o Traffic Manager subir na conta real; não é briefing de peça visual (não há arte nesta entrega) nem publicação.

Dados de catálogo confirmados diretamente no site ao vivo (não usei preço antigo de memória): categoria Tirzepatida tem hoje 4 produtos ativos — Tirzec 60mg (R$1.050), TG 60mg (R$1.000), King Pharma 60mg (R$1.500), ZPHC Tirzepatida 50mg (R$2.450). Landing page: `https://www.aurumpeptide.com.br/produtos?categoria=tirzepatida`.

Palavras-chave do grupo (já definidas em `docs/trafego/google-ads.md`): "tirzepatida comprar", "tirzepatida onde comprar", "comprar tirzepatida original", "onde encontrar tirzepatida" — intenção de compra direta, sem necessidade de educar sobre o que é tirzepatida.

### Headlines (15, máx. 30 caracteres)

1. Tirzepatida Original
2. Tirzepatida 60mg Aurum
3. Catálogo Tirzepatida
4. Tirzepatida | Aurum Peptide
5. Peptídeos Importados Premium
6. Procedência Garantida
7. Portfólio Premium Aurum
8. Qualidade com Procedência
9. Compre com Segurança
10. Compra Segura e Direta
11. Atendimento Sério e Direto
12. Seriedade em Cada Compra
13. Fale com Especialista Aurum
14. Solicite pelo WhatsApp
15. Atendimento via WhatsApp

Cobertura: 1–4 nome/categoria do produto; 5–8 proposta de valor real (procedência/qualidade/importado — linguagem coerente com as candidatas institucionais já levantadas em `docs/trafego/google-ads.md`); 9–12 objeção de confiança do avatar (medo de golpe/produto ruim, `docs/avatar-do-cliente.md`), com framing positivo em vez de mencionar "golpe" diretamente; 13–15 CTA clara para o WhatsApp.

### Descriptions (4, máx. 90 caracteres)

1. "Peptídeos com procedência e critério de seriedade. Atendimento direto pelo WhatsApp."
2. "Cada produto do portfólio Aurum segue o mesmo padrão de seriedade e confiança."
3. "Fale diretamente com nossa equipe pelo WhatsApp e tire suas dúvidas sem compromisso."
4. "Linha Tirzepatida no portfólio Aurum, a partir de R$1.000. Fale conosco no WhatsApp."

A description 4 é a única com preço, usando "a partir de R$1.000" (o TG 60mg, o mais barato dos 4 ativos hoje) em vez de fixar um valor único que não reflete os outros 3 produtos da categoria.

### Verificações contra regras da marca

- Nenhuma alegação médica/terapêutica nem promessa de resultado (ex. "emagrecimento garantido") — conforme `docs/tom-de-voz.md` e `docs/valores.md`.
- Nenhuma urgência artificial ("últimas unidades", "por tempo limitado") — proibido em `docs/valores.md`, também reduz risco de reprovação pela política do Google Ads para "Farmacêuticos e suplementos não aprovados" (`docs/trafego/google-ads.md`, seção "Risco crítico").
- Landing page confirmada ao vivo no catálogo antes de escrever a copy, não presumida de memória.

### Status

- [x] Copy entregue ao Traffic Manager (via Strategic Manager) para subir na conta real.
- [ ] Aprovação do usuário antes de ativar.
- [ ] Revisão de política do Google Ads após publicação — risco de reprovação por "Farmacêuticos e suplementos não aprovados" segue em aberto, só se confirma na prática (ver `docs/trafego/google-ads.md`).

---

## 2026-08-06 — Copy de Responsive Search Ads (Google Ads, grupos "Retatrutida" e "GHK-Cu")

### Contexto

Pedido feito pelo Strategic Manager, a pedido do usuário: expansão da campanha de Google Ads (mesmo plano-base de `docs/trafego/google-ads.md`) para além do grupo "Tirzepatida" (copy já registrada na entrada acima). O plano original tinha adiado Retatrutida e GHK-Cu por hipótese de baixo volume de busca — essa hipótese foi **derrubada por dado real** do Planejador de Palavras-chave do Google Ads: "ghk-cu comprar" mostrou volume surpreendentemente alto (1mil–10mil buscas/mês) e "retatrutida comprar" volume razoável (100–1mil buscas/mês). Por isso o usuário decidiu ativar os dois grupos como linhas separadas, cada uma com seu próprio anúncio — **produtos não são misturados no mesmo anúncio**, mesmo padrão de segmentação por linha já usado em Tirzepatida.

Dados de catálogo confirmados diretamente no site ao vivo (não usei preço de memória):

- **Retatrutida** — landing page `https://www.aurumpeptide.com.br/produtos?categoria=retatrutida`. 4 produtos ativos: Caneta Retatrutide ZPHC 60mg (R$1.500), VELTRANE® Gold Retatrutida 90mg (R$2.300), VELTRANE Diamond Retatrutida 120mg (R$1.500), SYNEDICA Retatrutida 40mg (R$930, o mais barato). Mesma linha de emagrecimento/metabolismo da Tirzepatida (`docs/marca.md`).
- **GHK-Cu** — landing page `https://www.aurumpeptide.com.br/produtos?categoria=ghk-cu`. Ao menos 4 produtos ativos: Biogenesis® GHK-Cu 100mg (R$499, o mais barato confirmado), Oxygen Pharma® GHK-Cu 100mg (R$750), BYOLOGIK® GHK-Cu 100mg (R$630), NeoPeptides® GHK-Cu 100mg (preço não confirmado — **lacuna sinalizada, não usado na copy**). Linha diferente das duas acima: peptídeo de regeneração/cuidado com a pele, não de emagrecimento — o ângulo da copy foi ajustado para não reutilizar a proposta de valor "emagrecimento/metabolismo" indevidamente neste grupo.

Palavras-chave de cada grupo (já candidatas em `docs/trafego/google-ads.md`, agora ativadas):
- Retatrutida: "retatrutida comprar", "retatrutida onde comprar", "retatrutida original".
- GHK-Cu: "ghk-cu comprar", "peptídeo para pele comprar", "peptídeo regenerador de pele".

### Grupo Retatrutida

**Headlines (15, máx. 30 caracteres)**

1. Retatrutida Original
2. Retatrutida no Portfólio
3. Catálogo Retatrutida
4. Retatrutida | Aurum Peptide
5. Peptídeos Importados Premium
6. Procedência Garantida
7. Portfólio Premium Aurum
8. Qualidade com Procedência
9. Compre com Segurança
10. Compra Segura e Direta
11. Atendimento Sério e Direto
12. Seriedade em Cada Compra
13. Fale com Especialista Aurum
14. Solicite pelo WhatsApp
15. Atendimento via WhatsApp

Cobertura: 1–4 nome/categoria do produto; 5–8 proposta de valor real (procedência/qualidade/importado, mesma linguagem institucional já validada no grupo Tirzepatida — coerente por ser a mesma linha de emagrecimento/metabolismo); 9–12 objeção de confiança do avatar (medo de golpe/produto ruim, `docs/avatar-do-cliente.md`), com framing positivo; 13–15 CTA clara para o WhatsApp.

**Descriptions (4, máx. 90 caracteres)**

1. "Peptídeos com procedência e critério de seriedade. Atendimento direto pelo WhatsApp."
2. "Cada produto do portfólio Aurum segue o mesmo padrão de seriedade e confiança."
3. "Fale diretamente com nossa equipe pelo WhatsApp e tire suas dúvidas sem compromisso."
4. "Linha Retatrutida no portfólio Aurum, a partir de R$930. Fale conosco no WhatsApp."

A description 4 usa "a partir de R$930" (SYNEDICA 40mg, o mais barato dos 4 ativos hoje), pelo mesmo motivo do grupo Tirzepatida: não fixar valor único que não reflita o portfólio (que vai até R$2.300).

**URL final:** `https://www.aurumpeptide.com.br/produtos?categoria=retatrutida`

### Grupo GHK-Cu

**Headlines (15, máx. 30 caracteres)**

1. GHK-Cu Original
2. GHK-Cu 100mg Aurum
3. Catálogo GHK-Cu
4. GHK-Cu | Aurum Peptide
5. Peptídeo Regenerador
6. Peptídeo para Pele
7. Portfólio Premium Aurum
8. Qualidade com Procedência
9. Compre com Segurança
10. Compra Segura e Direta
11. Atendimento Sério e Direto
12. Seriedade em Cada Compra
13. Fale com Especialista Aurum
14. Solicite pelo WhatsApp
15. Atendimento via WhatsApp

Cobertura: 1–4 nome/categoria do produto; **5–6 ângulo específico de regeneração/pele** (substituindo o ângulo de emagrecimento usado em Tirzepatida/Retatrutida — GHK-Cu é uma linha diferente, ver `docs/marca.md`), sem qualquer alegação de efeito ("regeneração"/"pele" aqui descrevem categoria do produto no portfólio, não prometem resultado); 7–8 proposta de valor institucional (procedência/qualidade), compartilhada com os demais grupos por ser um atributo de marca, não de categoria; 9–12 objeção de confiança do avatar; 13–15 CTA para o WhatsApp.

**Descriptions (4, máx. 90 caracteres)**

1. "Peptídeos com procedência e critério de seriedade. Atendimento direto pelo WhatsApp."
2. "Cada produto do portfólio Aurum segue o mesmo padrão de seriedade e confiança."
3. "Fale diretamente com nossa equipe pelo WhatsApp e tire suas dúvidas sem compromisso."
4. "Linha GHK-Cu no portfólio Aurum, a partir de R$499. Fale conosco no WhatsApp."

A description 4 usa "a partir de R$499" (Biogenesis® GHK-Cu 100mg, o mais barato confirmado dos 4 ativos hoje — o preço do NeoPeptides não entrou por não estar confirmado, ver lacuna acima).

**URL final:** `https://www.aurumpeptide.com.br/produtos?categoria=ghk-cu`

### Verificações contra regras da marca (ambos os grupos)

- Nenhuma alegação médica/terapêutica nem promessa de resultado — inclusive no GHK-Cu, onde "regeneração"/"pele" descrevem a categoria do produto no portfólio (fato de composição/classificação), não um efeito prometido, mesmo critério já aplicado ao nome "Tirzepatida" na entrada anterior (`docs/tom-de-voz.md`, `docs/valores.md`).
- Nenhuma urgência artificial — proibido em `docs/valores.md`, também reduz risco de reprovação pela política do Google Ads para "Farmacêuticos e suplementos não aprovados" (`docs/trafego/google-ads.md`, seção "Risco crítico").
- Cada grupo tem seu próprio anúncio e landing page — sem misturar produtos/linhas diferentes na mesma copy, por instrução explícita do usuário.
- Landing pages confirmadas ao vivo no catálogo antes de escrever a copy, não presumidas de memória.

### Status

- [x] Copy dos dois grupos entregue ao Traffic Manager (via Strategic Manager) para subir na conta real.
- [ ] Aprovação do usuário antes de ativar.
- [ ] Confirmar preço do NeoPeptides® GHK-Cu 100mg (lacuna aberta) — não bloqueia a ativação, só a menção futura deste produto específico em copy de preço.
- [ ] Revisão de política do Google Ads após publicação para os dois novos grupos — mesmo risco já sinalizado para o grupo Tirzepatida, ainda não confirmado nem descartado na prática (`docs/trafego/google-ads.md`).
