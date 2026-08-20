# Log de Publicação — Publishing Manager

Log cronológico do que foi publicado (ou tentado publicar), quando, em qual canal/formato, e o horário escolhido — conforme `.claude/agents/publishing-manager.md`. Criado na primeira publicação real do ecossistema.

---

## 2026-08-18 — Ciclo de conteúdo TG 60mg (Tirzepatida): carrossel PUBLICADO NO INSTAGRAM E NO FACEBOOK, **REJEITADO E APAGADO DO INSTAGRAM PELO USUÁRIO NO MESMO DIA**

> **Status atual (histórico, mantido como registro):** esta publicação (media ID `18081087101682407` no Instagram, permalink `https://www.instagram.com/p/DcKgKHiDCmH/`; post ID `1186905547834934_122125795449356392` no Facebook) foi **rejeitada pelo dono da Aurum Peptide em 18/08/2026 e apagada por ele mesmo do Instagram** logo após publicada. Motivo, nas palavras do usuário: "post ficou muito ruim, tive que excluir do instagram, não tem nada de educativo e não tem um título bem feito." **Não confirmado se também foi removida da Página do Facebook** — tratar como pendente até confirmação; não presumir removida lá também sem checar.
>
> **Diagnóstico (Strategic Manager/CMO):** a correção de 17/08 recompôs apenas o Slide 4 (preço → evidência científica), mas os outros 4 slides (capa "Uma nova adição ao portfólio Aurum", confiança institucional genérica, produto, fechamento) permaneceram exatamente como na versão de venda original de 28/07. A capa em particular continuou lendo como anúncio de lançamento de produto, não como gancho educativo — diferente dos dois carrosséis que o usuário de fato manteve no ar (Semax/Selank republicado e "Evidência não é igual para todos", 12/08), que abrem com pergunta/insight científico e só fecham com CTA. **Lição permanente registrada:** converter uma peça de venda para formato educativo exige reescrever a peça inteira (capa incluída), não só trocar o slide com o problema mais óbvio (preço). Uma nova versão, reescrita do zero pelo Marketing Manager com a mesma estrutura dos carrosséis validados, está em produção — ver `docs/marketing/conteudo.md` para o novo briefing quando pronto. **Desta vez, a peça reformulada precisa de aprovação explícita do usuário antes de qualquer nova publicação** — a autorização de publicação autônoma já dada para este ciclo não cobre uma peça reescrita do zero.

**Contexto (registro original, mantido intacto abaixo):** ciclo original produzido em 28/07/2026 (primeiro produto real apresentado pela marca), nunca publicado até esta data. Em 17/08/2026 o usuário rejeitou o Slide 4 original (continha preço, "R$ 1.200 — Disponível para clientes Aurum") — nova diretriz permanente registrada em `docs/tom-de-voz.md` ("Posts de produto no Instagram/Facebook — nunca preço nem 'disponível para venda'", 2026-08-17). O Slide 4 foi recomposto pelo Designer Manager (conteúdo educativo sobre Tirzepatida — aprovação FDA/ANVISA, estudo SURMOUNT-1 — sem preço nem percentual de eficácia), registrado em `docs/design/pecas.md` ("Recomposição 2026-08-17 — Slide 4") e `docs/marketing/conteudo.md` ("Correção pós-nova-diretriz"). Slides 1, 2, 3 e 5 permanecem exatamente como em 28/07. O Strategic Manager (CMO) autorizou explicitamente a publicação do ciclo completo em 18/08/2026 ("Pode publicar de uma vez tudo"), com a sequência: Grupo VIP (WhatsApp) primeiro, carrossel público 30–60 min depois.

**Origem:** entregue completo pelo Designer Manager. Briefing e copy (incluindo a Peça 3 — mensagem ao Grupo VIP, preço corrigido para R$ 1.000) em `docs/marketing/conteudo.md`, entrada 2026-07-28. Publicação autônoma, conforme autorização registrada em `.claude/agents/publishing-manager.md` — sem necessidade de nova rodada de aprovação por peça além da já dada pelo usuário para este ciclo específico.

### Passo 1 — Mensagem ao Grupo VIP (WhatsApp): PENDENTE, execução manual

Este canal está **fora do escopo de automação do Publishing Manager** (não é publicável via Meta Graph API; disparo de mensagem em grupo de WhatsApp não é um endpoint coberto pela integração deste agente, ver `docs/integracoes/meta.md`). Texto já pronto e revisado (preço R$ 1.000, corrigido em 17/08/2026) em `docs/marketing/conteudo.md`, seção "Peça 3 — Mensagem ao Grupo VIP (WhatsApp)"; pode reaproveitar `docs/design/2026-07-28-tg60mg/final/slide-3-produto.png` como imagem de apoio opcional. **Sinalizado explicitamente ao usuário/atendimento: esta etapa precisa ser disparada manualmente**, idealmente antes ou próximo do momento da publicação pública abaixo, para preservar a lógica de "acesso prioritário real" do briefing original — não bloqueou o restante da sequência, conforme instrução explícita recebida.

### Passo 2 — Carrossel de feed (Instagram + Facebook): PUBLICADO

### Checklist final de validação (última checagem antes de publicar)

- [x] **Nenhuma das 5 imagens finais contém preço ou "disponível para venda"** — critério de bloqueio mais importante desta publicação, confirmado por leitura direta de cada uma das 5 imagens (não apenas pela validação já registrada pelo Designer Manager): Slide 1 (capa, só título/logo), Slide 2 (confiança, sem preço), Slide 3 (produto, sem preço), Slide 4 (recomposto — "Tirzepatida: o que a evidência mostra", conteúdo sobre aprovação FDA/ANVISA e estudo SURMOUNT-1, nenhum "R$" nem "disponível"), Slide 5 (fechamento — CTA para WhatsApp/Grupo VIP, sem preço).
- [x] **Identidade visual** (`docs/identidade-visual.md`) — confirmado por leitura direta: paleta oficial (verde `#0D1B16`, dourado `#C6A55A`, branco gelo), molécula/lockup oficiais sem redesenho, tipografia serif/sans-serif, sem elementos proibidos.
- [x] **Formato compatível com o canal** — 5 imagens 1080×1350 (4:5), formato correto para carrossel de feed no Instagram e para álbum de fotos na Página do Facebook.
- [x] **Nada faltando** — 5 imagens finais presentes na ordem correta em `docs/design/2026-07-28-tg60mg/final/`, legenda completa (versão corrigida sem menção a preço/disponibilidade) pronta para os dois canais.

