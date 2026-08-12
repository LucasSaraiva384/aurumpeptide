#!/usr/bin/env python3
"""
CLI mínimo para gerar um documento via Gamma API (public-api.gamma.app v1.0).

Uso:
    python scripts/gamma_generate.py <arquivo-de-entrada.txt> --out caminho/saida.pdf
    python scripts/gamma_generate.py <arquivo-de-entrada.txt> --out caminho/saida.pdf --num-cards 6

Defaults pensados para não deixar a Gamma inventar conteúdo além do input
(testado na prática — textMode=preserve sozinho NÃO impede isso, ver
DEFAULT_ADDITIONAL_INSTRUCTIONS abaixo): textMode=preserve, format=document,
cardSplit=inputTextBreaks (respeita as quebras do seu texto em vez da IA
decidir a divisão), imageOptions.source=noImages (sem fotos fabricadas) e
uma additionalInstructions padrão proibindo seções/imagens/alegações extras.
Estruture o arquivo de entrada com uma quebra de linha em branco clara entre
cada seção pretendida, e passe --num-cards com o número exato de seções.

Credencial lida de GAMMA_API_KEY (variável de ambiente / .env na raiz do repo),
nunca de argumento de linha de comando.

Nota: confirme os detalhes da API (endpoint, parâmetros, tiers de plano) em
https://developers.gamma.app antes de mudar este script — a API pode evoluir.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE_URL = "https://public-api.gamma.app/v1.0"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLL_INTERVAL_SECONDS = 5
POLL_TIMEOUT_SECONDS = 300

# textMode=preserve só afeta a redação do texto já existente — NÃO impede a
# Gamma de inventar seções, alegações ou imagens novas. Testado na prática
# (2026-08-11): um input de 5 frases virou um documento de 10 páginas com
# seções fabricadas ("Brand Pillars", "Next Steps" etc.) e uma foto de
# produto falsa. Esta instrução + imageOptions.source=noImages é o que
# efetivamente restringe isso — não existe parâmetro dedicado "anti-invenção"
# na API, então isso é reforçado via prompt mesmo.
DEFAULT_ADDITIONAL_INSTRUCTIONS = (
    "Use EXCLUSIVAMENTE o conteúdo fornecido abaixo em inputText. "
    "NÃO adicione, invente, expanda ou infira nenhuma seção, alegação, "
    "estatística, exemplo, posicionamento de marca, chamada para ação ou "
    "qualquer outro conteúdo que não esteja explicitamente presente no "
    "texto fornecido. NÃO crie seções de fechamento, resumo, próximos "
    "passos ou call-to-action que não existam no input. Se o input tiver "
    "N seções/blocos, o resultado deve ter exatamente N cards — nunca mais. "
    "REGRA DE IDIOMA OBRIGATÓRIA: todo o texto do documento, incluindo "
    "títulos, rótulos de gráficos/infográficos/linhas do tempo/badges e "
    "qualquer elemento visual gerado, DEVE permanecer no mesmo idioma do "
    "input (português brasileiro). NÃO traduza nada para inglês."
)

# Variante para public-facing (leitor leigo, não técnico): mesma regra de
# não inventar fatos, mas autoriza reformatar visualmente os dados JÁ
# presentes (tabelas markdown do input viram tabelas reais, listas viram
# comparativos/stat callouts, ícones). A diferença chave vs. o default:
# aqui a IA PODE reorganizar/redesenhar a apresentação dos mesmos fatos —
# só não pode adicionar fatos novos.
# Testado na prática (2026-08-11): mesmo com input 100% em português, um
# volume saiu inteiramente traduzido para inglês, e outro teve rótulos de
# um componente visual (timeline) vazando em inglês em meio ao resto do
# texto em português. textMode=preserve NÃO garante o idioma — por isso a
# regra de idioma abaixo é explícita e obrigatória em ambos os prompts.
VISUAL_ADDITIONAL_INSTRUCTIONS = (
    "Use EXCLUSIVAMENTE os fatos, números, citações (PMID/DOI/NCT) e dados "
    "fornecidos abaixo em inputText. NÃO invente, adicione ou infira "
    "nenhum fato, estatística, alegação, estudo, exemplo ou seção que não "
    "esteja explicitamente presente no texto fornecido — isso é uma regra "
    "absoluta. Dentro dessa restrição, você TEM liberdade para reformatar "
    "visualmente os dados já presentes: transforme tabelas markdown em "
    "tabelas reais renderizadas, use comparativos visuais, cards de "
    "estatística, ícones e badges de status para tornar a informação mais "
    "fácil de entender para um leitor leigo (não técnico/não médico) — "
    "desde que cada elemento visual represente um dado que já está no "
    "texto fornecido, nunca um dado novo. Priorize clareza visual e "
    "escaneabilidade sobre densidade de texto corrido. "
    "REGRA DE IDIOMA OBRIGATÓRIA: todo o texto do documento, incluindo "
    "títulos, rótulos de gráficos/infográficos/linhas do tempo/badges e "
    "qualquer elemento visual gerado, DEVE permanecer no mesmo idioma do "
    "input (português brasileiro). NÃO traduza nada para inglês, nem "
    "mesmo rótulos de componentes visuais como timelines ou stat cards. "
    "PROIBIÇÃO ESPECÍFICA: NÃO crie tabelas comparativas que sintetizem "
    "múltiplos itens lado a lado por atributos (ex.: 'meia-vida', 'tipo', "
    "'evidência em adultos') a menos que cada valor de cada célula "
    "individual esteja EXPLICITAMENTE escrito no texto de origem para "
    "aquele item específico — já ocorreu um caso real de uma tabela "
    "comparativa preencher uma célula com um valor que não estava no "
    "texto original; isso é fabricação e é proibido. Se um atributo não "
    "for mencionado no texto para um dos itens, não crie a linha/coluna "
    "comparativa para esse atributo. NÃO use rótulos do tipo 'Card X de "
    "Y' ou numeração de card/página no topo de cada seção — se dois "
    "itens forem exibidos na mesma página isso é aceitável, mas não "
    "numere cards de forma que fique inconsistente com a contagem real; "
    "o mais simples é não incluir esse tipo de rótulo numérico."
)


def load_dotenv(path):
    if not os.path.isfile(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def request(method, path, api_key, payload=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "X-API-KEY": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            # Cloudflare bloqueia o User-Agent default do urllib (Python-urllib/x.y)
            # com 403 "error code: 1010" — precisa de um UA de navegador real.
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            ),
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Erro HTTP {e.code} da API da Gamma:", file=sys.stderr)
        print(e.read().decode("utf-8"), file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Gera um documento via Gamma API")
    parser.add_argument("input", help="Caminho de um arquivo de texto com o conteúdo de entrada")
    parser.add_argument("--out", required=True, help="Caminho do arquivo de saída (extensão conforme --export-as)")
    parser.add_argument("--format", default="document", choices=["presentation", "document", "webpage", "social"])
    parser.add_argument("--text-mode", default="preserve", choices=["generate", "condense", "preserve"])
    parser.add_argument("--export-as", default="pdf", choices=["pdf", "pptx", "png"])
    parser.add_argument("--title", default=None)
    parser.add_argument(
        "--theme-id",
        default=None,
        help="ID de um tema da Gamma (GET /themes). Se omitido, usa GAMMA_THEME_ID do .env quando definido (tema de marca 'Aurum Peptide').",
    )
    parser.add_argument(
        "--no-theme",
        action="store_true",
        help="Não aplica nenhum themeId, mesmo que GAMMA_THEME_ID esteja definido no .env.",
    )
    parser.add_argument(
        "--card-split",
        default="inputTextBreaks",
        choices=["auto", "inputTextBreaks"],
        help="inputTextBreaks (default) respeita as quebras do seu texto em vez de deixar a IA decidir a divisão dos cards.",
    )
    parser.add_argument("--num-cards", type=int, default=None, help="Trava o número de cards/seções no valor exato.")
    parser.add_argument(
        "--allow-images",
        action="store_true",
        help="Por padrão NÃO gera imagens (imageOptions.source=noImages), para evitar fotos de produto fabricadas. Use esta flag para permitir imagens geradas por IA.",
    )
    parser.add_argument(
        "--additional-instructions",
        default=None,
        help="Sobrescreve a instrução padrão. Se omitido, usa DEFAULT_ADDITIONAL_INSTRUCTIONS (ou VISUAL_ADDITIONAL_INSTRUCTIONS com --visual).",
    )
    parser.add_argument(
        "--visual",
        action="store_true",
        help="Modo público leigo: format=presentation e instruções que autorizam reformatar os dados do input em tabelas/comparativos/stat cards (sem inventar fatos novos). Use para conteúdo destinado ao usuário final, não a um leitor técnico.",
    )
    args = parser.parse_args()
    load_dotenv(os.path.join(REPO_ROOT, ".env"))

    if args.additional_instructions is None:
        args.additional_instructions = VISUAL_ADDITIONAL_INSTRUCTIONS if args.visual else DEFAULT_ADDITIONAL_INSTRUCTIONS
    if args.visual and args.format == "document":
        args.format = "presentation"
    if args.theme_id is None and not args.no_theme:
        args.theme_id = os.environ.get("GAMMA_THEME_ID") or None

    api_key = os.environ.get("GAMMA_API_KEY")
    if not api_key:
        print("Erro: GAMMA_API_KEY não encontrada. Preencha o .env (ver .env.example).", file=sys.stderr)
        sys.exit(1)

    if not os.path.isfile(args.input):
        print(f"Erro: arquivo de entrada não encontrado: {args.input}", file=sys.stderr)
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        input_text = f.read()

    payload = {
        "inputText": input_text,
        "textMode": args.text_mode,
        "format": args.format,
        "exportAs": args.export_as,
        "cardSplit": args.card_split,
        "additionalInstructions": args.additional_instructions,
        "imageOptions": {"source": "aiGenerated" if args.allow_images else "noImages"},
    }
    if args.title:
        payload["title"] = args.title
    if args.num_cards:
        payload["numCards"] = args.num_cards
    if args.theme_id:
        payload["themeId"] = args.theme_id

    created = request("POST", "/generations", api_key, payload)
    generation_id = created.get("generationId")
    if not generation_id:
        print("Resposta sem generationId:", file=sys.stderr)
        print(json.dumps(created, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    print(f"Geração iniciada: {generation_id}")

    deadline = time.time() + POLL_TIMEOUT_SECONDS
    result = None
    while time.time() < deadline:
        result = request("GET", f"/generations/{generation_id}", api_key)
        status = result.get("status")
        if status == "completed":
            break
        if status == "failed":
            print("Geração falhou:", file=sys.stderr)
            print(json.dumps(result, indent=2, ensure_ascii=False), file=sys.stderr)
            sys.exit(1)
        print(f"Status: {status} — aguardando {POLL_INTERVAL_SECONDS}s...")
        time.sleep(POLL_INTERVAL_SECONDS)
    else:
        print(f"Timeout de {POLL_TIMEOUT_SECONDS}s esperando a geração terminar.", file=sys.stderr)
        sys.exit(1)

    print(f"Gamma URL: {result.get('gammaUrl')}")
    credits = result.get("credits", {})
    print(f"Créditos usados: {credits.get('deducted')} | restantes: {credits.get('remaining')}")

    export_url = result.get("exportUrl")
    if not export_url:
        print("Resposta sem exportUrl — pode ser necessário exportar manualmente pelo gammaUrl acima.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    export_req = urllib.request.Request(
        export_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            ),
        },
    )
    with urllib.request.urlopen(export_req) as resp:
        with open(args.out, "wb") as f:
            f.write(resp.read())

    print(f"Arquivo salvo em {args.out}")


if __name__ == "__main__":
    main()
