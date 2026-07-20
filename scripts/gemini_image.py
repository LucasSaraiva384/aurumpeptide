#!/usr/bin/env python3
"""
CLI mínimo para gerar imagem via API oficial do Google (Gemini/Imagen).

Uso:
    python scripts/gemini_image.py "<prompt>" --out caminho/saida.png

Credencial lida de GEMINI_API_KEY (variável de ambiente / .env na raiz do repo),
nunca de argumento de linha de comando.

Nota: o nome do modelo de geração de imagem muda com frequência. Confirme o
modelo atual em https://ai.google.dev/gemini-api/docs/image-generation antes
de usar o default abaixo — ele pode estar desatualizado.
"""

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request

DEFAULT_MODEL = "gemini-3.1-flash-image"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


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


def main():
    parser = argparse.ArgumentParser(description="Gera imagem via API do Gemini/Imagen (Google)")
    parser.add_argument("prompt")
    parser.add_argument("--out", required=True, help="Caminho do arquivo de saída (.png)")
    parser.add_argument("--model", default=None)
    args = parser.parse_args()

    load_dotenv(os.path.join(REPO_ROOT, ".env"))

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Erro: GEMINI_API_KEY não encontrada. Preencha o .env (ver .env.example).", file=sys.stderr)
        sys.exit(1)

    model = args.model or os.environ.get("GEMINI_IMAGE_MODEL", DEFAULT_MODEL)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": args.prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }).encode("utf-8")

    req = urllib.request.Request(
        url, data=payload, method="POST", headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Erro HTTP {e.code} da API do Gemini:", file=sys.stderr)
        print(e.read().decode("utf-8"), file=sys.stderr)
        sys.exit(1)

    try:
        parts = body["candidates"][0]["content"]["parts"]
        b64 = next(p["inlineData"]["data"] for p in parts if "inlineData" in p)
    except (KeyError, IndexError, StopIteration):
        print("Resposta sem imagem inline — verifique o modelo/formato da resposta:", file=sys.stderr)
        print(json.dumps(body, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    with open(args.out, "wb") as f:
        f.write(base64.b64decode(b64))

    print(f"Imagem salva em {args.out}")


if __name__ == "__main__":
    main()
