# Memória — Instagram Orgânico (@aurumpeptide)

Estado consolidado do conhecimento sobre desempenho de conteúdo orgânico no Instagram, mantido pelo Analytics Manager. Diferente de `docs/analytics/relatorios.md` (log cronológico), este arquivo é a **leitura mais atual**, atualizada a cada novo post real — não um histórico de coleta.

**Criado em:** 17/08/2026, na primeira coleta real via Meta Graph API (`GET /{ig-user-id}/media`), pedido do Strategic Manager para ancorar o próximo briefing de produto em dado real.

**Última atualização:** 31/08/2026 — desempenho do KLOW 80mg (primeiro post de produto real do ecossistema ao vivo e mensurável) e dado real de Facebook (zero engajamento em 3 de 3 posts do ecossistema).

**Por que este arquivo é por "canal/era" e não por produto ainda:** a metodologia de memória (`.claude/agents/analytics-manager.md`) é organizada por produto/linha/campanha. Hoje ainda não há volume suficiente por produto específico do ecossistema (só 2 posts educacionais reais, 0 posts de produto reais) para justificar arquivos separados por produto — quando houver mais de ~5 posts reais por produto/tema específico do ecossistema, este arquivo deve ser desmembrado em arquivos por produto (ex.: `docs/analytics/memoria/tg-60mg.md`), seguindo o padrão do exemplo "Glow" da definição do agente.

---

## Estado atual: contagem de posts analisados

- **Posts totais no feed real (@aurumpeptide):** 16 (via `GET /{ig-user-id}?fields=media_count`, 31/08/2026; era 15 em 17/08/2026).
- **Posts do ecossistema (produzidos pelos agentes deste projeto) confirmados ao vivo e mensuráveis no Instagram:** **3** — 2 educacionais (sem CTA de compra) + **1 de produto (KLOW 80mg, 25/08/2026, primeiro do ecossistema com dado real de desempenho)**.
- **Posts do ecossistema produzidos mas NÃO ao vivo no Instagram:**
  - TG 60mg (28/07/2026, publicado de fato em 18/08/2026) — produto, CTA de compra — publicado e **apagado no mesmo dia pelo dono** (motivo de conteúdo, não de performance). Sem dado de desempenho recuperável no Instagram. **Confirmado em 31/08/2026: segue ao vivo na Página do Facebook** (post ID `1186905547834934_122125795449356392`, zero curtidas/comentários/reações) — o usuário removeu apenas do Instagram, não do Facebook. Achado operacional repassado ao Publishing Manager/CMO, não resolvido por este agente.
  - Semax vs. Selank, versão original (14/08/2026, media ID `17896208916570217`) — educacional — publicado e depois **apagado em 16/08/2026** por decisão do dono (motivo de conteúdo, não de performance). Não há dado de desempenho recuperável.
- **Posts legados (pré-ecossistema, fora do padrão visual/tom de voz atual):** 13, de 31/03/2026 a 29/07/2026 — usados só como contexto de era, não como benchmark direto.
- **Seguidores da conta:** 965 (17/08/2026) → **991 (31/08/2026)** — primeiro dado real de crescimento do canal: **+26 seguidores, +2,7% em 14 dias.**

## O que já sabemos (com ressalvas explícitas de amostra)

### Melhores horários de postagem

**Não disponível como padrão confiável.** Com 3 posts reais do ecossistema (12/08 às 15:17 UTC/~12:17 BRT, 17/08 às 18:53 UTC/~15:53 BRT, e **25/08 às 16:01 UTC/~13:01 BRT**), a amostra ainda é pequena demais para apontar horário ótimo — os três foram publicados em horários diferentes (não por teste deliberado, mas porque nenhum critério de horário existia no momento da publicação, ver `docs/publicacao/log.md`). Os posts legados variam de 12:32 a 17:43 UTC, sem padrão claro extraído ainda desta leitura. Fica pendente até haver volume maior.

### Melhores copies (ranqueadas)

**Não disponível como ranking confiável.** Os 3 posts do ecossistema têm 5, 4 e 4 curtidas respectivamente (12/08, 17/08, 25/08 — medidos em momentos de maturação diferentes, ver tabela de comparação abaixo) — insuficiente para ranquear copy com confiança. Observação preliminar, não ranking: os 2 posts educacionais fecham com pergunta aberta nos comentários como CTA (e nenhum dos dois gerou comentário até hoje); o post de produto (KLOW 80mg) é o primeiro a fechar com CTA direto para WhatsApp/Grupo VIP em vez de pergunta — mesmo padrão de curtidas, zero comentários também.

### Melhor CTA identificado

**Não disponível como conclusão — primeiro dado real de CTA de produto chegou em 25/08/2026.** O KLOW 80mg é o primeiro post de produto do ecossistema com dado real mensurável (TG 60mg nunca gerou dado, removido do Instagram no mesmo dia da publicação). CTA usado: "Dúvidas sobre o KLOW? Fale com a gente pelo WhatsApp (link na bio) ou no Grupo VIP." Curtidas (4) e comentários (0) ficaram no mesmo patamar dos 2 posts educacionais com CTA de comentário — não há, com n=1, base para dizer se esse CTA converte melhor ou pior. **Não medido:** cliques reais para o WhatsApp/Grupo VIP (insights de perfil/link bloqueados, ver limitações) — é a métrica que de fato responderia "qual CTA funciona melhor" para o objetivo de negócio (`docs/objetivos.md`), e segue indisponível.

### Melhor campanha até o momento, e por quê

