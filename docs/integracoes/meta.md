# Integração — Meta Graph API (Business Manager)

## O que isso conecta

Uma única integração no Business Manager da Meta cobre três agentes ao mesmo tempo:

- **Traffic Manager** — ler/gerenciar campanhas e insights de Meta Ads via Marketing API.
- **Publishing Manager** — publicar posts/stories/carrosséis no Instagram via Instagram Graph API.
- **Analytics Manager** — ler métricas reais de Instagram e de campanhas, em vez de depender de dados fornecidos manualmente.

## Como funciona

`scripts/meta_graph.py` é um cliente mínimo (sem dependências externas, só biblioteca padrão do Python) para a Graph API. Lê credenciais de variáveis de ambiente (arquivo `.env` na raiz, nunca commitado — ver `.env.example`) e expõe dois comandos:

```
python scripts/meta_graph.py get  /<endpoint> [--param chave=valor ...]
python scripts/meta_graph.py post /<endpoint> [--param chave=valor ...]
```

Os agentes `traffic-manager`, `publishing-manager` e `analytics-manager` têm a ferramenta `Bash` para chamar esse script diretamente. Eles não recebem o token em nenhum momento — ele fica só no `.env` local, lido pelo script.

## Autenticação escolhida: System User do Business Manager

Em vez do fluxo de OAuth via login de usuário (token expira em ~60 dias e depende de um humano re-autenticar), usamos um **System User** do Business Manager, que gera um token de longa duração (pode ser configurado para não expirar) e não depende da conta pessoal de ninguém.

### Passo a passo (feito uma vez, no navegador)

Pré-requisitos já existentes: Business Manager criado, Página do Facebook + Instagram Business vinculado.

1. **Criar o App**
   - Acesse [developers.facebook.com/apps](https://developers.facebook.com/apps) → "Criar app" → tipo **Negócios**.
   - Associe o app ao Business Manager da Aurum Peptide.
   - Em "Adicionar produtos", adicione **Marketing API** e **Instagram Graph API**.

2. **Criar o System User**
   - No [Business Manager](https://business.facebook.com) → Configurações do Business → Usuários → **Usuários do sistema**.
   - Criar novo, nome sugerido: `aurum-agentes`. Papel: Admin (ou Funcionário, se preferir escopo mais restrito — ver observação abaixo).

3. **Atribuir ativos ao System User**
   - No mesmo usuário do sistema, "Adicionar ativos": selecione a **Página do Facebook**, a **conta do Instagram** e a **conta de anúncios**, com controle total (ou "Gerenciar" no mínimo).

4. **Gerar o token**
   - No System User → "Gerar novo token" → selecione o App criado no passo 1.
   - Marque os escopos: `ads_management`, `ads_read`, `business_management`, `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `instagram_manage_comments`, `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `pages_manage_metadata`.
   - Copie o token gerado — **ele só é exibido uma vez**.

5. **Coletar os IDs**
   - **Ad Account ID**: Ads Manager → Configurações da conta (é o número após `act_`).
   - **Page ID**: Configurações da Página → Sobre, ou Business Settings → Contas → Páginas.
   - **Instagram Business Account ID**: não aparece direto na interface — obtenha via chamada de teste (passo 6).
   - **Business ID**: Configurações do Business → Informações do negócio.

6. **Preencher o `.env` e testar**
   - Copie `.env.example` para `.env` na raiz do projeto e preencha `META_ACCESS_TOKEN`, `META_PAGE_ID`, `META_AD_ACCOUNT_ID`, `META_BUSINESS_ID`.
   - Rode: `python scripts/meta_graph.py get /{page-id} --param fields=instagram_business_account` — o retorno traz o `META_IG_BUSINESS_ACCOUNT_ID` para completar o `.env`.
   - Rode `python scripts/meta_graph.py get /me --param fields=id,name` para confirmar que o token funciona.

### Observação sobre escopo do System User

Um System User "Admin" tem acesso amplo ao Business Manager, não só aos três ativos acima. Se preferir um controle mais estrito, use papel "Funcionário" e atribua manualmente só os três ativos — funciona igual para os fins deste projeto, com superfície de risco menor caso o token vaze.

## Segurança

- **Nunca** commitar `.env`, nem colar o token em `docs/`, `.claude/agents/`, prompts ou qualquer arquivo versionado. `.env` já está no `.gitignore`.
- O token do System User não expira automaticamente — se for revogado ou rotacionado, gere um novo no mesmo lugar (Business Settings → Usuários do sistema) e atualize só o `.env` local.
- Se o token vazar, revogue imediatamente em Business Settings → Usuários do sistema → Gerar novo token (isso invalida o anterior).

## Status

- [x] App criado em developers.facebook.com
- [ ] System User criado e ativos atribuídos — **bloqueado**: conta do usuário está com uma restrição do Meta até 08/08/2026, impedindo continuar a configuração até lá.
- [ ] Token gerado e `.env` preenchido
- [ ] Conexão testada (`GET /me` retornando com sucesso)

Atualize os checkboxes conforme cada etapa for concluída.
