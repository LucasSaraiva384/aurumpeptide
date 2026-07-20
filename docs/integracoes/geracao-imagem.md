# Integração — Geração de Imagem (ChatGPT, Gemini, Midjourney)

## O que isso conecta

O **Designer Manager** é o único agente que usa isso — execução visual das peças briefadas pelo Marketing Manager (ver `.claude/agents/designer-manager.md`).

Três ferramentas, duas abordagens diferentes:

- **ChatGPT (gpt-image) e Gemini (Imagen)** — via **API oficial**, chamada direta por script. Mais confiável: não depende de sessão logada, não quebra quando a interface web muda.
- **Midjourney** — não tem API oficial pública. Só funciona via bot do Discord. Por isso usa **Playwright MCP** (automação de navegador de verdade) para operar o Discord web.

## ChatGPT e Gemini — via API

`scripts/openai_image.py` e `scripts/gemini_image.py` são clientes mínimos (só biblioteca padrão do Python) que recebem um prompt e salvam a imagem gerada em disco.

```
python scripts/openai_image.py "<prompt completo com estilo/cores/proibições>" --out caminho/saida.png
python scripts/gemini_image.py "<prompt completo com estilo/cores/proibições>" --out caminho/saida.png
```

### Setup

1. **OpenAI**: gerar uma chave em [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Requer conta com billing ativo (a API de imagem é paga por uso).
2. **Google/Gemini**: gerar uma chave em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
3. Preencher `OPENAI_API_KEY` e `GEMINI_API_KEY` no `.env` local (copiar de `.env.example`).
4. **Nunca colar a chave na conversa/prompt/documento** — só no `.env`, que já está no `.gitignore`.

Os nomes dos modelos (`OPENAI_IMAGE_MODEL`, `GEMINI_IMAGE_MODEL` no `.env`) mudam com alguma frequência nas duas plataformas — os defaults nos scripts podem ficar desatualizados; confira a documentação oficial se uma chamada começar a falhar por modelo inválido.

## Midjourney — via Playwright MCP (Discord)

Configurado em `.mcp.json` na raiz do projeto (`npx @playwright/mcp@latest`) — depois de adicionado, é necessário **reiniciar a sessão do Claude Code** para as ferramentas do Playwright ficarem disponíveis.

Fluxo pretendido: o Designer Manager usa o Playwright para abrir o Discord web, navegar até o canal/DM do bot do Midjourney, enviar `/imagine <prompt>` e depois baixar a(s) imagem(ns) geradas quando prontas.

**Pendências reais desse fluxo, ainda não resolvidas:**

- Login no Discord dentro do navegador automatizado — sessão persistente ainda não configurada; hoje o Playwright abre um navegador "limpo" a cada vez, então o primeiro uso provavelmente vai exigir logar manualmente (ou configurar um perfil de navegador persistente).
- Confirmar se a conta usada tem assinatura ativa do Midjourney e acesso ao servidor/bot correto.
- Os nomes exatos das ferramentas expostas pelo servidor MCP do Playwright (`browser_navigate`, `browser_click`, etc.) precisam ser conferidos na primeira execução real e adicionados ao campo `tools` de `.claude/agents/designer-manager.md` — a lista pode variar por versão do `@playwright/mcp`.

Essas pendências devem ser resolvidas na prática, na primeira vez que uma peça via Midjourney for realmente tentada — não vale a pena especular a solução sem testar.

## Segurança

- `.env` nunca é commitado (já está no `.gitignore`).
- Chaves de API nunca devem ser coladas em `docs/`, `.claude/agents/`, prompts ou qualquer arquivo versionado.
- Se uma chave vazar, revogue imediatamente no painel da OpenAI/Google e gere uma nova.

## Status

- [x] Playwright MCP configurado em `.mcp.json` — falta reiniciar a sessão para confirmar que carregou.
- [ ] `OPENAI_API_KEY` preenchida no `.env`.
- [ ] `GEMINI_API_KEY` preenchida no `.env`.
- [ ] Primeiro teste real de geração via ChatGPT/Gemini.
- [ ] Fluxo do Midjourney via Discord testado e documentado (login, canal, tempo de espera).
