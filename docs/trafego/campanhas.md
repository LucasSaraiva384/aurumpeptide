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
