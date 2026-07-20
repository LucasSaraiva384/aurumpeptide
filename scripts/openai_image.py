#!/usr/bin/env python3
"""
CLI mínimo para gerar imagem via API oficial da OpenAI.

Uso:
    python scripts/openai_image.py "<prompt>" --out caminho/saida.png [--size 1024x1024]

Credencial lida de OPENAI_API_KEY (variável de ambiente / .env na raiz do repo),
nunca de argumento de linha de comando.

Nota: o nome do modelo de geração de imagem muda com frequência. Confirme o
modelo atual em https://platform.openai.com/docs/guides/images antes de usar
o default abaixo — ele pode estar desatualizado.
"""

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request

DEFAULT_MODEL = "gpt-image-1"
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
    parser = argparse.ArgumentParser(description="Gera imagem via API de imagens da OpenAI")
    parser.add_argument("prompt")
    parser.add_argument("--out", required=True, help="Caminho do arquivo de saída (.png)")
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--model", default=None)
    args = parser.parse_args()

    load_dotenv(os.path.join(REPO_ROOT, ".env"))

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Erro: OPENAI_API_KEY não encontrada. Preencha o .env (ver .env.example).", file=sys.stderr)
        sys.exit(1)

    model = args.model or os.environ.get("OPENAI_IMAGE_MODEL", DEFAULT_MODEL)

    payload = json.dumps({
        "model": model,
        "prompt": args.prompt,
        "size": args.size,
        "n": 1,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Erro HTTP {e.code} da API da OpenAI:", file=sys.stderr)
        print(e.read().decode("utf-8"), file=sys.stderr)
        sys.exit(1)

    b64 = body["data"][0].get("b64_json")
    if not b64:
        print("Resposta sem b64_json — a API pode ter retornado uma URL em vez de base64.", file=sys.stderr)
        print(json.dumps(body, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    with open(args.out, "wb") as f:
        f.write(base64.b64decode(b64))

    print(f"Imagem salva em {args.out}")


if __name__ == "__main__":
    main()
