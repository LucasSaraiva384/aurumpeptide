# Campanhas — Log Cronológico (Traffic Manager)

Log de campanhas, testes A/B e decisões de público/funil, conforme `.claude/agents/traffic-manager.md`. Cada entrada registra data, canal, decisão tomada e o dado real que a sustenta (nunca estimativa).

---

## 2026-08-05 — Planejamento inicial de Google Ads

Usuário pediu, via Strategic Manager, para iniciar Google Ads: (1) criar conta, (2) montar campanha, (3) monitorar. Nenhuma campanha foi criada ainda — esta entrada registra o **plano**, não uma execução.

Plano completo (pré-requisitos, passo a passo de criação de conta, rastreamento de conversão, estrutura de campanha, palavras-chave candidatas, orçamento e perguntas em aberto) documentado em `docs/trafego/google-ads.md`.

Pontos-chave:
- Nenhum dado real de performance existe ainda para Google Ads — nada a reportar de ROAS/CPA neste momento.
- Sem integração de API para Google Ads (diferente do Meta); monitoramento inicial será manual, dependente de dados repassados pelo usuário.
- Risco de política do Google Ads para peptídeos ("Farmacêuticos e suplementos não aprovados") sinalizado explicitamente como não resolvido — recomendação é rodar piloto pequeno antes de qualquer escala de orçamento.
- Perguntas em aberto (orçamento, razão social/CNPJ, abrangência geográfica) registradas em `docs/trafego/google-ads.md`, aguardando resposta do usuário antes da criação da conta.

**Próxima atualização desta entrada:** quando a conta for criada e/ou a primeira campanha for ativada.

---

## 2026-08-05 — Orçamento e abrangência geográfica confirmados

Usuário confirmou, via Strategic Manager, duas das perguntas em aberto do plano registrado em `docs/trafego/google-ads.md`:

- **Orçamento: R$ 400/mês, recorrente** (não é piloto único de curto prazo). Leitura honesta registrada no plano: é um valor pequeno para Google Ads Pesquisa — estimativa por faixa de CPC (não medida, conta ainda não existe) sugere algo entre ~90–270 cliques/mês, com conversões prováveis na casa de dezenas/mês, abaixo do parâmetro de ~30 conversões/30 dias que o próprio Google recomenda para lances automáticos. Provavelmente leva 2–3 meses para acumular volume suficiente para leitura de CPA confiável — sinalizado ao usuário sem suavizar.
- **Abrangência geográfica: delegada ao Traffic Manager.** Recomendação: concentrar em São Paulo (capital + RM), Rio de Janeiro (capital + RM), Minas Gerais (BH e região), Paraná/Santa Catarina/Rio Grande do Sul (capitais/RMs) e Distrito Federal — critério é concentração de renda/população compatível com o ticket médio de R$ 200–300 (`docs/objetivos.md`), por conhecimento público geral (IBGE), **não por dado real de origem de clientes da Aurum** (esse dado não existe documentado ainda). Recomendado como próximo passo separado: verificar se o campo `cidade` do painel admin ou o relatório de localização do GA4 já têm dado real que permita refinar isso depois.

Ajuste de estrutura de campanha decorrente do orçamento pequeno: 1 campanha, 1 grupo de anúncios ativo no lançamento (Tirzepatida, por ser a linha com maior volume de busca esperado, a confirmar no Planejador de Palavras-chave) — Retatrutida, GHK-Cu e termos institucionais/marca adiados para não diluir a verba. Detalhe completo em `docs/trafego/google-ads.md`.

Razão social/CNPJ segue pendente (não bloqueia o planejamento, só o cadastro de faturamento).

**Próxima atualização:** quando a conta Google Ads for de fato criada.

---

## 2026-08-05 — Conta Google Ads criada; rastreamento de conversão implementado no código

