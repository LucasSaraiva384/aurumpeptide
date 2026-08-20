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
> R$ 1.000. Para informações completas e para garantir o seu, fale diretamente com a nossa equipe por aqui.

**Correção de preço (2026-08-17):** valor atualizado de R$ 1.200 (confirmado via Supabase em 28/07/2026) para **R$ 1.000**, preço atual real do TG 60mg confirmado no banco de produção nesta data pelo usuário, antes do disparo desta mensagem ao Grupo VIP. Não afeta o carrossel público (Slide 4 não tem mais preço, ver correção abaixo).

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

### Rejeição pós-publicação (2026-08-18) — peça inteira precisa ser reescrita, não só o Slide 4

**O que aconteceu:** o carrossel publicado em 18/08/2026 (ver `docs/publicacao/log.md`) foi apagado do Instagram pelo próprio usuário no mesmo dia. Motivo direto: "post ficou muito ruim, não tem nada de educativo e não tem um título bem feito."

**Diagnóstico:** a correção de 2026-08-17 (subseção abaixo) tratou apenas o problema mais óbvio (preço no Slide 4), mas manteve os Slides 1, 2, 3 e 5 idênticos à versão de venda original de 28/07 — inclusive a capa ("Uma nova adição ao portfólio Aurum"), que continua lendo como anúncio de lançamento de produto, não como gancho educativo. Os dois carrosséis que o usuário manteve no ar (Semax/Selank republicado em 17/08 e "Evidência não é igual para todos" de 12/08) abrem com pergunta/insight científico e só fecham com CTA — essa peça nunca foi reestruturada nesse padrão, foi um patch pontual numa peça que continuava sendo, na essência, um anúncio de produto.

**Lição permanente:** converter uma peça de venda para formato educativo exige reescrever a peça inteira (capa incluída), não só o elemento com o problema mais evidente (nesse caso, o preço). Registrar isso como critério de revisão para qualquer futura conversão de peça de venda → educativo.

**Próximo passo:** reescrita completa da peça pelo Marketing Manager, usando como referência estrutural os dois carrosséis já validados (12/08 e Semax/Selank 14–17/08): capa com gancho/pergunta científica sobre Tirzepatida (não "nova adição ao portfólio"), corpo dedicado a mecanismo/evidência, produto mencionado com naturalidade dentro do conteúdo, fechamento discreto com CTA para o Grupo VIP/WhatsApp. **Esta nova versão precisa de aprovação explícita do usuário antes de qualquer publicação** — não presumir autorização automática.

---

### Correção pós-nova-diretriz (2026-08-17) — remoção do slide de preço

**Motivo da correção:** nova diretriz permanente do usuário, registrada em `docs/tom-de-voz.md` ("Posts de produto no Instagram/Facebook — nunca preço nem 'disponível para venda'", 2026-08-17) — o usuário revisou a peça pronta deste carrossel e rejeitou o formato do Slide 4 ("R$ 1.200 — Disponível para clientes Aurum"), por limitação real de plataforma (Meta penaliza esse tipo de post para peptídeos, coerente com `docs/pesquisa/regulatorio.md`, exigência de certificação LegitScript/NABP para anúncio de medicamento/farmácia online). A ideia de fundo do carrossel (confiança antes de produto) foi aprovada; só o formato do Slide 4 muda. Todo post orgânico de produto real do portfólio passa a seguir o mesmo formato educativo/institucional já validado nos carrosséis de 12/08 e 14/08–17/08 (nomear e explicar o produto — mecanismo, categoria, evidência científica — sem preço nem framing de venda).

**Escopo da correção:** apenas o **Slide 4** e a **legenda** mudam. Slides 1, 2, 3 e 5 do carrossel de 28/07 já estão dentro da nova regra (nenhum menciona preço ou "disponível para venda") e permanecem exatamente como estavam — não recompor. A Peça 3 (mensagem ao Grupo VIP no WhatsApp) também **não muda**: a nova regra é específica de post orgânico de Instagram/Facebook; o Grupo VIP é o canal de fechamento de fato do funil (`docs/objetivos.md`), onde preço é informação esperada e legítima.

**Insumo científico usado (Research Manager, `docs/pesquisa/cientifico.md`, "Ranking de peptídeos por força de evidência científica", 12/08/2026):** Tirzepatida — Tier 1, aprovada pelo FDA (Mounjaro/diabetes tipo 2, 2022; Zepbound/obesidade, 2023) e regularizada no Brasil pela ANVISA. Evidência: Jastreboff AM et al., SURMOUNT-1, N Engl J Med. 2022;387(3):205-216, **PMID 35658024** — RCT fase 3, duplo-cego, controlado por placebo, multicêntrico (9 países, incluindo Brasil), N=2539, 72 semanas. Verificado diretamente no PubMed em 12/08/2026.

**Nota de conflito de interesse (já sinalizada pelo Research Manager em 12/08, tratada aqui com o mesmo rigor):** Tirzepatida é o princípio ativo do próprio TG 60mg — diferente do carrossel de 12/08 (onde o produto não era nomeado), aqui o produto **é** nomeado, então o risco de leitura como "propaganda disfarçada" é maior, não menor. Por isso este slide segue uma régua **mais conservadora**, não a mesma régua do carrossel de 12/08: reporta apenas status regulatório (aprovação FDA/ANVISA) e desenho do estudo (fase, controle, N, multicentricidade) — **nenhum percentual de perda de peso ou outro desfecho de eficácia é citado**, mesmo esse dado constando do estudo (`docs/pesquisa/cientifico.md` registra 16,0%–22,5% conforme dose). Isso é uma escolha deliberada, não uma omissão por falta de dado: citar o desfecho de eficácia ao lado do nome do produto que a Aurum vende seria o passo mais próximo de "prometer resultado" que este slide poderia dar, o que `docs/valores.md` e `docs/tom-de-voz.md` proíbem. Se o Strategic Manager quiser revisar esse limite no futuro, é uma decisão a se tomar explicitamente — não recomendo mudar por padrão.

**1. Slide 4 — antes (preço, removido):**
> Título (serif, dourado): "R$ 1.200"
> Corpo (sans-serif): "Disponível para clientes Aurum. Informações completas e orientação, diretamente com a nossa equipe."

**Slide 4 — depois (corrigido, conteúdo educativo sobre o produto):**
- Título (serif, dourado `#C6A55A`): **"Tirzepatida: o que a evidência mostra"**
- Corpo (sans-serif, branco gelo): **"Tirzepatida é uma das moléculas de sua classe com maior nível de comprovação científica até hoje: aprovada por agências regulatórias internacionais — FDA, nos Estados Unidos, e ANVISA, no Brasil — e avaliada no maior estudo clínico de fase 3 já publicado sobre o tema, controlado por placebo e multicêntrico em 9 países, incluindo centros no Brasil, com mais de 2.500 participantes."**
- Rodapé pequeno (sans-serif, discreto): **"Fonte: estudo publicado em periódico científico revisado por pares, indexado no PubMed/NIH (SURMOUNT-1, New England Journal of Medicine, 2022). Este conteúdo é informativo, não constitui indicação de uso e não substitui avaliação de profissional de saúde habilitado."**

**2. Legenda — antes (trecho com "disponibilidade", removido):**
> "Informações completas, orientação e disponibilidade: fale com a nossa equipe pelo WhatsApp (link na bio) ou pelo Grupo VIP."

**Legenda — depois (corrigida, completa, pronta para reuso — idêntica Instagram/Facebook):**
> Apresentamos a mais nova adição ao portfólio Aurum Peptide: TG 60MG, à base de Tirzepatida — parte da linha de emagrecimento e metabolismo da marca.
>
> Tirzepatida é hoje uma das moléculas com maior nível de evidência científica do seu tipo: aprovada por agências regulatórias internacionais (FDA e ANVISA) e avaliada no maior estudo clínico de fase 3 já publicado sobre o tema, com mais de 2.500 participantes em múltiplos países, incluindo o Brasil.
>
> Sabemos que, neste mercado, a decisão de confiar passa antes de tudo por uma pergunta: em quem confiar. Por isso tratamos cada produto do nosso portfólio com o mesmo rigor — sem promessas exageradas, com a seriedade que sustenta a confiança dos nossos clientes.
>
> Informações completas e orientação: fale com a nossa equipe pelo WhatsApp (link na bio) ou pelo Grupo VIP.
>
> #AurumPeptide

**Verificação contra a nova regra:** nenhuma menção a preço, "disponível para venda/clientes Aurum" ou equivalente em nenhum dos 5 slides nem na legenda — confirmado por releitura antes da entrega. Nenhum percentual de eficácia/resultado citado (ver nota de conflito de interesse acima). CTA de fechamento mantido para WhatsApp/Grupo VIP (redirecionamento de canal, não framing de venda dentro do post — permitido pela própria regra nova).

**Briefing visual atualizado para o Designer Manager (só o que muda):**
- **Slides 1, 2, 3 e 5: nenhuma recomposição necessária** — copy idêntica à peça já produzida em `docs/design/2026-07-28-tg60mg/final/`, reaproveitar os arquivos finais como estão.
- **Slide 4: recomposição necessária.** Sai o tratamento de "número grande em destaque" (que dava peso visual ao preço) e entra o mesmo tratamento de corpo de texto + rodapé pequeno já usado na Página 4 do carrossel de 12/08 (`docs/design/2026-08-12-carrossel-evidencia/final/pagina-4...`) — título serif dourado, corpo sans-serif em bloco (não numeral gigante), rodapé discreto para a fonte/disclaimer. Mesmo fundo (`#0D1B16`, pode reaproveitar `docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png`), mesma marca d'água sutil da molécula — não é uma peça nova do zero, é troca de conteúdo dentro do mesmo sistema visual já aprovado.
- Todas as demais proibições/diretrizes já registradas no briefing visual original (seção "Peça 1 — Carrossel de feed", acima) continuam valendo integralmente.

**Observação para a Opção 2 (Retatrutida), a considerar quando o Strategic Manager acionar esse próximo passo:** Retatrutida está no Tier 2 (`docs/pesquisa/cientifico.md`, 12/08/2026) — fase 2 concluída, ainda não aprovada por FDA/ANVISA. Um eventual "Slide 4 de evidência" para Retatrutida precisa deixar isso explícito (não aprovada ainda, fase 3 em andamento) e não emprestar o status "Tier 1/aprovado" da Tirzepatida por proximidade de categoria — mesmo cuidado de rigor, adaptado ao tier real de cada substância.

### Status (atualizado 2026-08-18)