Nenhum item bloqueou a publicação.

### Hospedagem pública das imagens

Mesmo fluxo já validado em 12/08, 14/08 e 17/08:

1. As 5 imagens finais copiadas de `docs/design/2026-07-28-tg60mg/final/` para `apps/site/public/marketing/2026-07-28-tg60mg/` (mesmos nomes de arquivo, incluindo `slide-4-preco.png` já na versão recomposta sem preço).
2. `git status` verificado antes do commit: havia mudanças pendentes de outros agentes fora do escopo desta tarefa (mesma lista recorrente de `docs/`, `scripts/meta_graph.py`, além de `docs/analytics/memoria/`, `docs/design/2026-08-12-...`, `docs/design/2026-08-14-...`, `docs/publicacao/`, `supabase/seo-conteudo-produtos.sql` como diretórios/arquivos não relacionados). Nenhuma delas foi incluída — `git add` escopado só às 5 imagens novas.
3. Commit `3fc4979` ("Adiciona imagens do carrossel TG 60mg (28/07, Slide 4 recomposto sem preço) para hospedagem pública") e push para `origin/main`.
4. Deploy da Vercel propagado (levou cerca de 1–2 minutos, a primeira checagem retornou 404 nas 5 URLs); confirmado HTTP 200 nas 5 URLs antes de qualquer chamada à Graph API:
   - `https://www.aurumpeptide.com.br/marketing/2026-07-28-tg60mg/slide-1-capa.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-07-28-tg60mg/slide-2-confianca.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-07-28-tg60mg/slide-3-produto.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-07-28-tg60mg/slide-4-preco.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-07-28-tg60mg/slide-5-fechamento.png`

### Horário de publicação

Consultado `docs/analytics/memoria/instagram-organico.md` (existe desde 17/08/2026, primeira vez que este arquivo está disponível para consulta numa publicação real) antes de publicar. O próprio arquivo registra explicitamente: **"Melhores horários de postagem: Não disponível"** — com apenas 2 posts reais do ecossistema medidos até 17/08, sem base estatística para apontar horário ótimo. Sem dado real disponível, publicado imediatamente após a validação técnica (hospedagem + checklist), sem horário arbitrário escolhido. O mesmo arquivo também registra, como limitação ativa, que "TG 60mg (produto, CTA de compra) nunca publicado — zero dado real de conteúdo de produto do ecossistema. Prioridade para o próximo ciclo de publicação" — esta publicação resolve essa lacuna para o Analytics Manager medir daqui para frente.

### Instagram — PUBLICADO

Fluxo executado: 5× `POST /{ig-user-id}/media --param is_carousel_item=true` (um por imagem) → container `POST /{ig-user-id}/media --param media_type=CAROUSEL --param children=<ids> --param caption=<legenda>` (`creation_id` `18056344514620630`) → confirmado `status_code: FINISHED` via `GET /{creation_id}?fields=status_code,status` → `POST /{ig-user-id}/media_publish --param creation_id=<id>`. Sucesso em todas as etapas, sem retries.

- **Media ID:** `18081087101682407`
- **Permalink:** https://www.instagram.com/p/DcKgKHiDCmH/
- **Timestamp (API):** 2026-08-18T02:08:43+0000
- **Tipo:** `CAROUSEL_ALBUM`, 5 slides, legenda corrigida (idêntica à registrada em `docs/marketing/conteudo.md`, seção "Legenda — depois", correção de 2026-08-17), conferida por leitura de volta via `GET /{media-id}?fields=caption` antes de fechar a tarefa.

### Facebook (Página) — PUBLICADO

**Pré-checagem obrigatória feita antes de tentar:** `git log --oneline -- scripts/meta_graph.py` e `git diff scripts/meta_graph.py` confirmados — a correção de Page Access Token (commit `95822e6`, "Resolve Page Access Token automaticamente para endpoints de Página") **já está commitada em `main`**, sem diferença pendente no working tree. Diferente das publicações de 14/08 e 17/08, esta é a primeira publicação no Facebook feita com o script já formalizado no repositório — a pendência recorrente registrada nas duas entradas anteriores está resolvida.

Fluxo executado: 5× `POST /{page-id}/photos --param url=<url> --param published=false` (Page Access Token resolvido automaticamente pelo script) → `POST /{page-id}/feed --param message=<legenda> --param attached_media[0..4]=<media_fbid>`. Sucesso em todas as etapas, sem retries.

- **Post ID:** `1186905547834934_122125795449356392`
- 5 fotos anexadas (`published=false` cada, compostas no post do feed via `attached_media`), mesma legenda do Instagram.
- **Nota:** leitura de confirmação (`GET /{post-id}?fields=permalink_url`) retornou erro `(#10)` — falta de permissão `pages_read_engagement`/"Page Public Content Access" no token atual para leitura desse campo específico. Não afeta a publicação em si (a chamada de criação do post retornou HTTP 200 com o Post ID acima, confirmando sucesso) — apenas não foi possível obter o `permalink_url` por essa via. Sinalizado para o Strategic Manager como possível ajuste futuro de escopo do token, se a leitura de permalink do Facebook passar a ser necessária de forma recorrente.

### Legenda publicada (idêntica nos dois canais, versão corrigida de 17/08 — sem preço/disponibilidade)

> Apresentamos a mais nova adição ao portfólio Aurum Peptide: TG 60MG, à base de Tirzepatida — parte da linha de emagrecimento e metabolismo da marca.
>
> Tirzepatida é hoje uma das moléculas com maior nível de evidência científica do seu tipo: aprovada por agências regulatórias internacionais (FDA e ANVISA) e avaliada no maior estudo clínico de fase 3 já publicado sobre o tema, com mais de 2.500 participantes em múltiplos países, incluindo o Brasil.
>
> Sabemos que, neste mercado, a decisão de confiar passa antes de tudo por uma pergunta: em quem confiar. Por isso tratamos cada produto do nosso portfólio com o mesmo rigor — sem promessas exageradas, com a seriedade que sustenta a confiança dos nossos clientes.
>
> Informações completas e orientação: fale com a nossa equipe pelo WhatsApp (link na bio) ou pelo Grupo VIP.
>
> #AurumPeptide