Usuário criou a conta Google Ads (modo Especialista, Gmail da Aurum) e já adicionou cartão de crédito na conta de anúncio. Está vinculando GA4 ↔ Google Ads diretamente na interface do Google (ação manual do usuário).

Em paralelo, implementado no código do site (`apps/site`) o evento de rastreamento para o clique nos CTAs de WhatsApp — a conversão real que a campanha vai medir:
- `lib/whatsapp.ts` ganhou `trackWhatsappClick(origem, produtoNome?)`, que dá `dataLayer.push({ event: "whatsapp_click", whatsapp_origem, whatsapp_produto })`.
- Novo componente `components/WhatsappButtonLink.tsx` ("use client") envolve o `ButtonLink` existente e dispara o evento antes de navegar, sem converter as páginas server-side em client components inteiras.
- Aplicado nos 7 pontos reais de CTA de WhatsApp: Hero (`origem="hero"`), CTA final (`cta-final`), Header (`header`), ProductCard (`product-card`, com `whatsapp_produto`), Footer (`footer`), EmptyState (`empty-state`), página de produto (`product-page`, com `whatsapp_produto`). O link de convite pro grupo de WhatsApp (chat.whatsapp.com) não foi incluído — é outro tipo de engajamento, fora do escopo desta conversão.
- Build e lint do app `site` verificados limpos após a mudança.

**Ainda não commitado/deployado** — código só existe local até o usuário (ou eu, se pedido) decidir subir. Sem o deploy, o evento não aparece em produção pro GTM configurar o trigger/tag de conversão.

**Próxima atualização:** quando o commit/deploy sair e a tag/trigger do GTM para `whatsapp_click` for configurada e testada no GA4 Realtime.

---

## 2026-08-05 — Rastreamento ponta a ponta confirmado; conta e GA4 prontos

Deploy do commit `eb67d50` saiu (push feito). Usuário configurou GTM (trigger + tag para `whatsapp_click`), marcou o evento como conversão no GA4 e importou a conversão no Google Ads. Cartão de crédito já cadastrado na conta de anúncio.

Verificação técnica feita diretamente no site em produção (`aurumpeptide.com.br`, via automação de navegador): disparado um clique real no botão "Fale com um Especialista" do header (navegação bloqueada de propósito, sem abrir o WhatsApp de fato) e confirmado que `window.dataLayer` recebeu `{ event: "whatsapp_click", whatsapp_origem: "header", gtm.uniqueEventId: 16 }` — o `gtm.uniqueEventId` confirma que o container do GTM está escutando e processando o evento em produção.

**Status: pré-requisitos técnicos completos.** Falta apenas: (a) usuário confirmar visualmente no GA4 Realtime que o evento de teste apareceu (fechamento do loop do lado da conta, não testável por mim); (b) rodar o Planejador de Palavras-chave dentro da conta Google Ads recém-criada para confirmar CPC/volume real de busca de "Tirzepatida" antes de finalizar a estrutura de anúncios (isso exige acesso à conta, não à API); (c) razão social/CNPJ segue pendente, só bloqueia o cadastro de faturamento completo, não a criação da campanha em si.

**Próxima atualização:** quando a primeira campanha (grupo de anúncios Tirzepatida) for de fato criada e ativada.

---

## 2026-08-05 — Mudança de direção: campanha institucional/discreta em vez de estrutura por produto

Usuário decidiu, via Strategic Manager, mudar a direção da campanha depois de já ter os pré-requisitos técnicos prontos (conta criada, cartão cadastrado, GA4 vinculado, rastreamento `whatsapp_click` confirmado ponta a ponta — ver entradas acima). Não quer mais grupo de anúncios estruturado por substância/produto com termos transacionais ("tirzepatida comprar" etc.). Quer uma campanha que ajude o site a ranquear bem no Google de forma **discreta/institucional**, sem soar como "loja vendendo peptídeo abertamente".