- [x] Slide 4 e legenda revisados para remover preço/"disponível para venda", conforme nova diretriz de `docs/tom-de-voz.md` (2026-08-17) — ver correção acima.
- [x] Designer Manager: recompor apenas o Slide 4 (novo copy educativo) — concluído em 17/08, ver `docs/design/pecas.md`.
- [x] Publishing Manager: publicado no Instagram (media ID `18081087101682407`, permalink https://www.instagram.com/p/DcKgKHiDCmH/) e na Página do Facebook (post ID `1186905547834934_122125795449356392`) em 18/08/2026, com aprovação explícita do usuário para publicar o ciclo completo. Detalhes em `docs/publicacao/log.md`.
- [ ] Mensagem ao Grupo VIP (WhatsApp, preço R$ 1.000): fora do escopo de automação do Publishing Manager — sinalizado como pendência de disparo manual pelo usuário/atendimento, ver `docs/publicacao/log.md`.
- [ ] Demais pendências da entrada original de 28/07 (fotos reais do produto, campo `imagem_url` no Supabase) seguem em aberto, sem relação com esta correção.

---

### Reescrita completa (2026-08-18) — nova versão do carrossel TG 60mg, SUBSTITUI a peça publicada e apagada em 18/08

**Esta entrada substitui integralmente, como peça a usar daqui para frente, a versão publicada em 18/08/2026 e apagada pelo usuário no mesmo dia** (5 slides, capa "Uma nova adição ao portfólio Aurum" — ver histórico completo acima, "Correção pós-nova-diretriz (2026-08-17)" e "Status (atualizado 2026-08-18)", e `docs/publicacao/log.md`). O histórico anterior é mantido intacto acima para rastreabilidade — não foi apagado, apenas superado por esta reescrita.

**Motivo da reescrita (não repetir o erro de 17/08):** a correção de 17/08 trocou só o Slide 4 (preço → evidência científica) e manteve os Slides 1, 2, 3 e 5 idênticos à versão de venda original de 28/07 — a capa em particular continuou lendo como anúncio de lançamento de produto. O usuário rejeitou a peça publicada com o feedback "não tem nada de educativo e não tem um título bem feito". Esta reescrita trata a peça inteira como conteúdo novo, usando como referência estrutural real (não abstrata) os dois carrosséis que o usuário manteve no ar — "Evidência não é igual para todos" (12/08) e "Duas moléculas. Duas perguntas sobre a mente humana." — Semax vs. Selank (republicado 17/08), ambos acima neste arquivo: abrem com pergunta/insight científico, desenvolvem mecanismo/evidência com rigor, e só fecham com CTA discreto.

**O que muda estruturalmente em relação à versão rejeitada:**
- A capa não fala de "produto novo"/"portfólio" — abre com um gancho sobre comprovação científica, no mesmo espírito de "Evidência não é igual para todos.".
- Entra uma página inteira dedicada a explicar **o que significa "comprovação científica"** (critério, não substância) antes de qualquer menção a Tirzepatida — mesmo recurso usado na Página 3 do carrossel de 12/08, que faltava completamente na versão rejeitada e é, na minha leitura, a peça central do "não tem nada de educativo" do usuário.
- O produto (TG 60MG) só é nomeado depois de toda a base científica estar construída, numa página dedicada a "onde a molécula está no portfólio" — não na capa, não como manchete.
- Nenhum percentual de eficácia é citado (mesma régua conservadora da correção de 17/08 — ver nota de conflito de interesse abaixo).
- Nenhum preço, nenhum "disponível para venda" (`docs/tom-de-voz.md`).
- Fechamento com CTA discreto para Grupo VIP/WhatsApp, não como fechamento de venda.

**Insumo científico usado** (mesmo já verificado em 12/08 e reutilizado na correção de 17/08, `docs/pesquisa/cientifico.md`, "Ranking de peptídeos por força de evidência científica"): Tirzepatida — Tier 1, aprovada pelo FDA (Mounjaro/diabetes tipo 2, 2022; Zepbound/obesidade, 2023) e regularizada no Brasil pela ANVISA. Evidência: Jastreboff AM et al., SURMOUNT-1, N Engl J Med. 2022;387(3):205-216, **PMID 35658024** — RCT fase 3, duplo-cego, controlado por placebo, multicêntrico (9 países, incluindo Brasil), N=2539, 72 semanas. Classificada pelo Research Manager na "família de peptídeos metabólicos/incretínicos" (mesmo agrupamento usado no carrossel de 12/08 para Semaglutida/Tirzepatida/Retatrutida) — termo usado nesta peça por já estar documentado, sem inventar mecanismo de ação (receptor GIP/GLP-1) não verificado/registrado explicitamente pelo Research Manager em `docs/pesquisa/cientifico.md`.

**Nota de conflito de interesse (mesma já sinalizada em 12/08 e tratada com o mesmo rigor na correção de 17/08):** como o produto é nomeado nesta peça, o risco de leitura como "propaganda disfarçada" é maior do que em conteúdo sobre peptídeos fora do portfólio. Por isso a Página 5 (onde o produto é citado) usa enquadramento estritamente informativo — "a molécula está presente neste produto do portfólio, com o mesmo critério de seriedade de qualquer outro" — nunca "por que comprar", nunca desfecho de eficácia ao lado do nome do produto. Regra mantida: **nenhum percentual de perda de peso/eficácia é citado em nenhuma página**, mesmo constando do estudo (16,0%–22,5% conforme dose, `docs/pesquisa/cientifico.md`) — decisão deliberada, não omissão por falta de dado.

### Formato

Carrossel de Instagram, **6 páginas** (ajustado de 5 para 6 em relação ao formato técnico original de 28/07, para abrir espaço à página de critério/metodologia que faltava — mesmo padrão técnico dos carrosséis de 12/08 e 14/08), proporção 4:5 (1080×1350). Publicado de forma idêntica na Página do Facebook (canal ativo, `docs/marca.md`), mesma legenda.

### Copy por página

**Página 1 — Capa**
- Título (serif, dourado `#C6A55A`): **"Nem toda molécula chega à aprovação regulatória."**
- Subtítulo (sans-serif, branco gelo, menor, abaixo do título): **"O que a ciência diz sobre a Tirzepatida — e por que isso importa antes de qualquer decisão de confiança."**

**Página 2 — Contexto**
- Corpo (sans-serif, branco gelo):
  "No mercado de peptídeos metabólicos, é comum ouvir falar em moléculas 'promissoras'. Mas poucas de fato percorrem o caminho mais rigoroso da ciência: ensaios clínicos controlados, revisão regulatória, aprovação por agências internacionais.
  A Tirzepatida é uma delas. Antes de falar sobre ela especificamente, vale entender o que esse nível de comprovação significa de fato — e por que nem toda substância chega até ali."

**Página 3 — Critério (o que significa "comprovação científica")**
- Título (serif, dourado): **"Como a ciência classifica esse tipo de comprovação"**
- Corpo (sans-serif, lista numerada):
  "1. Aprovação por agências regulatórias internacionais — como FDA e ANVISA — que exige revisão completa de segurança e eficácia.
  2. Estudos clínicos controlados em humanos, de fase 2 ou 3, com número relevante de participantes.
  3. Multicentricidade — o mesmo estudo conduzido em diferentes países, incluindo o Brasil.
  4. Desenho duplo-cego, controlado por placebo, para isolar o efeito real da substância do efeito esperado por quem participa."

**Página 4 — Tirzepatida: o que a evidência mostra**
- Título (serif, dourado): **"Tirzepatida: o que a evidência mostra"**
- Corpo (sans-serif): **"Tirzepatida é uma das moléculas de sua classe com maior nível de comprovação científica até hoje: aprovada por agências regulatórias internacionais — FDA, nos Estados Unidos, e ANVISA, no Brasil — e avaliada no maior estudo clínico de fase 3 já publicado sobre o tema, controlado por placebo e multicêntrico em 9 países, incluindo centros no Brasil, com mais de 2.500 participantes."**
- Rodapé pequeno (sans-serif, discreto): **"Fonte: estudo publicado em periódico científico revisado por pares, indexado no PubMed/NIH (SURMOUNT-1, New England Journal of Medicine, 2022). Este conteúdo é informativo, não constitui indicação de uso e não substitui avaliação de profissional de saúde habilitado."**

(Páginas 4 reaproveita, verbatim, o copy já validado na correção de 17/08 para o antigo Slide 4 — texto já revisado quanto à régua conservadora de eficácia, sem necessidade de reescrever.)

**Página 5 — Onde a Tirzepatida está no portfólio Aurum**
- Título (serif, dourado): **"Tirzepatida no portfólio Aurum"**
- Corpo (sans-serif): **"Dentro da linha de emagrecimento e metabolismo do portfólio Aurum, a Tirzepatida está presente no TG 60MG — tratado com o mesmo critério aplicado a qualquer produto da marca: seriedade sobre o que é oferecido, sem exagero e sem promessa de resultado individual."**
- (Nenhum preço, nenhuma menção a disponibilidade/compra nesta página — ver verificação abaixo.)

**Página 6 — Fechamento**
- Título (serif, dourado): **"A ciência evolui — e a informação também deveria"**
- Corpo (sans-serif, centralizado): **"Este conteúdo é informativo. Não constitui indicação de uso, não substitui avaliação de profissional de saúde habilitado e não promete resultado individual.
  Tem dúvidas sobre a Tirzepatida ou sobre os produtos da Aurum? Fale com a gente pelo WhatsApp ou no Grupo VIP — link na bio."**
- Logo (lockup com nome) centralizado, fechando a peça.

### Legenda (idêntica no Instagram e no Facebook)

> Nem toda molécula do mercado de peptídeos metabólicos percorre o caminho mais rigoroso da ciência: ensaios clínicos controlados, revisão regulatória, aprovação por agências internacionais.
>
> A Tirzepatida é uma das que percorreu: aprovada por agências regulatórias internacionais (FDA e ANVISA) e avaliada no maior estudo clínico de fase 3 já publicado sobre o tema, controlado por placebo e multicêntrico em 9 países, incluindo centros no Brasil, com mais de 2.500 participantes.
>
> Na linha de emagrecimento e metabolismo do portfólio Aurum, a Tirzepatida está presente no TG 60MG — tratado com o mesmo critério de seriedade que aplicamos a qualquer produto da marca, sem exagero e sem promessa de resultado individual.
>
> Este conteúdo é informativo, baseado em estudo publicado em periódico científico revisado por pares (SURMOUNT-1, New England Journal of Medicine, 2022). Não constitui indicação de uso e não substitui avaliação de profissional de saúde habilitado.
>
> Dúvidas sobre a Tirzepatida ou sobre nossos produtos? Fale com a gente pelo WhatsApp (link na bio) ou no Grupo VIP.
>
> #AurumPeptide

### Verificações contra as regras da marca

- **Nenhum preço, nenhum "disponível para venda"/"disponível para clientes Aurum"** em nenhuma das 6 páginas nem na legenda — confirmado por releitura antes do registro (`docs/tom-de-voz.md`, "Posts de produto no Instagram/Facebook").
- **Nenhum percentual de eficácia/perda de peso** citado, em nenhuma página — mesma régua conservadora de 17/08, ver "Nota de conflito de interesse" acima.
- **Capa e Página 2 não mencionam "produto novo"/"portfólio"/"lançamento"** — abrem com pergunta científica, não com anúncio.
- **Página de critério/metodologia (Página 3) presente** — endereça diretamente o "não tem nada de educativo" do feedback do usuário.
- **Produto nomeado só a partir da Página 5**, com enquadramento informativo ("está presente em", não "compre") — endereça a nota de conflito de interesse do Research Manager sem deixar de nomear o produto, como pedido pelo Strategic Manager.
- **Fechamento discreto** — CTA para WhatsApp/Grupo VIP, sem linguagem de "fechamento de venda"/urgência (`docs/valores.md`).
- **Disclaimer regulatório presente** — "não constitui indicação de uso", "não substitui avaliação de profissional de saúde habilitado" (Página 4 e Página 6, e na legenda).

### Briefing visual para o Designer Manager (preparado, mas não acionado — ver "Status" abaixo)

Referência normativa: `docs/identidade-visual.md`, aplicar integralmente. Formato técnico, paleta, tipografia, tratamento de logo e proibições gerais seguem o mesmo padrão já validado nos carrosséis de 28/07, 12/08 e 14/08 (`docs/design/pecas.md`) — este briefing só destaca o que é específico desta peça.

- **Formato técnico:** 6 páginas, proporção 4:5 (1080×1350).
- **Fundo (todas as páginas):** mesmo sistema institucional — verde profundo `#0D1B16`, gradiente radial muito suave, glow central inferior sutil, textura leve tipo canvas premium. **Reaproveitar `docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png`** (já usado nas 3 peças anteriores da série, inclusive nos dois carrosséis validados de 12/08 e 14/08) — sem necessidade de gerar fundo novo.
- **Molécula/lockup:** reaproveitar `docs/design/2026-07-28-tg60mg/raw/molecule-cutout.png` e `docs/design/2026-07-28-tg60mg/raw/lockup-cutout.png` (recortes já preparados na primeira produção) como marca d'água (páginas 2–5, opacidade 5–15%, sem sombra/contorno/3D) e como lockup completo na capa/fechamento — não é necessário gerar nova arte da molécula.
- **Nenhuma das 5 imagens finais compostas em `docs/design/2026-07-28-tg60mg/final/` é reaproveitável como está** — o texto já está "queimado" em cada PNG (composto via script) e reflete a copy rejeitada ("Uma nova adição ao portfólio Aurum", preço, etc.). **Todas as 6 páginas desta peça precisam ser recompostas do zero** a partir do fundo e dos recortes de molécula/lockup (raw assets acima), com a copy nova — mesmo processo de composição já usado nos carrosséis de 12/08 e 14/08 (script tipo `compose.py`, texto e logo aplicados via Python/Pillow sobre a arte-base, nunca pedindo ao gerador de imagem para escrever texto).
- **Página 3 (critério/metodologia):** usar o mesmo recurso tipográfico já validado na Página 3 do carrossel de 12/08 (`docs/design/2026-08-12-carrossel-evidencia/final/pagina-3-criterio.png`) — numerais dourados grandes, respiro entre blocos, hierarquia elegante. Evitar qualquer visual que pareça "tabela clínica", "bula" ou "relatório de laboratório".
- **Página 4 (Tirzepatida: evidência):** mesmo tratamento visual já usado no Slide 4 recomposto em 17/08 (bloco de corpo de texto + rodapé pequeno para fonte/disclaimer, não numeral grande) — pode reaproveitar a composição de layout, só trocando o texto de capa/vizinhança para bater com a nova sequência de 6 páginas.
- **Página 5 (produto no portfólio):** tratamento discreto — nada de "hero shot" de produto/preço em destaque; título serif + corpo em bloco, no mesmo nível visual das páginas 2 e 3, sem hierarquia de "página de venda". Não criar rótulo, embalagem ou selo de certificação que não existam de fato (mesma restrição já registrada em 28/07 — sem foto real válida do TG 60mg ainda).
- **Paleta de texto/acento:** dourado premium `#C6A55A` para títulos (serif); branco gelo para corpo (sans-serif); grafite escuro como contraste alternativo se necessário. Nunca roxo, azul vibrante, vermelho chamativo, neon ou gradientes exagerados.
- **Tipografia:** título serif elegante e sofisticada; corpo sans-serif limpa e moderna; espaçamento amplo, respiro visual generoso.
- **Logo:** lockup completo (`assets/logo-oficial-com-nome.png`, ou o recorte já pronto `lockup-cutout.png`) na capa (página 1) e no fechamento (página 6). Marca d'água da molécula nas páginas 2–5.
- **Evitar explicitamente, nas 6 páginas:** imagens de seringa, agulha, frasco/ampola, comprimido, jaleco, ícones de "check" estilo laboratório clínico, ou qualquer estética de "farmácia genérica"/"clínica fria" — esta é uma peça editorial/científica, mesmo nomeando o produto na Página 5.
- **Proibido em qualquer uma das 6 páginas:** preço, "disponível para venda"/"disponível para clientes Aurum", numeral de preço em destaque.
- **Mood geral:** editorial, minimalista, institucional, premium — como uma matéria de revista científica de alto padrão, não um anúncio de lançamento.

### Status

- [x] Reescrita completa da copy (6 páginas + legenda) concluída pelo Marketing Manager, usando como referência estrutural real os carrosséis de 12/08 e 14/08–17/08 (`docs/marketing/conteudo.md`, entradas acima).
- [x] Verificação contra `docs/tom-de-voz.md` (sem preço/venda), `docs/valores.md` (sem promessa/urgência) e nota de conflito de interesse do Research Manager (produto nomeado só a partir da Página 5, sem desfecho de eficácia) — concluída, ver "Verificações contra as regras da marca" acima.
- [x] Briefing visual preparado, com asset reuse mapeado (fundo, molécula, lockup de `docs/design/2026-07-28-tg60mg/raw/`) — pronto para o Designer Manager executar quando autorizado.
- [ ] **Designer Manager NÃO foi acionado.** Por instrução explícita do Strategic Manager (CMO), esta peça precisa da revisão do CMO e da aprovação explícita do usuário antes de qualquer briefing formal ao Designer Manager — a autorização de publicação autônoma anterior não cobre esta peça reescrita.
- [ ] **Publishing Manager NÃO foi acionado** — mesma razão acima; só depois da peça executada e aprovada.
- [ ] Demais pendências da entrada original de 28/07 (fotos reais do produto TG 60mg, campo `imagem_url` no Supabase) seguem em aberto, sem relação com esta reescrita.

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

---

## 2026-08-12 — Avaliação estratégica: calculadora de dose (mg→UI→mL, "seringa") como imã de tráfego no site

### Contexto

O usuário encontrou, no site de um médico (`diegomaier.com`, com CTA de teleconsulta), uma calculadora de conversão de dose para seringa (mg ↔ UI ↔ mL, slider visual estilo seringa U-100) e pediu avaliação estratégica (não técnica — viabilidade técnica já confirmada pelo usuário) sobre construir algo parecido em `aurumpeptide.com.br` como imã de tráfego SEO para buscas do tipo "quantos UI é X mg". Esta é uma entrada de avaliação/refinamento de ideia, não uma decisão de construir — nada foi implementado.

Consultados antes do parecer: `docs/marca.md`, `docs/missao.md`, `docs/valores.md`, `docs/identidade-visual.md`, `docs/tom-de-voz.md`, `docs/avatar-do-cliente.md`, `docs/objetivos.md`, `docs/analytics/relatorios.md`, `docs/plataforma/arquitetura.md`, `docs/pesquisa/regulatorio.md`, `docs/trafego/campanhas.md`, `docs/trafego/google-ads.md`. Delegado a **Research Manager** (risco regulatório ANVISA/exercício ilegal da medicina/políticas Google e Meta Ads — achados completos em `docs/pesquisa/regulatorio.md`, seção "Calculadora de dose (mg→UI→mL, 'seringa') no site — avaliação de risco", 12/08/2026) e a **Marketing Manager** (enquadramento de tom/CTA/disclaimer e comparação com alternativa de conteúdo).

### Parecer do CMO — com ressalvas fortes: não construir agora, nem a versão de-riscada

**Diferença estrutural em relação à referência:** o site de origem é de um médico, com responsabilidade profissional e teleconsulta associada. A Aurum é uma marca de venda direta ao consumidor, sem responsável médico associado à venda (`docs/marca.md`) — a mesma ferramenta muda de natureza ao trocar de contexto: deixa de ser orientação clínica amparada por um profissional habilitado e passa a ser, na leitura do Research Manager, "orientação de uso/preparo" de injetável publicada por quem vende ativamente o produto.

**Motivos da ressalva (convergência das duas consultas):**

1. **Risco regulatório real e não removível apenas pela forma.** `docs/pesquisa/regulatorio.md` já registra alerta da ANVISA (03/07/2026) classificando GHK-Cu, BPC-157, TB-500, CJC-1295 e Ipamorelina como sem registro em nenhuma categoria no Brasil, com comercialização para uso em saúde/estética considerada ilegal — itens que fazem parte do portfólio ativo da Aurum. O Research Manager conclui que o risco sanitário-administrativo (RDC 44/2009, Lei 6.437/77) é inerente ao contexto do negócio (venda ativa desses itens), não apenas à forma da calculadora — "des-clinicalizar" a ferramenta (sem seringa, sem produto nomeado, com disclaimer) reduz mais o risco de reprovação em Google/Meta Ads do que o risco regulatório de fundo.
2. **Risco concreto para as contas de tráfego pago já ativas, no pior momento possível.** A Aurum já roda campanhas de Google Ads nomeando Tirzepatida, Retatrutida e GHK-Cu no mesmo domínio (`docs/trafego/campanhas.md`). O Google Ads avalia o site de destino como um todo (política "Destination requirements", confirmada em fonte primária), e suspensões por conteúdo de saúde/farmacêuticos não aprovados podem ocorrer sem aviso prévio. Publicar uma calculadora de preparo de seringa no mesmo domínio aumenta a superfície de conteúdo revisável, no exato momento em que a meta de faturamento (R$7.000/mês até outubro/2026, `docs/objetivos.md`) está criticamente atrás do ritmo necessário (faturamento atual entre 28,6% e 42,9% da meta, `docs/analytics/relatorios.md`) e depende diretamente dessas campanhas continuarem no ar.
3. **Não ataca a objeção que decide a venda.** Segundo o Marketing Manager, a maior objeção do avatar é medo de golpe/procedência duvidosa (`docs/avatar-do-cliente.md`, `docs/missao.md`) — uma calculadora de dose resolve uma dúvida de uso/aplicação (tipicamente pós-compra), não a dúvida de confiança que decide se a pessoa compra. Tráfego de "quantos UI é X mg" tem intenção operacional, não intenção de decisão de compra.
4. **Risco de coerência de marca.** Oferecer publicamente uma ferramenta de cálculo de dose, sem responsável médico associado, tensiona com o próprio `docs/marca.md` ("não é uma clínica ou serviço de aplicação/acompanhamento médico") — pode passar a impressão de autoridade clínica que a marca explicitamente não tem e não deve simular.

### Alternativa recomendada (lado a lado com o pedido original)

Em vez da calculadora, investir o mesmo esforço de produção em **conteúdo educativo de confiança/procedência** (glossário de peptídeos, como identificar produto sério, diferenças entre fabricantes/procedência). Vantagens sobre a calculadora, para a prioridade vigente:

- Ataca diretamente a objeção nº1 do avatar, que `docs/missao.md` e `docs/avatar-do-cliente.md` tratam como argumento central de venda, não secundário.
- Também gera busca orgânica relevante ("peptídeo é seguro", "como saber se peptídeo é original"), mas com intenção de busca já alinhada à decisão de compra.
- Sem dependência de aval jurídico prévio nem risco para as contas de anúncio ativas — pode começar a ser produzido imediatamente pelo Marketing Manager.
- Reforça o eixo de "confiança/segurança percebida" que `docs/missao.md` define como o diferencial competitivo central da marca.

### Conceito lapidado (se o usuário ainda quiser retomar a calculadora no futuro)

Não recomendado como prioridade agora, mas caso o usuário decida seguir mais adiante, a versão de menor risco relativo (ainda não risco zero, segundo o Research Manager) seria:

- **Sem visual de seringa/agulha**, sem vínculo a produto ou concentração específica do catálogo Aurum — apresentar como "conversor de unidades" abstrato (mg ↔ UI ↔ mL), não como ferramenta de preparo/aplicação.
- **Vocabulário:** nunca "dose recomendada", "posologia" ou "orientação de uso" — apenas "conversão"/"cálculo de equivalência" (Marketing Manager).
- **Disclaimer explícito:** ferramenta matemática, não constitui indicação de uso/posologia/orientação médica, não substitui avaliação de profissional de saúde habilitado, e reforça que a Aurum é marca de venda direta sem acompanhamento clínico.
- **CTA para o Grupo VIP do WhatsApp** ("dúvidas sobre nossos produtos, procedência ou como funciona a compra?"), nunca "agende sua teleconsulta" — mantém o funil alinhado a `docs/objetivos.md` sem prometer algo que a marca não entrega.
- **Pré-requisito inegociável antes de publicar qualquer versão:** avaliação de advogado especializado em direito sanitário/regulatório — recomendação explícita do Research Manager, fora do que uma pesquisa de IA pode resolver com segurança.

### Status

- [x] Avaliação estratégica concluída (Strategic Manager, com Research Manager e Marketing Manager).
- [x] Risco regulatório detalhado registrado em `docs/pesquisa/regulatorio.md` (12/08/2026).
- [x] Reformulação do usuário avaliada (ver adendo abaixo, 12/08/2026) — parecer mantido.
- [ ] Validação do usuário sobre o parecer (não construir agora / priorizar conteúdo de confiança-procedência).
- [ ] Se o usuário quiser retomar a calculadora no futuro: aval jurídico prévio, obrigatório antes de qualquer execução.

### Adendo (12/08/2026) — reformulação: página isolada, sem CTA de venda, "ensinar a administrar a dose correta"

O usuário reformulou a ideia em resposta ao parecer acima: a calculadora seria uma **página própria, isolada, sem nenhum CTA de venda/catálogo naquela página**, com objetivo declaradamente educacional de "ensinar a administrar a dose correta". Pediu reavaliação direta de três pontos. **Conclusão: o parecer anterior (não construir agora / aval jurídico obrigatório antes de qualquer versão) se mantém — a remoção do CTA não resolve os dois riscos centrais, e a nova formulação verbal ("ensinar a administrar a dose correta") é, no ponto de vocabulário, um passo na direção errada em relação ao próprio conceito lapidado anterior.**

**1) Risco Google Ads (avaliação de domínio inteiro):** não resolve. A política "Destination requirements" do Google avalia o site de destino/domínio como um todo via crawler, independentemente de qual página específica está linkada num anúncio (fato já registrado em `docs/pesquisa/regulatorio.md`, 12/08). Isolar a página tecnicamente (sem CTA, sem link de catálogo) não a remove do domínio onde já rodam campanhas ativas nomeando Tirzepatida, Retatrutida e GHK-Cu (`docs/trafego/campanhas.md`). Se algo, uma página que nomeia substâncias específicas e descreve como "administrar a dose correta" é um sinal temático mais explícito de conteúdo de administração de injetável do que um conversor de unidades genérico — não reduz a superfície de revisão, tende a reforçá-la.