### Método de execução técnica (nota para rastreabilidade)

Mesmo motivo já registrado em 14/08 e 17/08: a legenda contém travessões, acentuação e quebras de linha que tornam a passagem via `--param caption=...` na linha de comando propensa a erro de escaping. Usado um script Python de execução única (criado em pasta de scratchpad, executado e **apagado logo em seguida** — não faz parte do repositório) que importa as funções de `scripts/meta_graph.py` (`request`, `get_page_access_token`, `load_dotenv`, `DEFAULT_API_VERSION`) diretamente, sem alterar o script original nem expor o token em nenhum momento. Nenhuma credencial foi manipulada manualmente; o token seguiu sendo lido só do `.env` pela função já existente `load_dotenv`.

### Pendências (status final desta peça)

- [x] Hospedagem pública — resolvida (commit `3fc4979`, deploy confirmado, HTTP 200 nas 5 URLs).
- [x] Instagram — publicado (media ID `18081087101682407`).
- [x] Facebook (Página) — publicado (post ID `1186905547834934_122125795449356392`), usando a correção de Page Access Token já commitada em `main` — pendência recorrente das duas publicações anteriores agora resolvida.
- [ ] **Mensagem ao Grupo VIP (WhatsApp)** — não disparada por este agente (fora do escopo de automação do Publishing Manager). Pendente de execução manual pelo usuário/atendimento, texto pronto em `docs/marketing/conteudo.md` ("Peça 3", preço R$ 1.000).
- [ ] Sem dado de horário ótimo em `docs/analytics/memoria/instagram-organico.md` — pendência recorrente, mesma recomendação já registrada em 12/08, 14/08 e 17/08 para o Analytics Manager. Esta publicação (primeiro post de produto real do ecossistema) deveria ajudar a popular esse dado nas próximas coletas.
- [ ] **Analytics Manager:** medir o desempenho desta peça como o primeiro post de produto real do ecossistema (CTA de compra, sem preço no post — WhatsApp/Grupo VIP como canal de fechamento) — insumo relevante para `docs/analytics/memoria/instagram-organico.md`, que hoje registra explicitamente essa lacuna.
- [ ] Demais pendências já registradas na entrada original de 28/07 (`docs/marketing/conteudo.md`): fotos reais do produto TG 60mg (60mg, não 15mg) e limpeza do campo `imagem_url` no Supabase — seguem em aberto, sem relação com esta publicação.

---

## 2026-08-17 — REPUBLICAÇÃO CORRIGIDA: Carrossel educacional "Duas moléculas. Duas perguntas sobre a mente humana." (Semax vs. Selank) — PUBLICADO NO INSTAGRAM E NO FACEBOOK

**Esta é uma republicação, não uma edição da entrada de 14/08 abaixo.** A versão original desta peça (mesmo título, mesma estrutura de 6 páginas) foi publicada em 14/08/2026 (Instagram media ID `17896208916570217`, Facebook post ID `1186905547834934_122125024929356392`), **rejeitada pelo dono da Aurum Peptide em 16/08/2026 e apagada por ele mesmo dos dois canais** — motivo: a copy mencionava explicitamente que Semax e Selank estão "fora do portfólio Aurum"/"não constam no portfólio comercializado pela Aurum Peptide", considerado irrelevante para conteúdo puramente educacional. Ver a entrada de 14/08 abaixo, subseção "Correção pós-rejeição (2026-08-16)" em `docs/marketing/conteudo.md`, para o histórico completo do motivo e da correção de copy, e `docs/design/pecas.md` (mesma data), subseção "Recomposição pós-correção (2026-08-16/17)", para a execução visual da correção. **Esta entrada documenta apenas a republicação da versão corrigida, com novos media IDs/post IDs — a versão anterior permanece registrada e identificada como rejeitada, não removida do log.**

**Peça:** mesmo carrossel educacional (6 páginas), Semax vs. Selank — peptídeos nootrópicos russos, fora do portfólio comercializado pela Aurum Peptide. Apenas as Páginas 1 (subtítulo), 2 (corpo) e 6 (primeira frase do disclaimer) foram recompostas para remover toda menção a portfólio/catálogo; os disclaimers regulatórios reais (FDA/ANVISA, registro como medicamento de prescrição na Rússia, "não é indicação de uso") permanecem intactos. Páginas 3, 4 e 5 são exatamente as mesmas de 14/08 (confirmado por timestamp de arquivo antes de publicar). Legenda também corrigida (removida a frase de portfólio do terceiro parágrafo), idêntica nos dois canais.

**Origem:** entregue completo pelo Designer Manager (`docs/design/pecas.md`, entrada 14/08, subseção "Recomposição pós-correção"). Usuário deu aprovação explícita para republicar — não foi necessária nova rodada de aprovação de conteúdo por peça, conforme autorização de publicação autônoma já registrada em `.claude/agents/publishing-manager.md`.

### Checklist final de validação (última checagem antes de publicar)

- [x] **Nenhuma menção a portfólio/catálogo/venda da Aurum** em nenhuma das 6 páginas nem na legenda — confirmado por leitura direta das 3 imagens recompostas (Páginas 1, 2, 6) antes de publicar, e por releitura do texto da legenda contra `docs/marketing/conteudo.md`.
- [x] **Disclaimers regulatórios reais preservados** — Página 6 mantém "Semax e Selank não são aprovados pela FDA nem pela ANVISA", informação de registro como medicamento de prescrição na Rússia (com a ressalva de que não é validação regulatória no Brasil), e "não é indicação de uso, não é orientação de aplicação, não substitui avaliação de profissional de saúde habilitado".
- [x] **Identidade visual** (`docs/identidade-visual.md`) — paleta oficial (verde `#0D1B16`, dourado `#C6A55A`, branco gelo), tipografia serif/sans-serif, molécula/lockup oficiais sem redesenho, mesmo fundo institucional das 3 peças anteriores da série — confirmado por leitura direta das 3 páginas recompostas.
- [x] **Formato compatível com o canal** — 6 imagens 1080×1350 (4:5), formato correto para carrossel de feed no Instagram e para álbum de fotos na Página do Facebook (confirmado por `ls` das dimensões dos arquivos, mesma checagem já feita pelo Designer Manager).
- [x] **Nada faltando** — 6 imagens finais presentes na ordem correta em `docs/design/2026-08-14-carrossel-semax-selank/final/`, legenda completa corrigida disponível para os dois canais.

