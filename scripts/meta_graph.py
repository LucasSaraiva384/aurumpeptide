#!/usr/bin/env python3
"""
CLI mínimo para chamar a Meta Graph API (Facebook/Instagram/Marketing API).

Uso:
    python scripts/meta_graph.py get  /<endpoint> [--param chave=valor ...]
    python scripts/meta_graph.py post /<endpoint> [--param chave=valor ...]

Exemplos:
    python scripts/meta_graph.py get /me --param fields=id,name
    python scripts/meta_graph.py get /{ad-account-id}/insights --param fields=spend,actions --param date_preset=last_7d
    python scripts/meta_graph.py post /{ig-user-id}/media --param image_url=https://... --param caption="Legenda"

Credenciais são lidas de variáveis de ambiente (nunca de argumentos de linha de comando,
para não expor o token em `ps`/histórico do shell). Carrega automaticamente um arquivo
`.env` na raiz do repo, se existir.

Variáveis esperadas (ver .env.example):
    META_ACCESS_TOKEN     (obrigatória)
    META_API_VERSION      (opcional, default abaixo)
    META_AD_ACCOUNT_ID    (opcional, atalho para {ad-account-id} nos exemplos)
    META_PAGE_ID          (opcional)
    META_IG_BUSINESS_ACCOUNT_ID (opcional)
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_API_VERSION = "v21.0"
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
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def build_url(endpoint, api_version):
    endpoint = endpoint.lstrip("/")
    return f"https://graph.facebook.com/{api_version}/{endpoint}"


def request(method, endpoint, params, token, api_version):
    url = build_url(endpoint, api_version)
    params = dict(params)
    params["access_token"] = token

    if method == "GET":
        url = f"{url}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, method="GET")
    else:
        data = urllib.parse.urlencode(params).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def main():
    parser = argparse.ArgumentParser(description="Cliente mínimo da Meta Graph API")
    parser.add_argument("method", choices=["get", "post"])
    parser.add_argument("endpoint", help="Ex.: /me, /{ad-account-id}/insights")
    parser.add_argument(
        "--param",
        action="append",
        default=[],
        metavar="chave=valor",
        help="Parâmetro da requisição, repetível",
    )
    args = parser.parse_args()

    load_dotenv(os.path.join(REPO_ROOT, ".env"))

    token = os.environ.get("META_ACCESS_TOKEN")
    if not token:
        print("Erro: variável de ambiente META_ACCESS_TOKEN não encontrada.", file=sys.stderr)
        print("Configure o arquivo .env na raiz do projeto (ver .env.example).", file=sys.stderr)
        sys.exit(1)

    api_version = os.environ.get("META_API_VERSION", DEFAULT_API_VERSION)

    endpoint = args.endpoint
    endpoint = endpoint.replace("{ad-account-id}", os.environ.get("META_AD_ACCOUNT_ID", "{ad-account-id}"))
    endpoint = endpoint.replace("{page-id}", os.environ.get("META_PAGE_ID", "{page-id}"))
    endpoint = endpoint.replace("{ig-user-id}", os.environ.get("META_IG_BUSINESS_ACCOUNT_ID", "{ig-user-id}"))

    params = {}
    for p in args.param:
        if "=" not in p:
            print(f"Erro: --param inválido '{p}', use chave=valor", file=sys.stderr)
            sys.exit(1)
        k, _, v = p.partition("=")
        params[k] = v

    status, body = request(args.method.upper(), endpoint, params, token, api_version)

    try:
        parsed = json.loads(body)
        print(json.dumps(parsed, indent=2, ensure_ascii=False))
    except json.JSONDecodeError:
        print(body)

    sys.exit(0 if status < 400 else 1)


if __name__ == "__main__":
    main()