**Motivo confirmado diretamente pelo usuário (perguntado antes de repassar):** preferência pessoal de posicionamento de marca — **não** (ou não principalmente) o risco de política do Google Ads para "farmacêuticos e suplementos não aprovados" já sinalizado em `docs/trafego/google-ads.md`. Esse risco continua real e no radar, mas não foi o motivo desta mudança específica.

**Estrutura nova (detalhe completo em `docs/trafego/google-ads.md`, seção "Estrutura de campanha recomendada"):**
- Substitui o grupo "Tirzepatida" por um único grupo **"Institucional / Biotecnologia"**, com palavras-chave ancoradas na linguagem editorial real já usada no site (`Hero.tsx`, `lib/seo.ts`): "peptídeos premium importados", "biotecnologia longevidade", "otimização humana peptídeos", "ciência aplicada longevidade" (núcleo) + "peptídeos importados alta qualidade", "onde encontrar peptídeos importados", "peptídeos para performance e regeneração" (complementares, para reduzir risco de volume insuficiente). Nenhum nome de substância nem "comprar" nas palavras-chave ativas.
- Anúncios reaproveitam headlines reais do site ("Biotecnologia & Otimização Humana", "Peptídeos Premium Importados", "Precisão na Escolha, Excelência na Origem") e CTA "Fale com um Especialista" em vez de linguagem de loja.
- Landing page recomendada: home (narrativa institucional), não mais página de produto específica com preço em destaque.
- Orçamento (R$ 400/mês), lance manual CPC e abrangência geográfica (SP/RJ/MG/PR/SC/RS/DF) **não mudam** — só a estrutura de grupo/palavras-chave/anúncio/landing page.

**Avaliação honesta da mudança, não maquiada:** validei e reforcei a leitura que o Strategic Manager já tinha passado — termos institucionais têm volume de busca provavelmente mais baixo que termos de produto ("tirzepatida comprar" refletia demanda de compra real e mensurável; "biotecnologia longevidade" não é frase comum de busca). Com um orçamento já apertado (R$ 400/mês), o risco real agora não é só "menos conversões" — é a campanha possivelmente **não conseguir gastar o próprio orçamento diário** por falta de volume nos termos institucionais. Isso só se confirma rodando o Planejador de Palavras-chave dentro da conta real (próximo passo). Se isso se confirmar, o prazo para acumular dado de CPA confiável (já estimado em 2–3 meses com termos de produto) tende a esticar ainda mais, não encurtar.

O levantamento anterior de palavras-chave por substância (Tirzepatida/Retatrutida/GHK-Cu) segue registrado no histórico deste log e na versão anterior de `docs/trafego/google-ads.md` (preservado via controle de versão do repositório), não foi apagado — só deixou de ser a estrutura ativa.

**Próxima atualização:** quando o Planejador de Palavras-chave confirmar (ou não) volume real para os termos institucionais, e quando a campanha institucional for de fato criada e ativada.

---

## 2026-08-05 — Reversão: volta à estrutura por produto (grupo Tirzepatida)

Usuário reverteu a decisão da entrada anterior. Depois de ver o alerta de volume que dei no pivô institucional (risco real da campanha não conseguir gastar nem o orçamento diário de R$ 13,33 por falta de busca nos termos institucionais/de categoria), decidiu voltar para a estrutura por produto/substância (grupo "Tirzepatida", termos transacionais tipo "tirzepatida comprar", landing page de produto) fechada antes do pivô.

**Motivo, conforme repassado pelo Strategic Manager:** o usuário pesou os dois riscos e concluiu que o risco de volume insuficiente (campanha institucional possivelmente não gastar o próprio orçamento, e esticar ainda mais o prazo já apertado para gerar dado útil) pesa mais do que a preferência por discreção/posicionamento institucional. Decidiu que captar demanda real de compra agora é mais importante do que soar discreto.