Nenhum item bloqueou a publicação.

### Hospedagem pública das imagens — atualização das 3 páginas corrigidas

As URLs públicas já existiam desde 14/08 (`apps/site/public/marketing/2026-08-14-carrossel-semax-selank/`), mas apontavam para a versão rejeitada. Antes de qualquer chamada à Graph API:

1. Comparados os timestamps de arquivo entre `docs/design/2026-08-14-carrossel-semax-selank/final/` e a pasta pública — confirmado que `pagina-1-capa.png`, `pagina-2-contexto.png` e `pagina-6-fechamento.png` na pasta pública ainda eram a versão de 14/08 (rejeitada); `pagina-3-semax.png`, `pagina-4-selank.png` e `pagina-5-comparacao.png` já eram idênticas nos dois lados (nunca mudaram).
2. Sobrescritas apenas as 3 páginas alteradas na pasta pública, copiando de `docs/design/2026-08-14-carrossel-semax-selank/final/`.
3. `git status` verificado antes do commit: havia mudanças pendentes de outros agentes fora do escopo desta tarefa (mesma lista já registrada na entrada de 14/08, mais `docs/publicacao/` como novo diretório não relacionado a esta ação específica). Nenhuma delas foi incluída — `git add` escopado só às 3 imagens.
4. Commit `8e57f4d` ("Atualiza imagens corrigidas do carrossel Semax vs. Selank (14/08) para republicacao") e push para `origin/main`.
5. Deploy da Vercel propagado; confirmado HTTP 200 nas 6 URLs (com `content-length` batendo com os arquivos locais corrigidos) antes de qualquer chamada à Graph API:
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-1-capa.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-2-contexto.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-3-semax.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-4-selank.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-5-comparacao.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-6-fechamento.png`

### Horário de publicação

Consultado `docs/analytics/memoria/` novamente antes de publicar — **o diretório ainda não existe**, nenhum dado de melhor horário por produto/campanha disponível. Sem justificativa baseada em dado real, publicado imediatamente após a validação técnica (hospedagem + checklist), sem horário arbitrário escolhido. Mesma pendência recorrente já sinalizada em 12/08 e 14/08 ao Analytics Manager.

### Instagram — PUBLICADO

Fluxo executado: 6× `POST /{ig-user-id}/media --param is_carousel_item=true` (um por imagem) → container `POST /{ig-user-id}/media --param media_type=CAROUSEL --param children=<ids> --param caption=<legenda>` (`creation_id` `18056309963620630`). Na primeira tentativa de `media_publish`, a API retornou erro `(#9007) Media ID is not available` / `error_subcode 2207027` ("A mídia não está pronta para ser publicada. Aguarde um momento.") — comportamento assíncrono normal para o processamento das 6 imagens do carrossel, não visto nas publicações anteriores da série (talvez por volume/tamanho de arquivo). Consultei `GET /{creation_id}?fields=status_code,status`, confirmei `status_code: FINISHED`, e repeti `media_publish` com sucesso, sem qualquer nova tentativa de upload.

- **Media ID:** `18113777833767779`
- **Permalink:** https://www.instagram.com/p/DcJuh2JlFww/
- **Timestamp (API):** 2026-08-17T18:53:41+0000
- **Tipo:** `CAROUSEL_ALBUM`, 6 páginas, legenda corrigida (idêntica à registrada em `docs/marketing/conteudo.md`, seção "Legenda completa corrigida, pronta para reuso").

### Facebook (Página) — PUBLICADO

**Pré-checagem obrigatória feita antes de tentar (reforçada, mesma pendência de 14/08):** `git diff --stat scripts/meta_graph.py` e `git status --short scripts/meta_graph.py` confirmados novamente — a correção de Page Access Token (`get_page_access_token`, `endpoint_requires_page_token`) **segue presente no working tree, mas ainda não commitada** (`modified`, não staged), idêntica ao estado já registrado na entrada de 14/08 abaixo, três dias depois. Usei a versão local mesmo assim, pelo mesmo critério já autorizado pelo Strategic Manager em 14/08 (funcional, não é bloqueio) — mas **reforço aqui, pela segunda vez, que essa correção segue não formalizada no repositório**, pendência acumulando sem decisão.

Fluxo executado: 6× `POST /{page-id}/photos --param url=<url> --param published=false` (Page Access Token resolvido automaticamente) → `POST /{page-id}/feed --param message=<legenda> --param attached_media[0..5]=<media_fbid>`. Sucesso em todas as etapas, sem retries.

- **Post ID:** `1186905547834934_122125740177356392`
- 6 fotos anexadas (`published=false` cada, compostas no post do feed via `attached_media`), mesma legenda corrigida do Instagram.

### Legenda publicada (idêntica nos dois canais, versão corrigida)

> Semax e Selank são dois peptídeos nootrópicos de origem russa, estudados por sua relação com o sistema nervoso central — um mais associado a contextos de recuperação neurológica, outro a contextos de ansiedade.
>
> Neste carrossel, mostramos o que a evidência científica disponível hoje realmente diz sobre os dois: o que foi estudado, em quem, e com que tipo de desenho de pesquisa — sem transformar isso em promessa de efeito.
>
> Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado.
>
> O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários.
>
> #AurumPeptide

### Método de execução técnica (nota para rastreabilidade)

Mesmo motivo já registrado em 14/08: a legenda contém travessões e quebras de linha que tornam a passagem via `--param caption=...` na linha de comando propensa a erro de escaping. Usado um script Python de execução única (criado em pasta de scratchpad, executado e **apagado logo em seguida** — não faz parte do repositório) que importa as funções de `scripts/meta_graph.py` (`request`, `get_page_access_token`, `load_dotenv`, `DEFAULT_API_VERSION`) diretamente, sem alterar o script original nem expor o token em nenhum momento. Nenhuma credencial foi manipulada manualmente; o token seguiu sendo lido só do `.env` pela função já existente `load_dotenv`. A publicação do container do Instagram (`media_publish`) foi finalizada por chamada direta via `python scripts/meta_graph.py post ...` (sem script auxiliar) depois de confirmado `status_code: FINISHED`.

### Pendências (status final desta peça)

- [x] Hospedagem pública atualizada — as 3 imagens corrigidas substituídas na pasta pública, commit `8e57f4d`, deploy confirmado.
- [x] Instagram — republicado (media ID `18113777833767779`), versão corrigida.
- [x] Facebook (Página) — republicado (post ID `1186905547834934_122125740177356392`), versão corrigida.
- [ ] **Decisão do Strategic Manager, reforçada pela segunda vez:** formalizar (commitar) a correção de Page Access Token em `scripts/meta_graph.py` — já validada em produção três vezes agora (12/08 bloqueado, 14/08 e 17/08 publicados com sucesso), ainda não commitada. Cada nova publicação no Facebook segue dependendo de uma alteração não versionada na working tree local.
- [ ] Sem dado de horário ótimo em `docs/analytics/memoria/` — pendência recorrente, reforçando a recomendação já registrada em 12/08 e 14/08 para o Analytics Manager.
- [ ] **Analytics Manager:** ao medir o desempenho desta peça, tratar como publicação nova (17/08), não comparável 1:1 com a tentativa de 14/08 (removida do ar após ~2 dias, sem tempo de maturar métricas).

---

## 2026-08-14 — Carrossel educacional "Duas moléculas. Duas perguntas sobre a mente humana." (Semax vs. Selank) — PUBLICADO NO INSTAGRAM E NO FACEBOOK, **REJEITADO E APAGADO EM 16/08, REPUBLICADO CORRIGIDO EM 17/08**

> **Status atual (histórico, mantido como registro):** esta publicação (media ID `17896208916570217` no Instagram, post ID `1186905547834934_122125024929356392` no Facebook) foi **rejeitada pelo dono da Aurum Peptide em 16/08/2026 e apagada por ele mesmo dos dois canais**, por menção indevida a "fora do portfólio Aurum" em conteúdo educacional. A versão corrigida foi republicada em 17/08/2026, com novos IDs — ver a entrada **"2026-08-17 — REPUBLICAÇÃO CORRIGIDA"** logo acima nesta página para os detalhes completos da republicação. A entrada abaixo é mantida intacta como registro histórico da tentativa original.

**Peça:** carrossel educacional (6 páginas), comparando Semax e Selank — peptídeos nootrópicos russos, **fora do portfólio comercializado pela Aurum Peptide**. Conteúdo puramente educacional, sem CTA de compra/preço/produto, terceiro carrossel real do ecossistema, mesmo padrão técnico dos de 28/07 e 12/08.

**Origem:** entregue completo pelo Designer Manager. Briefing e copy em `docs/marketing/conteudo.md` ("2026-08-14 — Carrossel educacional: Semax vs. Selank"), execução e validação visual em `docs/design/pecas.md` (mesma data). Publicação autônoma, conforme autorização registrada em `.claude/agents/publishing-manager.md` (decisão do usuário, 2026-08-14) — sem necessidade de nova rodada de aprovação por peça; único critério de bloqueio seria técnico/funcional, e não houve nenhum (as 6 imagens e a legenda chegaram completas e no formato correto).

**Canais:** feed do Instagram (@aurumpeptide) e Página do Facebook, carrossel/álbum idêntico nos dois, mesma legenda (reproduzida abaixo, idêntica à registrada em `docs/marketing/conteudo.md`).

### Hospedagem pública das imagens

Mesmo fluxo validado em 12/08 (`apps/site/public/marketing/`, já em produção via Vercel):

1. As 6 imagens finais copiadas de `docs/design/2026-08-14-carrossel-semax-selank/final/` para `apps/site/public/marketing/2026-08-14-carrossel-semax-selank/` (mesmos nomes de arquivo).
2. `git status` verificado antes do commit: havia mudanças pendentes de outros agentes fora do escopo desta tarefa (`.claude/agents/publishing-manager.md`, `docs/design/pecas.md`, `docs/marketing/conteudo.md`, `docs/pesquisa/cientifico.md`, `docs/pesquisa/regulatorio.md`, `scripts/meta_graph.py`). Nenhuma delas foi incluída no commit — `git add` escopado só à pasta nova de imagens.
3. Commit `ce36582` ("Adiciona imagens do carrossel Semax vs. Selank (14/08) para hospedagem pública") e push para `origin/main`.
4. Deploy da Vercel propagado (as 6 URLs já respondiam HTTP 200 na primeira checagem, poucos segundos após o push); confirmado antes de qualquer chamada à Graph API:
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-1-capa.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-2-contexto.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-3-semax.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-4-selank.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-5-comparacao.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-14-carrossel-semax-selank/pagina-6-fechamento.png`

### Horário de publicação

Consultado `docs/analytics/memoria/` novamente antes de publicar — **o diretório ainda não existe** (apenas `docs/analytics/relatorios.md`, sem dado de melhor horário por produto/campanha). Sem justificativa baseada em dado real disponível, publicado imediatamente após a validação técnica (hospedagem + fluxo de API), sem horário arbitrário escolhido. Mesmo critério de 12/08. Recomendo novamente ao Analytics Manager priorizar popular `docs/analytics/memoria/` para que publicações futuras tenham essa entrada de decisão.

### Instagram — PUBLICADO

Fluxo executado: 6× `POST /{ig-user-id}/media --param is_carousel_item=true` (um por imagem) → container `POST /{ig-user-id}/media --param media_type=CAROUSEL --param children=<ids> --param caption=<legenda>` → `POST /{ig-user-id}/media_publish --param creation_id=<id>`. Sucesso em todas as etapas, sem retries.

- **Media ID:** `17896208916570217`
- **Permalink:** https://www.instagram.com/p/DcCH_PCn3uv/
- **Timestamp (API):** 2026-08-14T20:02:05+0000
- **Tipo:** `CAROUSEL_ALBUM`, 6 páginas, legenda idêntica à registrada em `docs/marketing/conteudo.md` (entrada 2026-08-14).

### Facebook (Página) — PUBLICADO

**Pré-checagem obrigatória feita antes de tentar:** `git diff scripts/meta_graph.py` confirmado com a correção de Page Access Token presente no working tree (função `get_page_access_token`, troca automática de token para endpoints `/{page-id}/photos` e `/{page-id}/feed`) — mas **ainda não commitada** (`git status` mostra `scripts/meta_graph.py` como `modified`, não staged). Conforme instrução recebida do Strategic Manager para este caso específico, usei a versão local mesmo assim (funcional, não é bloqueio) e registro aqui, como pendência a decidir por ele, que a correção segue não commitada no repositório.

Fluxo executado: 6× `POST /{page-id}/photos --param url=<url> --param published=false` (um por imagem, usando o Page Access Token resolvido automaticamente pelo script) → `POST /{page-id}/feed --param message=<legenda> --param attached_media[0..5]=<media_fbid>`. Sucesso em todas as etapas — o erro `(#200) Unpublished posts must be posted to a page as the page itself` que bloqueou a tentativa de 12/08 não ocorreu.

- **Post ID:** `1186905547834934_122125024929356392`
- 6 fotos anexadas (`published=false` cada, depois compostas no post do feed via `attached_media`), mesma legenda do Instagram.

### Legenda publicada (idêntica nos dois canais)

> Semax e Selank são dois peptídeos nootrópicos de origem russa, estudados por sua relação com o sistema nervoso central — um mais associado a contextos de recuperação neurológica, outro a contextos de ansiedade.
>
> Neste carrossel, mostramos o que a evidência científica disponível hoje realmente diz sobre os dois: o que foi estudado, em quem, e com que tipo de desenho de pesquisa — sem transformar isso em promessa de efeito.
>
> Nenhum dos dois faz parte do portfólio comercializado pela Aurum Peptide. Conteúdo puramente educacional, baseado em estudos publicados em periódicos científicos (a maioria russos, indexados no PubMed). Não é indicação de uso, não é orientação de aplicação e não substitui avaliação de profissional de saúde habilitado.
>
> O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários.
>
> #AurumPeptide

### Método de execução técnica (nota para rastreabilidade)

A legenda contém aspas, travessões e quebras de linha que tornam a passagem via `--param caption=...` na linha de comando (bash/PowerShell) propensa a erro de escaping. Para evitar corromper o texto publicado, foi usado um script Python de execução única (criado em `scripts/`, executado e **apagado logo em seguida** — não faz parte do repositório) que importa as funções de `scripts/meta_graph.py` (`request`, `get_page_access_token`, `load_dotenv`, `endpoint_requires_page_token`) diretamente, sem alterar o script original nem expor o token em nenhum momento. Nenhuma credencial foi manipulada manualmente; o token seguiu sendo lido só do `.env` pela função já existente `load_dotenv`.

### Pendências (status final desta peça)

- [x] Hospedagem pública — resolvida (mesma rota de `apps/site/public/marketing/`, já padrão desde 12/08).
- [x] Instagram — publicado (media ID `17896208916570217`).
- [x] Facebook (Página) — publicado (post ID `1186905547834934_122125024929356392`), usando a correção de Page Access Token em `scripts/meta_graph.py` **ainda não commitada**.
- [ ] **Decisão do Strategic Manager:** formalizar (commitar) a correção de Page Access Token em `scripts/meta_graph.py`, já validada em produção duas vezes nesta sessão (Facebook publicado com sucesso). Recomendo commit explícito assim que o Strategic Manager revisar o diff, para que publicações futuras não dependam de uma alteração não versionada na working tree local.
- [ ] Sem dado de horário ótimo em `docs/analytics/memoria/` — pendência recorrente, reforçando a recomendação já registrada em 12/08 para o Analytics Manager.

---

## 2026-08-12 (atualização) — Carrossel educacional "Evidência não é igual para todos." — PUBLICADO NO INSTAGRAM, BLOQUEADO NO FACEBOOK

**Resolução do gap de hospedagem pública (decisão do Strategic Manager/CMO):** em vez das duas rotas mapeadas na tentativa original abaixo (bucket Supabase de produtos ou push direto para `main`), o CMO decidiu por uma terceira rota mais simples: usar `apps/site/public/`, pasta já em produção em `aurumpeptide.com.br` (Vercel, deploy automático via push em `main`), explicitamente destinada a "arquivos públicos/distribuíveis" pelo `CLAUDE.md` raiz.

**Execução:**
1. As 6 imagens finais foram copiadas de `docs/design/2026-08-12-carrossel-evidencia/final/` para `apps/site/public/marketing/2026-08-12-carrossel-evidencia/` (mesmos nomes de arquivo). Confirmado por timestamp que `pagina-1-capa.png` é a versão revisada (com a molécula dourada grande no topo), não a versão original de texto puro.
2. `git status` verificado antes do commit: havia mudanças pendentes não relacionadas a esta tarefa (`docs/design/pecas.md`, `docs/marketing/conteudo.md`, `docs/pesquisa/cientifico.md`, `docs/pesquisa/regulatorio.md` — trabalho legítimo do mesmo ciclo de produção, mas fora do escopo desta tarefa de hospedagem). Não foram incluídas no commit — `git add` foi escopado só à pasta nova, garantindo commit limpo.
3. Commit `427726c` ("Adiciona imagens do carrossel educacional de peptídeos (12/08) para hospedagem pública") e push para `origin/main`.
4. Deploy da Vercel propagado em cerca de 15–30s; as 6 URLs confirmadas com HTTP 200 antes de qualquer chamada à Graph API:
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-1-capa.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-2-contexto.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-3-criterio.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-4-ranking.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-5-nao-significa.png`
   - `https://www.aurumpeptide.com.br/marketing/2026-08-12-carrossel-evidencia/pagina-6-fechamento.png`

### Instagram — PUBLICADO

Fluxo executado conforme mapeado (6 chamadas `POST /{ig-user-id}/media --param is_carousel_item=true` → container `POST /{ig-user-id}/media --param media_type=CAROUSEL --param children=...` → `POST /{ig-user-id}/media_publish`). Sucesso em todas as etapas.

- **Media ID:** `17955403536215292`
- **Permalink:** https://www.instagram.com/p/Db8dzKGmvkL/
- **Timestamp (API):** 2026-08-12T15:17:46+0000
- **Tipo:** `CAROUSEL_ALBUM`, 6 páginas, legenda idêntica à registrada em `docs/marketing/conteudo.md` (entrada 2026-08-12).

### Facebook (Página) — BLOQUEADO, erro novo não mapeado

Fluxo mapeado (`POST /{page-id}/photos --param published=false` por imagem, depois `POST /{page-id}/feed` com `attached_media`) falhou já no primeiro passo, para as 6 imagens:

```json
{
  "error": {
    "message": "(#200) Unpublished posts must be posted to a page as the page itself.",
    "type": "OAuthException",
    "code": 200
  }
}
```

**Causa identificada:** esse endpoint (`/{page-id}/photos` com `published=false`, criação de foto não publicada para depois compor um álbum via `/{page-id}/feed`) exige autenticação com um **token de acesso específico da Página** (Page Access Token), diferente do token de System User usado hoje por `scripts/meta_graph.py` via `.env` (`META_ACCESS_TOKEN`). Confirmei que é possível obter esse token de página (`GET /{page-id}?fields=access_token`, usando o token atual, que tem permissão suficiente na Página) — mas **não usei esse token manualmente fora do script**, por contrariar o princípio explícito de `docs/integracoes/meta.md` ("os agentes não recebem o token em nenhum momento — ele fica só no `.env` local, lido pelo script") e a instrução de nunca manipular credenciais diretamente.

**Isto não estava mapeado na tentativa original** (que só previa o gap de hospedagem, presumindo que o mesmo token funcionaria para ambos os canais uma vez resolvido). É um gap novo, técnico, na integração — não um bloqueio de conteúdo/checklist.

**Publicação no Facebook não realizada. Pendente decisão do Strategic Manager sobre como resolver:**
- opção a: adicionar suporte a um `META_PAGE_ACCESS_TOKEN` (ou troca automática de token para chamadas de `/{page-id}/...`) em `scripts/meta_graph.py`, resolvido fora deste agente (ou por mim, se autorizado explicitamente a alterar o script);
- opção b: usar um fluxo alternativo que não exija `published=false` (ex.: publicar cada foto diretamente já publicada e aceitar que apareçam como posts individuais, não como álbum único) — mudaria o formato do post no Facebook, decisão de conteúdo que não me cabe tomar sozinho;
- opção c: outra alternativa a critério do Strategic Manager.

### Pacote de publicação pronto — status desta tentativa original (mantido como histórico abaixo)

**Peça:** carrossel educacional (6 páginas), peptídeos com mais evidência científica (Semaglutida, Tirzepatida, Retatrutida). Conteúdo puramente educacional, sem CTA de compra/preço/produto.

**Origem:** entregue completo pelo Designer Manager — briefing em `docs/marketing/conteudo.md` ("2026-08-12 — Carrossel educacional: peptídeos com mais evidência científica"), execução e validação em `docs/design/pecas.md` (mesma data, incluindo a revisão da capa). Publicação autorizada explicitamente pelo usuário (dono da Aurum Peptide), via Strategic Manager, sem nova rodada de checagem de conteúdo.

**Canais pretendidos:** feed do Instagram (@aurumpeptide, `META_IG_BUSINESS_ACCOUNT_ID`) e Página do Facebook (`META_PAGE_ID`), carrossel/álbum idêntico nos dois, mesma legenda.

### Checklist final (Publishing Manager) — todos os itens confirmados

- [x] **Identidade visual** (`docs/identidade-visual.md`) — segunda checagem feita por leitura direta das 6 imagens finais (não apenas confiando na validação do Designer Manager). Confirmado: paleta oficial (verde `#0D1B16`, dourado `#C6A55A`, branco gelo), molécula oficial sem redesenho, tipografia serif/sans-serif conforme padrão, sem elementos proibidos (frasco, seringa, jaleco, glow exagerado, rosto humano).
- [x] **Tom de voz e valores** (`docs/tom-de-voz.md`, `docs/valores.md`) — legenda revisada: sem gíria, sem termo médico infundado, sem promessa de resultado/milagre, sem urgência artificial. Frase "Não é indicação de uso, orientação de aplicação nem promessa de resultado" está alinhada com o valor de seriedade sobre o que é vendido.
- [x] **Formato compatível com o canal** — 6 imagens 1080×1350 (4:5), formato correto para carrossel de feed no Instagram e para álbum de fotos na Página do Facebook.
- [x] **Nada faltando** — 6 imagens finais presentes na ordem correta em `docs/design/2026-08-12-carrossel-evidencia/final/` (`pagina-1-capa.png` já na versão revisada com a molécula grande, confirmada por leitura direta do arquivo — não a versão antiga de texto puro), legenda completa e idêntica fornecida para os dois canais. Sem CTA de compra — correto para uma peça deliberadamente educacional.

**Nenhum item do checklist bloqueou a publicação.** O bloqueio identificado abaixo é técnico/de infraestrutura, não de conteúdo.

### Horário de publicação

Consultado `docs/analytics/memoria/` — **o diretório ainda não existe**, nenhum dado de melhor horário por produto/campanha foi registrado pelo Analytics Manager até esta data. Não há, portanto, justificativa baseada em dado real para escolher um horário específico. Nenhum horário foi escolhido arbitrariamente. Assim que `docs/analytics/memoria/` existir com dados relevantes, isso deve orientar o horário desta e de futuras publicações.

### Tentativa técnica real e erro exato

Antes de tentar o fluxo completo de carrossel, validei o pré-requisito de hospedagem pública de imagem com uma chamada real (não presumida) à Instagram Graph API:

```
MSYS_NO_PATHCONV=1 PYTHONIOENCODING=utf-8 python scripts/meta_graph.py post /{ig-user-id}/media \
  --param image_url="file:///.../pagina-1-capa.png" --param is_carousel_item=true
```

Resposta real da API (HTTP 400):

```json
{
  "error": {
    "message": "Only photo or video can be accepted as media type.",
    "type": "OAuthException",
    "code": 9004,
    "error_subcode": 2207052,
    "is_transient": false,
    "error_user_title": "Falha ao baixar mídia. O URI da mídia não atende aos nossos requisitos.",
    "error_user_msg": "Não foi possível obter a mídia deste URI: file:///.../pagina-1-capa.png. Verifique a seção de limitações no nosso documento de desenvolvimento para mais informações: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media#creating",
    "fbtrace_id": "AruHkjuoBX1FxeMw-lonodX"
  }
}
```

**Causa raiz confirmada:** os servidores da Meta baixam a imagem a partir da URL informada em `image_url` — precisa ser uma **URL pública, acessível via HTTPS pela internet**, sem autenticação. O mesmo vale para o endpoint equivalente de fotos da Página do Facebook (`/{page-id}/photos` usa parâmetro `url`, com a mesma exigência). Um caminho de arquivo local (`file://`) nunca vai funcionar — isso não é um bug de configuração, é uma limitação estrutural da API documentada pela própria Meta.

**Gap identificado, não coberto por nenhuma integração existente:** este projeto não tem, até esta data, nenhum mecanismo de hospedagem pública de imagem conectado ao fluxo de publicação. As 6 imagens finais existem apenas como arquivos locais em `docs/design/2026-08-12-carrossel-evidencia/final/`.

**Duas rotas técnicas possíveis foram identificadas, mas nenhuma foi executada, por estarem fora do escopo explícito desta tarefa e/ou exigirem autorização que não tenho:**

1. **Bucket público `produtos` no Supabase Storage** (`supabase/storage.sql`) — já existe e é público para leitura, mas a escrita requer usuário autenticado; as credenciais de service_role (`SUPABASE_SERVICE_ROLE_KEY`) que dariam acesso de escrita irrestrito estão em `apps/site/.env.local` e `apps/admin/.env.local`, não no `.env` usado pela integração Meta. Usar essa chave para subir peças de marketing num bucket criado e com policies pensadas para fotos de produto do catálogo é reaproveitar credencial de produção para uma finalidade fora do escopo original — não fiz isso sem autorização explícita.
2. **Commit + push das imagens para o repositório público no GitHub** (`LucasSaraiva384/aurumpeptide`, confirmado público via API) e uso da URL `raw.githubusercontent.com` correspondente — tecnicamente funcionaria e não exigiria nenhuma credencial nova, mas commitar/dar push no repositório é uma ação que devo tomar **apenas quando explicitamente pedida**; a tarefa não pediu isso, e um push para `main` pode disparar deploy automático do site (o histórico do projeto mostra deploys atrelados a push em `main`) — um efeito colateral que não me cabe decidir sozinho.

**Publicação bloqueada até uma dessas rotas (ou uma alternativa) ser explicitamente autorizada** — por exemplo: eu recebo autorização explícita para usar uma das duas rotas acima, ou é fornecida alguma outra URL pública já hospedada para as 6 imagens, ou o checklist de setup de hospedagem é resolvido por outro agente/pelo usuário.

### Pacote de publicação pronto (entregável desta tentativa)

Enquanto o gap de hospedagem não for resolvido, este é o pacote 100% pronto — conteúdo e horário — para publicação manual ou automatizada assim que a URL pública existir:

- **Imagens (nesta ordem):**
  1. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-1-capa.png`
  2. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-2-contexto.png`
  3. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-3-criterio.png`
  4. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-4-ranking.png`
  5. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-5-nao-significa.png`
  6. `docs/design/2026-08-12-carrossel-evidencia/final/pagina-6-fechamento.png`
- **Legenda (idêntica Instagram/Facebook):** a registrada no briefing (`docs/marketing/conteudo.md`) e reproduzida em `docs/design/pecas.md`, entrada 2026-08-12.
- **Canais/formato:** carrossel de feed no Instagram (@aurumpeptide) + álbum de fotos idêntico na Página do Facebook.
- **Horário:** sem dado disponível em `docs/analytics/memoria/` — a decidir quando houver dado, ou por critério explícito do Strategic Manager/usuário.
- **Fluxo técnico já mapeado, pronto para execução assim que houver URL pública:**
  - Instagram: para cada imagem, `POST /{ig-user-id}/media --param image_url=<url> --param is_carousel_item=true` → 6 `id`s de item; depois `POST /{ig-user-id}/media --param media_type=CAROUSEL --param children=<id1,...,id6> --param caption="<legenda>"` → `creation_id`; depois `POST /{ig-user-id}/media_publish --param creation_id=<id>`.
  - Facebook: para cada imagem, `POST /{page-id}/photos --param url=<url> --param published=false` → 6 `id`s de foto não publicada; depois `POST /{page-id}/feed --param message="<legenda>" --param attached_media[0]={"media_fbid":"<id1>"} ... attached_media[5]={"media_fbid":"<id6>"}`.

### Pendências (status final desta peça)

- [x] Hospedagem pública de imagem — **resolvida** via `apps/site/public/marketing/` (ver atualização no topo desta entrada). Rota validada e reaproveitável para futuras publicações — recomendo adotar como padrão: sempre que uma peça precisar de `image_url` pública para a Graph API, copiar para `apps/site/public/marketing/<data>-<slug>/` e seguir o mesmo fluxo de commit/push/confirmação de deploy.
- [x] Instagram — publicado (ver acima, media ID `17955403536215292`).
- [ ] Facebook (Página) — **bloqueado por gap novo de autenticação** (Page Access Token vs. token de System User no `/{page-id}/photos` com `published=false`), não resolvido nesta sessão. Decisão pendente do Strategic Manager (opções listadas acima).
- [ ] Confirmar com o Strategic Manager/usuário se a rota de hospedagem via `apps/site/public/marketing/` passa a ser o padrão para toda publicação de imagem (provável necessidade recorrente, não específica desta peça).