**Não disponível.** Não há ainda campanha (conjunto de posts com objetivo comum) do ecossistema com volume suficiente para eleger uma "melhor". Dado real acumulado até 31/08/2026, 3 posts vivos no Instagram:

| Data | Post | Curtidas | Comentários | Tempo no ar na medição |
|---|---|---|---|---|
| 12/08 | Educacional "Evidência não é igual para todos" | 5 | 0 | ~19 dias (medido 31/08) |
| 17/08 | Educacional Semax vs. Selank (republicado) | 4 | 0 | ~14 dias (medido 31/08) |
| 25/08 | **Produto KLOW 80mg** | 4 | 0 | ~6 dias (medido 31/08) |

Diferenças de tempo de exposição entre as medições impedem eleger "melhor" com confiança — os 3 estão em patamar muito próximo entre si.

## Comparação de era — legado (pré-ecossistema) vs. ecossistema (atualizado 31/08/2026)

| | Posts | Engajamento médio (curtidas+comentários ÷ seguidores atuais, 991) | Ressalva |
|---|---|---|---|
| Legado (31/03–29/07/2026) | 13 | ≈1,15% (recalculado com base 991; era ≈1,18% com base 965 em 17/08) | Base de seguidores de hoje aplicada a posts antigos — provavelmente **subestima** o engajamento real da época (conta tinha menos seguidores então). Tom/formato não seguem `docs/identidade-visual.md` nem `docs/tom-de-voz.md` atuais — não usar como referência de execução, só de tema. |
| Ecossistema (12/08, 17/08 e 25/08/2026) | 3 | ≈0,43% ((0,50% + 0,40% + 0,40%) ÷ 3) | Amostra ainda pequena (n=3); tempos de exposição diferentes na medição (19, 14 e 6 dias). Sem dado de alcance/salvamentos/compartilhamentos (insights bloqueados por permissão, `code 10`, sem resolução desde 17/08). |

**Leitura, não conclusão:** os 3 posts do ecossistema, até aqui, seguem abaixo da média legada em engajamento por seguidor — mas a amostra é pequena demais e desbalanceada em tempo de exposição para tratar isso como um padrão real do novo formato. O primeiro post de produto do ecossistema (KLOW 80mg) não destoou dos 2 educacionais anteriores (0,40% vs. 0,40%/0,50%) — não há, ainda, sinal de que produto performe pior que educacional em curtidas/comentários. Precisa de mais posts reais do ecossistema (e, idealmente, acesso a insights de alcance) para virar leitura confiável.

**Tema com maior engajamento absoluto observado no feed inteiro (qualquer era):** GHK-Cu (post legado, 08/04/2026) — 12 curtidas e **17 comentários**, muito acima de qualquer outro post da amostra (segundo maior: 4 comentários). Registrado como ponto fora da curva a observar, não como padrão comprovado — causa não investigada (conteúdo dos comentários não coletado nesta chamada).

**Facebook (Página) — dado real, 3 de 3 posts do ecossistema com zero engajamento (adicionado 31/08/2026):** KLOW 80mg (25/08), TG 60mg (18/08, ainda ao vivo no Facebook mesmo removido do Instagram) e Semax vs. Selank republicado (17/08) têm, todos, 0 curtidas, 0 comentários, 0 reações, 0 compartilhamentos na Página. Diferente do Instagram (que ao menos registra curtidas reais), o Facebook não mostra nenhum engajamento mensurável em nenhum post do ecossistema até hoje — padrão consistente (não amostra pequena isolada), sinalizado ao Strategic Manager em `docs/analytics/relatorios.md` (entrada 31/08/2026).

## Limitações ativas nesta leitura (persistem até serem resolvidas)

- **Insights por post (alcance, impressões, salvamentos, compartilhamentos, cliques) seguem bloqueados** — `GET /{media-id}/insights` retorna `(#10) Application does not have permission for this action`, confirmado novamente em 31/08/2026 (mesmo erro de 17/08, sem resolução em duas coletas). Sem isso, todo engajamento calculado aqui usa curtidas+comentários sobre seguidores, não sobre alcance — mais fraco que o padrão de fórmula deste agente.
- **Histórico de seguidores agora com 2 pontos** (965 em 17/08, 991 em 31/08) — primeiro dado real de crescimento do canal (+2,7% em 14 dias), mas ainda insuficiente para tendência (só 2 pontos). O snapshot mais recente (991) é usado retroativamente para todos os 16 posts na tabela de comparação de era, o que segue distorcendo a comparação entre eras (mesma ressalva de 17/08).
- **TG 60mg permanece sem dado real de desempenho no Instagram** (removido no mesmo dia da publicação) — mas agora sabemos que segue ao vivo, com zero engajamento, na Página do Facebook.
- **Cliques para o Grupo de WhatsApp/VIP não são medidos por este pull** — não há campo de clique em link/bio nesta chamada de `media`; isso já era relevante em 17/08 e passa a ser crítico agora que existe um post de produto real (KLOW 80mg) com CTA para medir. Precisa ser mapeado (provavelmente via insights de perfil, também bloqueados hoje).

## Próxima atualização

Este arquivo deve ser atualizado a cada novo post real do ecossistema (ou quando os insights forem desbloqueados) — reordenando rankings, atualizando médias e, quando o volume por produto justificar, desmembrando em arquivos por produto/campanha. Com o KLOW 80mg como primeiro post de produto real medido, o próximo post de produto (se houver) já permite começar a comparar formato produto vs. educacional com n=2 de cada lado.