**2) Risco ANVISA:** piora, não resolve. O risco já identificado estava ligado ao negócio (venda ativa de substâncias que a ANVISA já declarou sem registro/ilegais para uso em saúde-estética) e ao ato funcional de ensinar preparo/aplicação, não ao CTA de venda em si. "Ensinar a administrar a dose correta" é literalmente vocabulário posológico/instrucional — o oposto do que o conceito lapidado anterior recomendava evitar ("nunca 'dose recomendada', 'posologia' ou 'orientação de uso'; apenas 'conversão'/'cálculo de equivalência'"). Nomear substâncias como GHK-Cu, BPC-157, TB-500, CJC-1295 e Ipamorelina — já citadas no alerta da ANVISA de 03/07/2026 — numa página que ensina a administrá-las corretamente aproxima ainda mais o conteúdo do que a RDC 44/2009 trata como serviço farmacêutico regulado (aplicação de injetável), independente de haver ou não venda naquela página específica.

**3) Diferença entre "página com CTA" e "página sem CTA, mesmo domínio comercial":** pesquisa rápida confirma que, do ponto de vista regulatório brasileiro, essa diferença tende a ser irrelevante ou a jogar contra a tese de segurança. A **RDC ANVISA nº 96/2008 proíbe explicitamente a publicidade indireta de medicamentos** — inclusive quando a empresa omite nome/marca do produto mas publica conteúdo "informativo" sobre a condição/uso associado ao que vende. A ANVISA já teve casos documentados de suspensão de propaganda irregular justamente em páginas "educativas" de laboratórios que misturavam informação e propaganda sem venda direta na mesma página (caso replicado por Idec/ANVISA). Uma página educacional sobre como administrar peptídeos, hospedada no domínio comercial de uma empresa que vende exatamente esses peptídeos, se encaixa no padrão clássico de "publicidade disfarçada/indireta" que a ANVISA já fiscalizou — a ausência de CTA na página específica não cria, na leitura desta avaliação, um firewall regulatório eficaz frente a esse padrão de enforcement já documentado.
Fontes: [Após pesquisa do Idec, Anvisa suspende propaganda irregular de medicamentos em sites de laboratórios (Idec)](https://idec.org.br/em-acao/em-foco/apos-pesquisa-do-idec-anvisa-suspende-propaganda-irregular-de-medicamentos-em-sites-de-laboratorios); [RDC nº 96/2008 (BVS-MS, texto oficial)](https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2008/rdc0096_17_12_2008.html); [Regras básicas de propaganda — ANVISA](https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/propaganda/propaganda) — pesquisa pontual de 12/08/2026, não é parecer jurídico.

**Status do parecer:** mantido — não construir agora, nem a versão sem CTA. Alternativa recomendada (conteúdo de confiança/procedência) segue de pé. Aval jurídico de direito sanitário segue como pré-requisito inegociável para qualquer versão futura, incluindo esta reformulação.

---

## 2026-08-12 — Carrossel educacional: peptídeos com mais evidência científica

### Contexto

Pedido do usuário (dono da Aurum Peptide), coordenado pelo Strategic Manager (CMO): carrossel educacional para o feed do Instagram (@aurumpeptide), sobre "os peptídeos com maior evidência de estudos científicos". **Conteúdo puramente educacional, não comercial** — mesmo enquadramento já usado no precedente da série de e-books (`docs/pesquisa/cientifico.md`), aplicado aqui a um formato de feed. **Regra inegociável, explícita do usuário:** sem CTA de compra, sem preço, sem nome de produto do catálogo Aurum, sem link/push comercial de qualquer tipo — se houver fechamento, deve ser convite genérico a engajar, nunca "compre"/"fale conosco para comprar".

Insumo científico: `docs/pesquisa/cientifico.md`, seção "Ranking de peptídeos por força de evidência científica (12/08/2026)" (Research Manager, mesma data). Ranking em 4 tiers, critério explícito (aprovação regulatória > RCTs fase 2/3 humanos > meta-análises/Cochrane > direção do resultado > só pré-clínico):
- Tier 1: Semaglutida (STEP 1, PMID 33567185, N=1961) e Tirzepatida (SURMOUNT-1, PMID 35658024, N=2539) — ambas aprovadas por FDA/ANVISA.
- Tier 2: Retatrutida (fase 2, PMID 37366315, N=338, ainda não aprovada) e Cagrilintida.
- Tier 3/4 (não usados como protagonistas, por recomendação do Research Manager — evidência humana fraca e/ou já sinalizados pela ANVISA em 03/07/2026): Ipamorelina, GHK-Cu, CJC-1295, BPC-157.

### Decisão de enquadramento (ponto que o usuário pediu explicitamente para eu resolver, documentado aqui)

**Risco identificado:** Tirzepatida é o princípio ativo do TG 60mg, primeiro produto real do catálogo Aurum (`docs/marketing/conteudo.md`, entrada 2026-07-28). Um carrossel educacional que elogia a evidência científica da Tirzepatida — mesmo sem citar o produto — pode ser lido como propaganda indireta, especialmente à luz do próprio precedente registrado neste arquivo em 12/08/2026 (avaliação da calculadora de dose), onde a RDC ANVISA nº 96/2008 foi citada explicitamente por proibir "publicidade indireta de medicamentos", inclusive quando a empresa omite o nome do produto mas publica conteúdo "informativo" sobre substância que vende.

**Decisão tomada:** enquadramento **comparativo com 3 peptídeos** (Semaglutida, Tirzepatida e Retatrutida), não um post só sobre Tirzepatida — seguindo a recomendação técnica do Research Manager. Isso muda a leitura do post de "elogio a uma substância que a Aurum vende" para "explicação de metodologia científica de avaliação de evidência, ilustrada com 3 exemplos reais, do mais estabelecido ao mais recente em teste". Reforça essa leitura:
- O post gasta a maior parte do espaço (2 de 6 páginas) explicando **o critério de avaliação de evidência em si** antes de citar qualquer peptídeo — o ranqueamento é o assunto, não a substância.
- Nenhuma alegação de efeito/benefício/resultado é feita para nenhum dos 3 (nem percentual de perda de peso, nem qualquer desfecho de eficácia dos estudos) — o copy fica estritamente no nível de "o que é o nível de evidência" (fase do estudo, número de participantes, status regulatório), nunca "e funciona". Isso é mais rígido que apenas evitar termo médico solto (`docs/tom-de-voz.md`): evita também transformar dado científico real em alegação de benefício disfarçada.
- Nenhum nome comercial de produto Aurum é citado, nenhum preço, nenhum CTA de compra — só as moléculas, como fato científico.
- Retatrutida (Tier 2, ainda não vendida pela Aurum) entra como 3º elemento justamente para diluir a leitura de "post pró-Tirzepatida" — ela genuinamente tem evidência de fase 2 forte, então sua inclusão é honesta, não arbitrária.
- Uma página inteira (página 5) é dedicada a deixar explícito que "ter mais evidência não é promessa de resultado individual" e que "menos evidência não significa inútil" — isso protege a Aurum de duas leituras problemáticas ao mesmo tempo: (a) que este post é propaganda disfarçada da Tirzepatida, e (b) que este post depõe contra outros peptídeos de evidência mais fraca que a própria Aurum vende (GHK-Cu, por exemplo, já é objeto de campanha ativa — `docs/trafego/campanhas.md`).

**Decisão sobre CTA de fechamento:** por instrução explícita do usuário para esta peça, o fechamento é um convite genérico a comentar/engajar ("qual peptídeo você gostaria de ver analisado com este mesmo critério?"), **sem** direcionar ao Grupo de WhatsApp/VIP. Isso é uma exceção deliberada à diretriz geral de `docs/objetivos.md` ("todo conteúdo de topo de funil deve ter caminho claro até o grupo") — registrada aqui para não virar precedente silencioso: a exceção vale para esta peça, por ser conteúdo puramente educacional/comparativo sem qualquer relação com venda, não é uma mudança de padrão para conteúdo de feed em geral.

### Formato

Carrossel de Instagram, **6 páginas** (máximo pedido), proporção 4:5 (1080×1350) — mesmo padrão técnico do carrossel TG 60mg (`docs/design/2026-07-28-tg60mg/`). Sem republicação automática no Facebook definida neste briefing (o usuário não pediu explicitamente; Strategic Manager pode decidir replicar, já que Facebook é canal ativo — ver `docs/marca.md`).

### Copy por página

**Página 1 — Capa**
- Título (serif, dourado `#C6A55A`): "Evidência não é igual para todos."
- Subtítulo (sans-serif, branco gelo, menor, abaixo do título): "Os peptídeos com mais comprovação científica até hoje."

**Página 2 — Contexto/pergunta**
- Corpo (sans-serif, branco gelo):
  "No mercado de peptídeos, é comum ouvir que 'a ciência comprova' quase tudo.
  Mas nem toda substância tem o mesmo nível de comprovação — e essa diferença importa.
  Existe uma forma objetiva de medir isso: o grau de evidência científica por trás de cada peptídeo."

**Página 3 — Critério (como a ciência classifica evidência)**
- Título (serif, dourado): "Como a ciência classifica a evidência"
- Corpo (sans-serif, lista numerada, do mais forte ao mais fraco):
  "1. Aprovação por agências regulatórias internacionais (como FDA/EMA) — exige revisão completa de segurança e eficácia.
  2. Estudos clínicos controlados em humanos, de fase 2 ou 3, com número relevante de participantes.
  3. Revisões sistemáticas e meta-análises, que reúnem diversos estudos independentes.
  4. Resultado positivo e estatisticamente consistente nos estudos já publicados.
  5. Evidência apenas pré-clínica — testes em laboratório ou em modelos animais, o nível mais frágil de comprovação."

**Página 4 — Ranking/comparação**
- Título (serif, dourado): "Os 3 com mais evidência hoje"
- Corpo (sans-serif, um bloco por peptídeo, sem qualquer menção a efeito/resultado):
  "Semaglutida
  Aprovada por agências regulatórias internacionais. Avaliada em estudo clínico de fase 3, controlado por placebo, com quase 2.000 participantes.

  Tirzepatida
  Também aprovada por agências regulatórias internacionais. Avaliada em estudo clínico de fase 3, controlado por placebo, com mais de 2.500 participantes em múltiplos países — incluindo centros no Brasil.

  Retatrutida
  Ainda não aprovada por agências regulatórias. Concluiu estudo de fase 2, controlado por placebo, com resultados consistentes; segue em avaliação de fase 3."
- Rodapé pequeno (sans-serif, discreto): "Fonte: estudos publicados em periódicos científicos revisados por pares, indexados no PubMed/NIH." (reforça rigor/confiança sem citar PMID individual, mantendo a leitura fácil de carrossel — PMIDs completos ficam registrados em `docs/pesquisa/cientifico.md`, disponíveis caso alguém peça a fonte.)

**Página 5 — O que isso não significa (honestidade/seriedade)**
- Título (serif, dourado): "O que isso não significa"
- Corpo (sans-serif):
  "Ter o maior nível de evidência científica não é o mesmo que prometer resultado individual — cada organismo responde de um jeito, e nenhum estudo substitui avaliação individual.
  E o oposto também é verdade: um peptídeo com evidência ainda limitada não é necessariamente inútil — apenas ainda não foi estudado o suficiente para afirmar isso com segurança.
  Ciência é isso: comprovação que evolui, nunca promessa fechada."

**Página 6 — Fechamento**
- Título (serif, dourado): "Este retrato muda com o tempo."
- Corpo (sans-serif, centralizado): "Ciência é um processo contínuo — o que vale hoje pode ser atualizado amanhã, conforme novos estudos surgem.
  Qual peptídeo você gostaria de ver analisado com este mesmo critério? Deixe nos comentários."
- Logo (lockup com nome) centralizado, fechando a peça — sem sticker/texto de link comercial (exceção deliberada, ver "Decisão sobre CTA de fechamento" acima).

### Legenda (caption)

> Evidência científica não é igual para todos os peptídeos — e essa diferença importa mais do que parece.
>
> Neste carrossel, mostramos como a ciência classifica o grau de comprovação de uma substância (da evidência pré-clínica até a aprovação por agências regulatórias internacionais) e quais peptídeos reúnem hoje o maior volume de estudos clínicos sérios sobre si.
>
> Conteúdo educacional, baseado em estudos publicados em periódicos científicos revisados por pares. Não é indicação de uso, orientação de aplicação nem promessa de resultado — apenas o retrato mais honesto que a ciência permite, até esta data.
>
> Qual peptídeo você gostaria de ver analisado com este mesmo critério? Conta pra gente nos comentários.
>
> #AurumPeptide

**Verificação contra a regra "sem forma direta de vender":** nenhum preço, nenhum nome de produto do catálogo Aurum, nenhum link, nenhuma menção a WhatsApp/Grupo VIP/compra em nenhuma das 6 páginas nem na legenda — confirmado por releitura antes da entrega.

### Briefing visual para o Designer Manager

Referência normativa: `docs/identidade-visual.md`, aplicar integralmente. Antes de desenhar a capa e as páginas internas, **consultar os posts reais do feed via Meta Graph API** para calibrar o padrão visual já em uso (conforme pedido do usuário) — em particular, replicar a composição título+subtítulo já validada no carrossel TG 60mg (`docs/marketing/conteudo.md`, entrada 2026-07-28; peça executada em `docs/design/2026-07-28-tg60mg/`).

- **Formato técnico:** 6 slides, proporção 4:5 (1080×1350) — mesmo padrão do carrossel TG 60mg.
- **Fundo:** mesmo sistema institucional — verde profundo `#0D1B16`, gradiente radial muito suave, glow central inferior sutil, textura leve tipo canvas premium, idêntico nas 6 páginas para unidade de sequência. Pode reaproveitar a base já aprovada em 28/07 (`docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png`) para manter consistência de feed, ou gerar equivalente novo — critério do Designer Manager.
- **Paleta de texto/acento:** dourado premium `#C6A55A` para títulos (serif); branco gelo para corpo (sans-serif); grafite escuro como contraste alternativo se necessário. Nunca roxo, azul vibrante, vermelho chamativo, neon ou gradientes exagerados.
- **Tipografia:** título serif elegante e sofisticada (mesma referência usada no carrossel TG 60mg); corpo sans-serif limpa e moderna; espaçamento amplo, respiro visual generoso.
- **Logo:** lockup completo (`assets/logo-oficial-com-nome.png`) na capa (página 1) e no fechamento (página 6). Marca d'água da molécula (`assets/logo-oficial.png`, opacidade 5–15%, sem sombra/contorno/3D) pode aparecer sutil nas páginas 2 a 5. Nunca distorcer, alterar proporção, cor ou criar variação da molécula.
- **Páginas 3 e 4 (critério e ranking):** usar recurso tipográfico elegante para hierarquizar listas (ex.: numerais dourados grandes, respiro entre blocos) — evitar qualquer visual que pareça "tabela clínica", "bula" ou "relatório de laboratório".
- **Evitar explicitamente, nas 6 páginas:** imagens de seringa, agulha, frasco/ampola, comprimido, jaleco, ícones de "check" estilo laboratório clínico, ou qualquer estética de "farmácia genérica"/"clínica fria". Mesmo os 3 peptídeos citados (Semaglutida, Tirzepatida, Retatrutida) não estando na lista de alerta ANVISA de 03/07/2026 (`docs/pesquisa/regulatorio.md`), o cuidado visual deve ser o mesmo: esta é uma peça editorial/científica, não uma peça de produto nem instrução de uso.
- **Proibido em qualquer uma das 6 páginas:** nome de produto do catálogo Aurum, preço, elemento de CTA de compra, sticker/texto de link para WhatsApp ou Grupo VIP (exceção deliberada ao padrão de funil, ver "Decisão sobre CTA de fechamento" acima).
- **Mood geral:** editorial, minimalista, institucional, premium — como uma matéria de revista científica de alto padrão, não um anúncio.

### Status

- [x] Copy e briefing entregues ao Designer Manager (via Strategic Manager) para execução visual.
- [x] Designer Manager: consultar posts reais via Meta Graph API antes de desenhar a capa e as páginas internas — feito; achado relevante (feed real hoje diverge de `docs/identidade-visual.md`, conteúdo legado anterior ao ecossistema) registrado em `docs/design/pecas.md`, entrada 2026-08-12, não incorporado por conflitar com as proibições do documento normativo.
- [x] Designer Manager: executar as 6 páginas conforme briefing acima — concluído, arquivos finais em `docs/design/2026-08-12-carrossel-evidencia/final/` (`pagina-1-capa.png` a `pagina-6-fechamento.png`, 1080×1350), checklist de validação e decisões em `docs/design/pecas.md`. Entregue ao Publishing Manager.
- [x] Publishing Manager: publicado no feed do Instagram (@aurumpeptide) em 2026-08-12 — media ID `17955403536215292`, permalink https://www.instagram.com/p/Db8dzKGmvkL/. Detalhes completos, incluindo a rota de hospedagem pública usada (`apps/site/public/marketing/`), em `docs/publicacao/log.md`.
- [ ] Strategic Manager/usuário: replicação no Facebook foi decidida (replicar, mesma legenda) mas **ainda não concluída** — bloqueada por um gap técnico novo na integração (token de acesso de Página vs. token de System User em `/{page-id}/photos`), não um bloqueio de decisão de conteúdo. Ver `docs/publicacao/log.md` para o erro exato e as opções de resolução.

---

## 2026-08-14 — Carrossel educacional: Semax vs. Selank (peptídeos nootrópicos russos, fora do catálogo)

### Contexto

Pedido do Strategic Manager (CMO): carrossel educacional comparando **Semax** e **Selank** para o feed do Instagram (@aurumpeptide) e a Página do Facebook. **Conteúdo puramente educacional — nenhum dos dois faz parte do portfólio vendido pela Aurum Peptide** (`docs/marca.md`, que cobre hoje apenas performance física/esportiva e emagrecimento/metabolismo), mesmo enquadramento e mesmo padrão de estrutura/tom/formato já usados no carrossel "Evidência não é igual para todos" de 12/08/2026 (`docs/marketing/conteudo.md`, entrada acima; peça executada em `docs/design/2026-08-12-carrossel-evidencia/`).

Insumo científico: `docs/pesquisa/cientifico.md`, seção "Semax vs. Selank — peptídeos nootrópicos russos, fora do catálogo Aurum (14/08/2026)" (Research Manager, mesma data, todo PMID verificado diretamente no PubMed). Restrições explícitas que este copy respeita integralmente:

1. Nenhuma alegação de "estudo duplo-cego randomizado" — os abstracts verificados (PMID 11517472, 29798983, 18454096) não confirmam esse desenho.
2. Nenhuma linguagem de "mecanismos completamente diferentes/opostos" — Semax e Selank compartilham o mecanismo de inibição de enkefalinase (PMID 11443939); a diferenciação foco/cognição vs. ansiolítico é sobre o que foi estudado clinicamente em humanos, não sobre mecanismos opostos.
3. Nenhuma alegação de segurança em uso crônico/longo prazo — toda evidência verificada é de uso agudo/curto prazo.
4. Nenhuma afirmação de "eficácia comprovada" no padrão Tier 1 (Semaglutida/Tirzepatida, ver ranking de 12/08) — evidência de estudos russos menores, sem confirmação de placebo-controle a partir dos abstracts.
5. Nem Semax nem Selank são citados nominalmente no alerta ANVISA de 03/07/2026 (`docs/pesquisa/regulatorio.md`) — o copy afirma apenas que não são aprovados/regularizados no Brasil, nunca que "a ANVISA alertou sobre" os dois. O registro como medicamento de prescrição na Rússia é tratado como informação de contexto (não verificada em fonte regulatória primária russa), nunca como selo de aprovação internacional.
6. Nenhuma menção a "estudo publicado no PubMed" sem qualificação — os estudos-chave são identificados como publicados em periódicos científicos russos (Zh Nevrol Psikhiatr Im S S Korsakova, Bull Exp Biol Med), indexados no PubMed, sem confirmação de desenho duplo-cego/placebo a partir dos resumos.

### Decisões de enquadramento (pontos que exigiram julgamento, documentados aqui)

**1. Título de capa — equilíbrio entre "chamativo" e "sem promessa":** o usuário pediu explicitamente copywriting aqui, com a condição de não soar a promessa de efeito (tipo "libere 100% do seu potencial", proibido por `docs/valores.md` e `docs/tom-de-voz.md`). A solução foi seguir o mesmo recurso retórico já validado no título de 12/08 ("Evidência não é igual para todos.") — uma frase que gera curiosidade por meio de **nuance/contraste**, não de benefício prometido. Título escolhido: **"Duas moléculas. Duas perguntas sobre a mente humana."** — é rítmico e aspiracional (fala de "mente humana", ecoando o pedido de metáfora de potencial cognitivo), mas o verbo-chave é "perguntas", não "libere"/"desperte"/"maximize" — ele promete uma exploração científica, não um resultado. Subtítulo nomeia as duas moléculas e já sinaliza "fora do portfólio Aurum", antecipando o disclaimer.

**2. Página de comparação sem soar "vs." adversarial:** para respeitar a restrição 2 (nada de "mecanismos opostos"), a Página 5 evita a palavra "versus"/"oposto" e usa "duas rotas de pesquisa, uma origem em comum" como título — o corpo primeiro nomeia a diferença (o que foi estudado clinicamente em humanos), depois explicita que o mecanismo de base é parcialmente compartilhado. O briefing visual reforça isso pedindo tratamento visual **paralelo/complementar** (mesmo peso visual para os dois blocos, sem hierarquia de "vencedor"), no mesmo espírito do tratamento neutro já usado na Página 4 do carrossel de 12/08 para Semaglutida/Tirzepatida/Retatrutida.

**3. Uso do dado "registrado como medicamento de prescrição na Rússia":** decidi incluir essa informação no disclaimer (Página 6), não omitir — ela é relevante para a objeção de confiança do avatar (`docs/avatar-do-cliente.md`) e aumenta o rigor percebido do conteúdo (mostra que a Aurum não está escondendo informação). Mas a frase foi redigida para deixar explícito que é **"informação de contexto sobre uso local, não uma validação regulatória no Brasil"** — evita que o dado seja lido como um selo de segurança/aprovação internacional, conforme a restrição 5.

**4. CTA de fechamento — mesma exceção deliberada de 12/08:** por ser conteúdo puramente educacional/comparativo, sem qualquer relação com produto vendido pela Aurum, o fechamento é um convite genérico a comentar, **sem** direcionar ao Grupo de WhatsApp/VIP — a mesma exceção já registrada e justificada na entrada de 12/08/2026 deste arquivo, não uma mudança de padrão geral (`docs/objetivos.md` continua valendo para conteúdo de topo de funil com relação a produto/venda).

**5. Qualificação de fonte embutida no corpo, não só em rodapé:** diferente do carrossel de 12/08 (que resumiu a fonte em um rodapé curto sobre "periódicos revisados por pares"), aqui a qualificação ("publicado em periódico científico russo, indexado no PubMed", "o resumo disponível não confirma desenho duplo-cego/placebo") entra no corpo das Páginas 3 e 4, uma por peptídeo — a restrição 6 exige qualificação explícita sempre que o PubMed for mencionado, e isso é mais preciso feito por peptídeo do que num rodapé genérico único.

### Formato

Carrossel de Instagram, **6 páginas**, proporção 4:5 (1080×1350) — mesmo padrão técnico dos carrosséis de 28/07 e 12/08. Publicado de forma idêntica na Página do Facebook (canal ativo, `docs/marca.md`), mesma legenda.

### Copy por página

**Página 1 — Capa**
- Título (serif, dourado `#C6A55A`): "Duas moléculas. Duas perguntas sobre a mente humana."
- Subtítulo (sans-serif, branco gelo, menor, abaixo do título): "O que a ciência estuda sobre Semax e Selank — peptídeos russos fora do portfólio Aurum."

**Página 2 — Contexto**
- Corpo (sans-serif, branco gelo):
  "Entre os peptídeos estudados por sua relação com o sistema nervoso central, dois nomes aparecem com frequência na literatura científica russa: Semax e Selank.
  Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide — hoje, a marca atua nas linhas de performance física/esportiva e emagrecimento/metabolismo.
  Este é um conteúdo puramente educacional, sobre o que a pesquisa científica registra até hoje."

**Página 3 — Semax**
- Título (serif, dourado): "Semax — o que a evidência mostra"
- Corpo (sans-serif):
  "Heptapeptídeo sintético desenvolvido na Rússia, estruturalmente relacionado a um fragmento do hormônio ACTH.
  Em modelos animais, foi estudado por sua relação com a expressão de BDNF e com os sistemas dopaminérgico e serotoninérgico.
  Em humanos, os estudos clínicos localizados — publicados em periódico científico russo, indexados no PubMed — avaliaram Semax em contexto de AVC isquêmico e reabilitação neurológica, não em desfechos de ansiedade.
  Os resumos disponíveis desses estudos não confirmam randomização nem controle por placebo."

**Página 4 — Selank**
- Título (serif, dourado): "Selank — o que a evidência mostra"
- Corpo (sans-serif):
  "Heptapeptídeo sintético russo, análogo da tuftsina — peptídeo natural do sistema imunológico.
  Em modelos animais, foi associado à modulação de genes ligados à neurotransmissão GABAérgica.
  Em humanos, o principal estudo clínico localizado — também publicado em periódico científico russo, indexado no PubMed — avaliou Selank em pacientes com transtorno de ansiedade generalizada e neurastenia, comparado a um ansiolítico já estabelecido, com efeitos relatados como semelhantes.
  Também aqui, o resumo disponível não confirma desenho duplo-cego nem controle por placebo."

**Página 5 — Comparação: duas rotas, uma origem em comum**
- Título (serif, dourado): "Duas rotas de pesquisa, uma origem em comum"
- Corpo (sans-serif, dois blocos com peso visual idêntico):
  "Semax — histórico de pesquisa clínica em recuperação neurológica e foco.
  Selank — histórico de pesquisa clínica em ansiedade e neurastenia.

  Essa diferença está no que cada um foi estudado para fazer em humanos, não numa separação completa de mecanismo: os dois compartilham, ao menos em parte, o mesmo mecanismo estudado — a inibição de uma enzima que degrada encefalinas no organismo."
- Rodapé pequeno (sans-serif, discreto): "Fonte: estudos publicados em periódicos científicos russos, indexados no PubMed/NIH; resumos disponíveis não confirmam desenho duplo-cego/placebo-controlado. Registro completo de referências: docs/pesquisa/cientifico.md."

**Página 6 — Disclaimer / fechamento**
- Título (serif, dourado): "Antes de qualquer conclusão"
- Corpo (sans-serif, centralizado):
  "Semax e Selank não são aprovados pela FDA nem pela ANVISA, e não constam no portfólio comercializado pela Aurum Peptide. Na Rússia, ambos são registrados como medicamento de prescrição — uma informação de contexto sobre seu uso local, não uma validação regulatória no Brasil.
  Este conteúdo é informativo. Não é indicação de uso, não é orientação de aplicação, e não substitui avaliação de profissional de saúde habilitado.
  A ciência sobre os dois segue em construção. Vale conhecê-la — não tratá-la como verdade fechada.

  O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários."
- Logo (lockup com nome) centralizado, fechando a peça — sem sticker/texto de link comercial (mesma exceção deliberada de 12/08, ver "Decisões de enquadramento" acima).

### Legenda (caption, idêntica no Instagram e no Facebook)

> Semax e Selank são dois peptídeos nootrópicos de origem russa, estudados por sua relação com o sistema nervoso central — um mais associado a contextos de recuperação neurológica, outro a contextos de ansiedade.
>
> Neste carrossel, mostramos o que a evidência científica disponível hoje realmente diz sobre os dois: o que foi estudado, em quem, e com que tipo de desenho de pesquisa — sem transformar isso em promessa de efeito.
>
> Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide. Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado.
>
> O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários.
>
> #AurumPeptide

**Verificação contra a regra "sem forma direta de vender":** nenhum preço, nenhum nome de produto do catálogo Aurum, nenhum link, nenhuma menção a WhatsApp/Grupo VIP/compra em nenhuma das 6 páginas nem na legenda — confirmado por releitura antes da entrega.

### Briefing visual para o Designer Manager

Referência normativa: `docs/identidade-visual.md`, aplicar integralmente. Formato técnico, paleta, tipografia, tratamento de logo e proibições gerais seguem **exatamente** o padrão já validado nos carrosséis de 28/07 e 12/08 (`docs/design/pecas.md`) — este briefing só destaca o que é específico desta peça.

- **Formato técnico:** 6 páginas, proporção 4:5 (1080×1350).
- **Fundo (páginas 2 a 6):** mesmo sistema institucional — verde profundo `#0D1B16`, gradiente radial muito suave, glow central inferior sutil, textura leve tipo canvas premium. Pode reaproveitar a base já validada (`docs/design/2026-07-28-tg60mg/raw/bg-gemini-01.png`, já reaproveitada em 12/08) para manter unidade de feed entre as três peças, ou gerar equivalente novo **via Gemini**, seguindo o mesmo padrão já estabelecido em 12/08 — critério do Designer Manager.
- **Página 1 (capa) — elemento gráfico novo, via ChatGPT, por pedido explícito do usuário:** gerar a imagem de um **cérebro estilizado em traços/nós geométricos dourados** (`#C6A55A`), ecoando a estética de linhas da própria molécula-logo da marca — não um cérebro anatômico realista, não um render 3D, não uma ilustração médica/clínica. Trate como metáfora de potencial cognitivo, no mesmo espírito minimalista/editorial da molécula usada como hero gráfico na capa de 12/08. Sobre fundo verde profundo institucional (`#0D1B16`), gradiente radial suave, glow inferior sutil, textura canvas — mesmo sistema das demais páginas. **Nunca pedir ao gerador para escrever o título/subtítulo dentro da imagem** — assim como em 28/07 e 12/08, texto e logo devem ser compostos por script (Python/Pillow, mesmo padrão de `compose.py`) sobre a arte gerada, para garantir fidelidade tipográfica e de marca.
- **Proibições explícitas para a capa (pedido pelo Strategic Manager, além das proibições gerais de `docs/identidade-visual.md`):** nenhum frasco, seringa, agulha, jaleco, rosto humano ou glow exagerado. O cérebro deve ser um motivo gráfico decorativo/conceitual — não uma ilustração clínica/anatômica (mesma distinção "científico decorativo vs. farmacêutico/produto" já mapeada com o Research Manager em 12/08, ver `docs/design/pecas.md`, revisão da capa daquele carrossel).
- **Paleta de texto/acento:** dourado premium `#C6A55A` para títulos (serif); branco gelo para corpo (sans-serif); grafite escuro como contraste alternativo se necessário. Nunca roxo, azul vibrante, vermelho chamativo, neon ou gradientes exagerados.
- **Tipografia:** título serif elegante e sofisticada (mesma referência dos carrosséis anteriores); corpo sans-serif limpa e moderna; espaçamento amplo, respiro visual generoso.
- **Logo:** lockup completo (`assets/logo-oficial-com-nome.png`) na capa (página 1, no rodapé, no mesmo espírito da revisão de capa de 12/08) e no fechamento (página 6). Marca d'água da molécula (`assets/logo-oficial.png`, opacidade 5–15%, sem sombra/contorno/3D) pode aparecer sutil nas páginas 2 a 5. Nunca distorcer, alterar proporção, cor ou criar variação da molécula.
- **Página 5 (comparação):** tratamento visual **paralelo/complementar**, não adversarial — os dois blocos (Semax/Selank) com peso visual idêntico (mesmo tamanho de fonte, mesma cor dourada no nome), sem hierarquia de "vencedor", no mesmo espírito neutro já usado na Página 4 do carrossel de 12/08. Evitar qualquer ícone de "vs." ou separador que sugira confronto/oposição — preferir um elemento de conexão sutil (ex.: uma linha ou nó dourado ligando os dois blocos), coerente com o texto que menciona mecanismo compartilhado.
- **Evitar explicitamente, nas 6 páginas:** imagens de seringa, agulha, frasco/ampola, comprimido, jaleco, ícones de "check" estilo laboratório clínico, rosto humano, ou qualquer estética de "farmácia genérica"/"clínica fria". Nenhum dos dois peptídeos estar fora da lista de alerta ANVISA de 03/07/2026 não muda esse cuidado — esta é uma peça editorial/científica, não uma peça de produto nem instrução de uso.
- **Proibido em qualquer uma das 6 páginas:** nome de produto do catálogo Aurum, preço, elemento de CTA de compra, sticker/texto de link para WhatsApp ou Grupo VIP (mesma exceção deliberada do padrão de funil, ver "Decisões de enquadramento" acima).
- **Mood geral:** editorial, minimalista, institucional, premium — como uma matéria de revista científica de alto padrão, não um anúncio.

### Status

- [x] Copy e briefing entregues ao Designer Manager (via Strategic Manager) para execução visual.
- [x] Designer Manager: gerou o elemento gráfico da capa (cérebro estilizado em traços dourados) via ChatGPT (`gpt-image-1`) e compôs as 6 páginas conforme briefing. Detalhes completos, decisões visuais e checklist de validação em `docs/design/pecas.md`, entrada "2026-08-14 — Carrossel educacional: Semax vs. Selank".
- [x] Designer Manager: entregue ao Publishing Manager (mesma entrada acima) — carrossel completo em `docs/design/2026-08-14-carrossel-semax-selank/final/`, com a legenda desta seção.
- [x] Publishing Manager: publicado no feed do Instagram (@aurumpeptide) — media ID `17896208916570217` — e replicado na Página do Facebook — post ID `1186905547834934_122125024929356392` — em 2026-08-14.
- [x] **Rejeitado pelo dono da Aurum Peptide em 2026-08-16 e apagado dos dois canais.** Motivo e correção completa documentados na seção "Correção pós-rejeição (2026-08-16)" abaixo. Peça não deve ser republicada sem passar pela correção e nova aprovação.

### Correção pós-rejeição (2026-08-16)

**Motivo da rejeição (feedback direto do usuário):** a copy publicada mencionava explicitamente que a Aurum não vende/não tem no catálogo Semax e Selank ("fora do portfólio Aurum", "não constam no portfólio comercializado pela Aurum Peptide", "Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide"). Segundo o usuário, isso é irrelevante para um post puramente educativo — não cabe ao conteúdo se posicionar sobre o que a marca vende ou deixa de vender.

**Diretriz permanente decorrente (vale para todo conteúdo educacional futuro, não só esta peça):** nenhum conteúdo educacional deve mencionar se a Aurum vende ou não vende o peptídeo tratado no post, em nenhuma forma ("não vendemos", "fora do portfólio", "fora do catálogo" ou equivalente). Isso **não** afeta os disclaimers regulatórios reais (não aprovado pela ANVISA/FDA, não é indicação de uso, não substitui avaliação profissional, informação sobre registro como medicamento de prescrição na Rússia) — esses continuam obrigatórios e não devem ser removidos nem enfraquecidos — nem afeta conteúdo científico (mecanismo, estudos, restrições de linguagem já validadas com o Research Manager). Documentação duradoura desta diretriz em `docs/tom-de-voz.md` é responsabilidade do Strategic Manager, registrada separadamente.

**Escopo da correção nesta peça:** três pontos foram sinalizados pelo usuário (Página 2, Página 6, legenda) e um quarto foi identificado nesta revisão por violar a mesma regra (Página 1, subtítulo da capa). Páginas 3, 4 e 5, e o restante das Páginas 1/2/6, não mudam.

**1. Página 1 (capa) — subtítulo.**
- Antes: "O que a ciência estuda sobre Semax e Selank — peptídeos russos fora do portfólio Aurum."
- Depois (corrigido): **"O que a ciência estuda sobre Semax e Selank — peptídeos russos."**

**2. Página 2 (contexto) — corpo.** O segundo parágrafo (menção ao portfólio) foi removido inteiramente; os dois parágrafos remanescentes fluem naturalmente sem ele.
- Depois (corrigido, corpo completo da página):
  "Entre os peptídeos estudados por sua relação com o sistema nervoso central, dois nomes aparecem com frequência na literatura científica russa: Semax e Selank.
  Este é um conteúdo puramente educacional, sobre o que a pesquisa científica registra até hoje."

**3. Página 6 (disclaimer) — corpo, primeira frase.** Removida apenas a cláusula sobre o portfólio Aurum; o disclaimer regulatório real (FDA/ANVISA, registro na Rússia) permanece intacto.
- Antes: "Semax e Selank não são aprovados pela FDA nem pela ANVISA, e não constam no portfólio comercializado pela Aurum Peptide. Na Rússia, ambos são registrados como medicamento de prescrição — uma informação de contexto sobre seu uso local, não uma validação regulatória no Brasil."
- Depois (corrigido, primeira frase; restante do corpo da página — segundo e terceiro parágrafos e a pergunta de fechamento — não muda):
  "Semax e Selank não são aprovados pela FDA nem pela ANVISA. Na Rússia, ambos são registrados como medicamento de prescrição — uma informação de contexto sobre seu uso local, não uma validação regulatória no Brasil."

**4. Legenda (caption, idêntica Instagram/Facebook).** Removida a frase sobre o portfólio Aurum do terceiro parágrafo; o restante (evidência científica, disclaimers) permanece.
- Antes (terceiro parágrafo): "Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide. Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado."
- Depois (corrigido, terceiro parágrafo): "Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado."
- Legenda completa corrigida, pronta para reuso:
  > Semax e Selank são dois peptídeos nootrópicos de origem russa, estudados por sua relação com o sistema nervoso central — um mais associado a contextos de recuperação neurológica, outro a contextos de ansiedade.
  >
  > Neste carrossel, mostramos o que a evidência científica disponível hoje realmente diz sobre os dois: o que foi estudado, em quem, e com que tipo de desenho de pesquisa — sem transformar isso em promessa de efeito.
  >
  > Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado.
  >
  > O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários.
  >
  > #AurumPeptide

**Próximo passo:** texto acima está pronto para o Designer Manager recompor as Páginas 1, 2 e 6 (script `docs/design/2026-08-14-carrossel-semax-selank/compose.py`) e para o Publishing Manager reutilizar a legenda corrigida, mediante nova aprovação do Strategic Manager/usuário — não republicar a versão original rejeitada.

**Status da republicação (Publishing Manager, 2026-08-17):** usuário deu aprovação explícita para republicar a versão corrigida. Publicado no feed do Instagram (@aurumpeptide) — media ID `18113777833767779`, permalink https://www.instagram.com/p/DcJuh2JlFww/ — e na Página do Facebook — post ID `1186905547834934_122125740177356392`. Detalhes completos (hospedagem pública, checklist final, fluxo técnico) em `docs/publicacao/log.md`, entrada "2026-08-17 — REPUBLICAÇÃO CORRIGIDA".

---

## 2026-08-18 — Mensagem fixa de boas-vindas (WhatsApp Business Cloud API — primeira mensagem de contato novo)

### Contexto

Pedido feito diretamente pelo usuário: recepção automática do número comercial da Aurum Peptide no WhatsApp Business (Cloud API oficial da Meta) — quando um contato novo manda a primeira mensagem, o sistema responde com um **texto fixo de boas-vindas** (decisão já fechada com o usuário: não é IA conversacional, é resposta automática de texto único). Este entregável é copy pura para implementação técnica (fora do escopo deste agente) — não é briefing de peça visual nem publicação; o hand-off aqui é para quem implementar a automação (dev/integração Cloud API), não para o Designer Manager nem para o Publishing Manager.

Este é o primeiro ponto de contato entre a marca e um novo lead no WhatsApp — canal já documentado como "atendimento e fechamento de vendas" (`docs/marca.md`) e que carrega, na prática, a mesma régua de seriedade que o Grupo VIP (motor de conversão comprovado, `docs/objetivos.md`).

### Decisões de conteúdo (e por que não incluí link de catálogo/convite ao Grupo VIP no texto fixo)

- **Registro institucional, sem soar robotizado** (`docs/tom-de-voz.md`, "Registro"; `docs/valores.md`, valor 2 — "atendimento nunca robotizado, genérico ou tratado como mero suporte transacional"): a mensagem precisa deixar claro, de forma sutil, que é uma resposta inicial automática ("em instantes, alguém da nossa equipe dará continuidade"), sem se apresentar como bot nem soar como script de call center.
- **Endereça a objeção de confiança do avatar antes de qualquer coisa** (`docs/avatar-do-cliente.md`, maior medo é golpe/produto ruim): a primeira impressão precisa parecer atendimento humano de verdade, não disparo automatizado de spam — por isso o texto é curto, pessoal no tom, sem link nem qualquer elemento que lembre discurso comercial.
- **Decisão deliberada: não incluir o link do catálogo (aurumpeptide.com.br/produtos) nem o convite ao Grupo VIP neste texto fixo.** Avaliei os dois e decidi não incluir, por três razões:
  1. É a primeira mensagem para um contato **desconhecido**, cuja intenção ainda não sabemos (pode ser dúvida, pode já vir de uma indicação, pode ser sobre um produto específico) — empurrar link de catálogo ou convite de grupo antes de entender o motivo do contato é o tipo de "framing comercial-agressivo" que a diretriz de venda evita mesmo em canais pessoais (`docs/tom-de-voz.md`, `docs/valores.md`), e é exatamente o padrão que reforça o medo de golpe do avatar (mensagem automática com link, no primeiro contato, é o comportamento clássico de "spam de vendedor" que a marca precisa se diferenciar).
  2. `docs/objetivos.md` trata o Grupo VIP como motor de conversão comprovado — mas o convite ao grupo funciona melhor como um passo qualificado, oferecido pela equipe depois de entender o que a pessoa busca, não como texto genérico de robô. Isso é coerente com a fala do próprio usuário (`docs/objetivos.md`, "Atualização 17/08") de que a conversão do grupo vem do trabalho ativo/pessoal dele lá dentro — não de link solto.
  3. A pergunta de triagem no fechamento da mensagem já cumpre a função de "próximo passo": abre a conversa para a equipe (humana) direcionar a pessoa ao catálogo ou ao Grupo VIP de forma personalizada, na sequência real da conversa — que é fora do escopo deste texto fixo.
- **Sem gírias, sem termo técnico, sem emoji em excesso** (`docs/tom-de-voz.md`): optei por não usar emoji nesta mensagem específica — é a primeira impressão institucional da marca, e o registro formal pesa mais do que a humanização por emoji neste ponto de contato específico (emoji continua permitido em outros pontos do atendimento, sem excesso, conforme o documento).
- **Sem urgência artificial, sem promessa** (`docs/valores.md`): o texto não menciona prazo, escassez nem qualquer chamada de "aproveite agora".
- **Curto (3 linhas), formato WhatsApp** — dentro do limite de 2–4 linhas pedido.

### Texto final (pronto para uso, string única para o código)

> Olá, seja bem-vindo(a) à Aurum Peptide.
> Recebemos sua mensagem e, em instantes, alguém da nossa equipe dará continuidade ao seu atendimento.
> Para agilizarmos, pode nos contar brevemente o que você gostaria de saber?

### Verificações contra as regras da marca

- Nenhuma menção a preço, produto específico ou "disponível para venda" — não é ponto de oferta, é acolhimento.
- Nenhum link de catálogo nem convite ao Grupo VIP neste texto fixo — decisão deliberada, ver razões acima; cabe à equipe (humano) direcionar isso depois de entender a intenção do contato.
- Nenhuma urgência artificial, nenhuma promessa de resultado (`docs/valores.md`).
- Registro formal/institucional mantido, sem gírias (`docs/tom-de-voz.md`).
- Indica de forma sutil que é uma resposta automática inicial, sem se declarar "bot" nem soar robotizado (`docs/valores.md`, valor 2).
- Inclui pergunta de triagem simples, abrindo a conversa para atendimento humano personalizado.

### Status

- [x] Copy final entregue, pronta para implementação técnica no fluxo de automação da Cloud API (fora do escopo deste agente — quem integra tecnicamente é responsabilidade de dev/Strategic Manager, conforme necessidade).
- [ ] Aprovação do usuário antes de ativar o fluxo automático em produção.
- [ ] Pendência a considerar depois de validado o texto fixo: se o volume de contatos por motivo específico justificar, avaliar com o Strategic Manager uma segunda camada (ex.: resposta guiada por palavra-chave) — fora do escopo desta entrega, que é só o texto único combinado com o usuário.

### Revisão de escopo (2026-08-18, mesmo dia) — inclusão de CTA (Grupo VIP, site, aviso de tabela de preços em PDF)

**Mudança pedida pelo usuário (autoridade final, sobrepõe a versão anterior desta mesma entrada):** a versão inicial acima foi escrita deliberadamente sem link/CTA (ver "Decisões de conteúdo" acima). O usuário decidiu, na sequência, que a mensagem **deve** incluir: (1) boas-vindas institucional (mantida), (2) convite ao Grupo VIP com link real, enviado só na primeira mensagem de um contato novo — repetição por contato já é tratada pela automação, não pelo texto, (3) menção ao site (`https://aurumpeptide.com.br`), (4) aviso de que a tabela de preços atualizada vem em seguida, como PDF anexado em mensagem separada (o texto fixo só avisa que ela vem a seguir, não traz link/preço).

**Por que isso não contradiz a regra de "sem CTA/venda direta em conteúdo educacional" (`docs/tom-de-voz.md`) nem a de "nunca preço em post orgânico de produto":** aquelas regras são específicas de **conteúdo de feed público** (Instagram/Facebook) — peças que qualquer seguidor vê, incluindo pessoas fora do funil de atendimento, onde a Meta penaliza sinalização de venda e onde CTA de preço reduz alcance/expõe a conta a risco de política de plataforma (`docs/tom-de-voz.md`, seção "Posts de produto"). Esta mensagem é **atendimento 1:1 direto**, no WhatsApp Business da marca, para uma pessoa que **já iniciou contato voluntariamente** com a Aurum — o mesmo canal que `docs/marca.md` já documenta como "atendimento e fechamento de vendas". Direcionar esse contato para o Grupo VIP, o site e avisar sobre a tabela de preços é o equivalente, no WhatsApp, ao que o CTA de fechamento já faz em qualquer carrossel de feed ("fale com a gente pelo WhatsApp/Grupo VIP — link na bio") — não é a mensagem que inicia a venda, é o direcionamento de canal já autorizado pela própria regra (`docs/tom-de-voz.md`: "o fechamento/CTA continua direcionando para o Grupo VIP do WhatsApp ou para o WhatsApp pessoal — isso não é 'framing de venda' dentro do post, é redirecionamento de canal"). A única adaptação foi de tom: os links são oferecidos como algo útil ("fica o convite", "conheça também"), não como pitch — sem preço no texto, sem urgência, sem "aproveite agora".

**O que muda na minha decisão original (transparência):** a razão 1 do texto anterior (não empurrar link antes de entender a intenção do contato) segue válida como princípio geral, mas o usuário, como autoridade de negócio, decidiu que o ganho de expor logo o Grupo VIP/site/aviso de PDF a todo contato novo supera esse risco — é uma decisão de escopo do dono da marca, não uma inconsistência de tom. O texto revisado preserva o cuidado de tom (institucional, sem pitch, sem preço solto) que sustentava a decisão original.

**Texto final revisado (substitui a versão anterior desta entrada, pronto para uso, string única para o código):**

> Olá, seja bem-vindo(a) à Aurum Peptide.
> Recebemos sua mensagem e, em instantes, alguém da nossa equipe dará continuidade ao seu atendimento.
> Enquanto isso, fica o convite para o nosso Grupo VIP no WhatsApp — conteúdo exclusivo e atendimento prioritário: https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb?s=cl&p=i&mlu=0
> Conheça também o portfólio completo em nosso site: https://aurumpeptide.com.br
> Na sequência, enviamos a tabela de preços atualizada em PDF.

**Verificações contra as regras da marca (versão revisada):**

- Nenhum preço no texto fixo — a tabela vai em anexo separado, só se avisa que ela vem a seguir, conforme pedido.
- Nenhuma urgência artificial, nenhum "aproveite agora"/"só hoje" (`docs/valores.md`).
- Links oferecidos com framing de convite/utilidade ("fica o convite", "conheça também"), não de oferta comercial — mantém o teste de `docs/tom-de-voz.md` ("isso soa institucional e sério, mesmo em um DM?").
- Link do Grupo VIP e menção ao site tratados como redirecionamento de canal (já autorizado pela regra de CTA em `docs/tom-de-voz.md`), não como venda dentro da própria mensagem.
- Registro institucional mantido: sem emoji, sem gíria, sem termo técnico infundado.
- Indicação sutil de resposta automática inicial mantida ("em instantes, alguém da nossa equipe dará continuidade").
- Envio do link do Grupo VIP restrito à primeira mensagem de um contato novo é responsabilidade da automação (fora do texto) — confirmado pelo usuário que já está tratado nesse nível.

### Status (atualizado após revisão de escopo)

- [x] Texto revisado com os 4 elementos pedidos pelo usuário (boas-vindas, Grupo VIP, site, aviso de PDF) — substitui a versão sem CTA.
- [ ] Aprovação final do usuário antes de ativar em produção (o pedido de inclusão dos 4 elementos já é a decisão do usuário; falta apenas validar o texto literal antes do go-live).
- [ ] Implementação técnica: confirmar com quem for integrar a Cloud API que o PDF da tabela de preços será enviado como mensagem separada, imediatamente após esta, e que o link do Grupo VIP só é enviado no primeiro contato (regra de automação, não do texto) — fora do escopo deste agente, apenas sinalizado aqui para rastreabilidade.
