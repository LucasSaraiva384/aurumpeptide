# Memória — Instagram Orgânico (@aurumpeptide)

Estado consolidado do conhecimento sobre desempenho de conteúdo orgânico no Instagram, mantido pelo Analytics Manager. Diferente de `docs/analytics/relatorios.md` (log cronológico), este arquivo é a **leitura mais atual**, atualizada a cada novo post real — não um histórico de coleta.

**Criado em:** 17/08/2026, na primeira coleta real via Meta Graph API (`GET /{ig-user-id}/media`), pedido do Strategic Manager para ancorar o próximo briefing de produto em dado real.

**Por que este arquivo é por "canal/era" e não por produto ainda:** a metodologia de memória (`.claude/agents/analytics-manager.md`) é organizada por produto/linha/campanha. Hoje ainda não há volume suficiente por produto específico do ecossistema (só 2 posts educacionais reais, 0 posts de produto reais) para justificar arquivos separados por produto — quando houver mais de ~5 posts reais por produto/tema específico do ecossistema, este arquivo deve ser desmembrado em arquivos por produto (ex.: `docs/analytics/memoria/tg-60mg.md`), seguindo o padrão do exemplo "Glow" da definição do agente.

---

## Estado atual: contagem de posts analisados

- **Posts totais no feed real (@aurumpeptide):** 15 (via `GET /{ig-user-id}?fields=media_count`, 17/08/2026).
- **Posts do ecossistema (produzidos pelos agentes deste projeto) confirmados ao vivo e mensuráveis:** **2**, ambos educacionais, ambos sem CTA de compra.
- **Posts do ecossistema produzidos mas NÃO ao vivo:**
  - TG 60mg (28/07/2026) — produto, CTA de compra, ticket R$ 1.200 — **peça pronta, nunca publicada** (`docs/design/2026-07-28-tg60mg/final/`). Não conta como dado de desempenho.
  - Semax vs. Selank, versão original (14/08/2026, media ID `17896208916570217`) — educacional — publicado e depois **apagado em 16/08/2026** por decisão do dono (motivo de conteúdo, não de performance). Não há dado de desempenho recuperável.
- **Posts legados (pré-ecossistema, fora do padrão visual/tom de voz atual):** 13, de 31/03/2026 a 29/07/2026 — usados só como contexto de era, não como benchmark direto.
- **Seguidores da conta (snapshot):** 965 (17/08/2026) — primeiro ponto registrado, sem histórico anterior para calcular crescimento ainda.

## O que já sabemos (com ressalvas explícitas de amostra)

### Melhores horários de postagem

**Não disponível.** Com apenas 2 posts reais do ecossistema (12/08 às 15:17 UTC / ~12:17 BRT, e 17/08 às 18:53 UTC / ~15:53 BRT), não há base para apontar horário ótimo. Os posts legados variam de 12:32 a 17:43 UTC, sem padrão claro extraído ainda desta leitura. Fica pendente até haver volume maior.

### Melhores copies (ranqueadas)

**Não disponível como ranking confiável.** Os 2 posts do ecossistema têm 5 e 2 curtidas (o segundo com poucas horas de exposição na coleta) — insuficiente para ranquear copy. Registro aqui apenas como observação preliminar, não ranking: nenhum dos dois usa gatilho de urgência ou promessa de resultado (coerente com `docs/tom-de-voz.md`); ambos fecham com pergunta aberta nos comentários como CTA de engajamento.

### Melhor CTA identificado

**Não disponível.** Nenhum post de produto do ecossistema está ao vivo, logo não há CTA de compra/Grupo VIP real para medir. Os 2 posts educacionais usam CTA de engajamento ("conta pra gente nos comentários") — sem dado de conversão associado (cliques para o grupo/WhatsApp não são medidos por este pull; ver limitações abaixo).

### Melhor campanha até o momento, e por quê

**Não disponível.** Não há ainda campanha (conjunto de posts com objetivo comum) do ecossistema com volume suficiente para eleger uma "melhor". A leitura mais próxima disponível: dos 2 posts educacionais reais, o de 12/08 ("Evidência não é igual para todos") tem mais engajamento absoluto (5 curtidas vs. 2) — mas também teve ~5 dias a mais de exposição até a coleta, então essa diferença não pode ser atribuída à copy/tema com confiança.

## Comparação de era — legado (pré-ecossistema) vs. ecossistema (dado real, 17/08/2026)

| | Posts | Engajamento médio (curtidas+comentários ÷ seguidores atuais, 965) | Ressalva |
|---|---|---|---|
| Legado (31/03–29/07/2026) | 13 | ≈1,18% | Base de seguidores de hoje aplicada a posts antigos — provavelmente **subestima** o engajamento real da época (conta tinha menos seguidores então). Tom/formato não seguem `docs/identidade-visual.md` nem `docs/tom-de-voz.md` atuais — não usar como referência de execução, só de tema. |
| Ecossistema (12/08 e 17/08/2026) | 2 | ≈0,37% | Amostra muito pequena (n=2); um dos posts tinha poucas horas de exposição no momento da coleta. Sem dado de alcance/salvamentos/compartilhamentos (insights bloqueados por permissão, `code 10`). |

**Leitura, não conclusão:** os 2 posts do ecossistema, até aqui, não superam a média legada em engajamento por seguidor — mas a amostra é pequena demais e desbalanceada em tempo de exposição para tratar isso como um padrão real do novo formato. Precisa de mais posts reais do ecossistema (e, idealmente, acesso a insights de alcance) para virar leitura confiável.

**Tema com maior engajamento absoluto observado no feed inteiro (qualquer era):** GHK-Cu (post legado, 08/04/2026) — 12 curtidas e **17 comentários**, muito acima de qualquer outro post da amostra (segundo maior: 4 comentários). Registrado como ponto fora da curva a observar, não como padrão comprovado — causa não investigada (conteúdo dos comentários não coletado nesta chamada).

## Limitações ativas nesta leitura (persistem até serem resolvidas)

- **Insights por post (alcance, impressões, salvamentos, compartilhamentos, cliques) bloqueados** — `GET /{media-id}/insights` retorna `(#10) Application does not have permission for this action`. Sem isso, todo engajamento calculado aqui usa curtidas+comentários sobre seguidores, não sobre alcance — mais fraco que o padrão de fórmula deste agente.
- **Sem histórico de seguidores ao longo do tempo** — o snapshot de 965 seguidores (17/08/2026) é usado retroativamente para todos os 15 posts, o que distorce a comparação entre eras.
- **TG 60mg (produto, CTA de compra) nunca publicado** — zero dado real de conteúdo de produto do ecossistema. Prioridade para o próximo ciclo de publicação, se o objetivo é ter dado real de produto para decisões futuras.
- **Cliques para o Grupo de WhatsApp/VIP não são medidos por este pull** — não há campo de clique em link/bio nesta chamada de `media`; se isso for relevante para medir a eficácia do CTA nos próximos posts, precisa ser mapeado (provavelmente via insights de perfil, também bloqueados hoje).

## Próxima atualização

Este arquivo deve ser atualizado a cada novo post real do ecossistema (ou quando os insights forem desbloqueados) — reordenando rankings, atualizando médias e, quando o volume por produto justificar, desmembrando em arquivos por produto/campanha.