**O que muda de volta em `docs/trafego/google-ads.md`:**
- Seção "Estrutura de campanha recomendada" restaurada para a versão por produto: grupo único "Tirzepatida" (termos "tirzepatida comprar", "tirzepatida onde comprar", "comprar tirzepatida original", "onde encontrar tirzepatida"), Retatrutida/GHK-Cu/institucional adiados como já estava antes do pivô.
- Landing page volta a ser página de produto específica (`/produtos/[slug]`), não mais a home.
- As palavras-chave institucionais levantadas no pivô ("peptídeos premium importados", "biotecnologia longevidade" etc.) ficam preservadas no documento como candidatas para o futuro, não descartadas — só deixam de ser a estrutura ativa.
- Orçamento (R$ 400/mês), lance manual CPC e abrangência geográfica (SP/RJ/MG/PR/SC/RS/DF) seguem **sem alteração** — nenhuma das duas mudanças de direção mexeu nisso.

**O que não muda:** o risco de política do Google Ads para "farmacêuticos e suplementos não aprovados" (`docs/trafego/google-ads.md`, seção "Risco crítico") continua o mesmo de antes — essa reversão não foi motivada por esse risco e não o resolve nem o agrava; segue no radar como constatação em aberto, a confirmar apenas quando os primeiros anúncios forem de fato revisados pelo Google.

**Próximo passo, sem mudança de fundo em relação ao que já estava planejado:** rodar o Planejador de Palavras-chave dentro da conta real para confirmar volume/CPC dos termos de Tirzepatida (em vez dos institucionais) antes de finalizar e ativar a campanha.

**Próxima atualização:** quando o Planejador de Palavras-chave rodar e/ou a campanha Tirzepatida for de fato criada e ativada.

---

## 2026-08-06 — Planejador rodado com dado real; campanha montada com 3 grupos; anúncios bloqueados por verificação de identidade da conta

Sessão de montagem completa da campanha, via automação de navegador na conta real (Aurum Peptide, CID 242-701-4058, login `aurumpeptide@gmail.com` — confirmado antes de qualquer ação, havia contas de outros negócios no mesmo Chrome que **não** foram tocadas).

**Planejador de Palavras-chave — dado real, contradiz parte da hipótese do plano:**
- "tirzepatida comprar": 1mil-10mil buscas/mês, concorrência Alta, CPC R$0,75-R$3,57.
- "tirzepatida onde comprar": 1mil-10mil, Alta, R$0,90-R$4,24.
- "onde encontrar tirzepatida": 100-1mil, Média, R$0,69-R$3,60.
- "comprar tirzepatida original": sem dado (volume não mensurável).
- **"ghk-cu comprar": 1mil-10mil(!), concorrência Alta, R$0,18-R$1,40** — contradiz a hipótese do plano de que GHK-Cu tinha baixo volume e devia ficar de fora do lançamento.
- **"retatrutida comprar": 100-1mil, Média, R$1,18-R$7,06** — também maior que o esperado.
- "aurum peptide": 10-100, Baixa. "biotecnologia longevidade"/"peptídeos premium importados": sem dado (confirma a decisão de reversão anterior — termos institucionais realmente não têm volume mensurável).
- Previsão da ferramenta (todas as 9 keywords testadas juntas, Brasil inteiro, R$400/mês, estratégia "Maximizar conversões"): **~303 cliques/mês, ~8 conversões/mês, CPC médio R$1,32, taxa de conversão estimada 2,53%** — mais otimista que a estimativa manual anterior ("dezenas", tom mais pessimista).

**Decisão do usuário durante a montagem:** incluir Retatrutida e GHK-Cu como grupos de anúncios separados (cada linha com seu próprio anúncio/landing page), não descartar mais. Motivo: o dado real de volume acima. Marketing Manager escreveu copy nova para os dois grupos (RSA completo, 15 headlines + 4 descriptions cada), registrada em `docs/marketing/conteudo.md`.

**Campanha "Tirzepatida - Pesquisa" criada e configurada:**
- Orçamento R$13,33/dia, estratégia "Maximizar os cliques" com teto de CPC R$2,50 (equivalente funcional ao CPC manual planejado — a UI atual do Google Ads não oferece CPC manual puro como opção direta para campanhas novas de Pesquisa, usei a alternativa que o próprio plano já previa como aceitável).
- Localizações: São Paulo, Rio de Janeiro, Minas Gerais, Paraná, Santa Catarina, Rio Grande do Sul, Distrito Federal (7 estados, substituindo "Brasil" — conforme decisão já registrada).
- Idioma: Português (substituindo "Todos os idiomas").
- Palavras-chave de correspondência ampla desativada por padrão da conta (bom, já alinhado ao plano); Anúncios de pesquisa dinâmicos com campo Website vazio — inertes, não precisei desativar nada.
- **3 grupos de anúncios criados, todos com keywords em correspondência de frase (aspas):**
  - **Tirzepatida**: "tirzepatida comprar", "tirzepatida onde comprar", "onde encontrar tirzepatida", "comprar tirzepatida original".
  - **Retatrutida**: "retatrutida comprar", "retatrutida onde comprar", "retatrutida original". Landing: `/produtos?categoria=retatrutida`.
  - **GHK-Cu**: "ghk-cu comprar", "peptídeo para pele comprar", "peptídeo regenerador de pele". Landing: `/produtos?categoria=ghk-cu`.
- **11 palavras-chave negativas** aplicadas em nível de campanha (afeta os 3 grupos automaticamente): grátis, download, pdf, curso, bula, manipulado barato, manipulação caseira, receita caseira, emprego, vaga, estudo científico.
- **Campanha mantida em "Em pausa" o tempo todo** — pausei manualmente logo após a criação (ela nasce "Ativada" por padrão do assistente) antes de qualquer outra configuração, para eliminar risco de veiculação/gasto sem revisão.

**Bloqueio encontrado — não resolvido, precisa do usuário:** a conta pede "Confirme a sua identidade" (verificação de conta, prazo até 20/08/2026) toda vez que se tenta salvar um anúncio de pesquisa responsivo. Testado em 2 grupos (Retatrutida direto no assistente, GHK-Cu e Retatrutida de novo via aba "Anúncios" do grupo) — o menu "+Criar anúncio" nessa conta hoje só oferece "Anúncio dinâmico de pesquisa" e "Variação do anúncio", não a opção padrão de Anúncio de Pesquisa Responsivo, consistente com uma conta ainda não verificada. Não tentei concluir essa verificação — é ação de segurança da conta Google, cabe ao usuário. **Nenhum anúncio foi criado em nenhum dos 3 grupos** — grupos e palavras-chave estão salvos e prontos, só falta a peça de anúncio.

**Copy pronta para colar assim que a verificação for feita** (headlines + descriptions dos 3 grupos, já revisada contra `docs/tom-de-voz.md`/`docs/valores.md`): grupo Tirzepatida em `docs/marketing/conteudo.md` (entrada 2026-08-05), grupos Retatrutida e GHK-Cu na entrada 2026-08-06 do mesmo arquivo.

**Status real da conta neste momento:** campanha "Tirzepatida - Pesquisa" existe, pausada, com 3 grupos de anúncios configurados (keywords + segmentação + orçamento + lances), 11 negativas de campanha, zero anúncios criados, zero gasto, zero risco de veiculação acidental.

**Próximo passo, na ordem:** (1) usuário completa a verificação de identidade da conta no Google Ads; (2) usuário (ou eu, se pedido de novo) cria os 3 anúncios com a copy já pronta; (3) usuário revisa a campanha inteira; (4) usuário ativa manualmente quando estiver satisfeito — não vou ativar a campanha sozinho em nenhuma circunstância, combinado desde o início desta sessão.
