#!/usr/bin/env python3
"""
Dispara um WhatsApp Message Template aprovado para uma lista de números.

Usa a WhatsApp Cloud API diretamente (POST /{phone-number-id}/messages),
reaproveitando as credenciais já usadas por scripts/meta_graph.py. Existe
como script separado porque meta_graph.py é um cliente genérico da Graph API
(GET/POST em qualquer endpoint) e o envio de template em massa precisa de
lógica própria: checar aprovação antes de disparar, ler a lista de contatos,
pacing entre envios, e log por contato.

Uso:
    python scripts/whatsapp_enviar_template.py --template convite_grupo_vip --lista contatos.csv [--dry-run]

Formato do CSV (`--lista`), sem cabeçalho, uma linha por contato:
    5511999999999,Maria Silva
    5532988888888,João Pereira

O nome é só para o log deste script (o template `convite_grupo_vip` não tem
variável no corpo) — se um template futuro usar {{1}}, adaptar `montar_payload`.

--dry-run: valida a lista e mostra o que seria enviado, sem chamar a API.

Credenciais lidas de variáveis de ambiente (.env na raiz), nunca de argumentos
de linha de comando — mesmo critério de scripts/meta_graph.py.
"""

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO_ROOT, "scripts"))

from meta_graph import load_dotenv, request, DEFAULT_API_VERSION  # noqa: E402

# Pausa entre envios (segundos) — evita rajada contra o rate limit da Cloud
# API. Ajustar conforme o tier de mensageria da conta, se necessário.
PACING_SEGUNDOS = 1.0

# Mesmo banner usado no fluxo de boas-vindas (apps/site/public/whatsapp-banner-boas-vindas.png),
# publicamente acessível via site. Usado quando o template tem HEADER format IMAGE.
URL_BANNER_PADRAO = "https://aurumpeptide.com.br/whatsapp-banner-boas-vindas.png"


def template_exige_header_imagem(template_info: dict) -> bool:
    for componente in template_info.get("components", []):
        if componente.get("type") == "HEADER" and componente.get("format") == "IMAGE":
            return True
    return False


def normalizar_telefone(numero: str) -> str:
    """Remove espaços/símbolos, mantém só dígitos (formato E.164 sem '+')."""
    return "".join(c for c in numero.strip() if c.isdigit())


def ler_lista(caminho: str) -> list[tuple[str, str]]:
    contatos = []
    with open(caminho, "r", encoding="utf-8") as f:
        leitor = csv.reader(f)
        for linha in leitor:
            if not linha or not linha[0].strip():
                continue
            telefone = normalizar_telefone(linha[0])
            nome = linha[1].strip() if len(linha) > 1 else ""
            if not telefone:
                continue
            contatos.append((telefone, nome))
    return contatos


def checar_template_aprovado(waba_id: str, nome_template: str, token: str, api_version: str) -> dict:
    status, body = request(
        "GET",
        f"/{waba_id}/message_templates",
        {"name": nome_template, "fields": "name,status,category,components"},
        token,
        api_version,
    )
    if status >= 400:
        raise RuntimeError(f"Falha ao consultar status do template (HTTP {status}): {body}")
    data = json.loads(body).get("data", [])
    if not data:
        raise RuntimeError(f"Template '{nome_template}' não encontrado na conta.")
    return data[0]


def enviar_template(phone_number_id: str, telefone: str, nome_template: str, token: str, api_version: str, url_imagem_header: str | None) -> tuple[int, str]:
    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}/messages"
    template = {"name": nome_template, "language": {"code": "pt_BR"}}
    if url_imagem_header:
        template["components"] = [
            {
                "type": "header",
                "parameters": [{"type": "image", "image": {"link": url_imagem_header}}],
            }
        ]
    payload = {
        "messaging_product": "whatsapp",
        "to": telefone,
        "type": "template",
        "template": template,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Dispara um Message Template do WhatsApp para uma lista de contatos.")
    parser.add_argument("--template", required=True, help="Nome do template já criado/aprovado (ex.: convite_grupo_vip)")
    parser.add_argument("--lista", required=True, help="Caminho do CSV: telefone,nome (nome opcional)")
    parser.add_argument("--dry-run", action="store_true", help="Só valida e mostra o que seria enviado, sem chamar a API")
    args = parser.parse_args()

    load_dotenv(os.path.join(REPO_ROOT, ".env"))
    token = os.environ.get("META_ACCESS_TOKEN")
    phone_number_id = os.environ.get("META_WHATSAPP_PHONE_NUMBER_ID")
    waba_id = os.environ.get("META_WHATSAPP_BUSINESS_ACCOUNT_ID")
    api_version = os.environ.get("META_API_VERSION", DEFAULT_API_VERSION)

    if not token or not phone_number_id or not waba_id:
        print("Erro: META_ACCESS_TOKEN, META_WHATSAPP_PHONE_NUMBER_ID e META_WHATSAPP_BUSINESS_ACCOUNT_ID precisam estar no .env.", file=sys.stderr)
        sys.exit(1)

    contatos = ler_lista(args.lista)
    if not contatos:
        print("Erro: lista vazia ou sem números válidos.", file=sys.stderr)
        sys.exit(1)

    print(f"{len(contatos)} contato(s) na lista.")

    template_info = checar_template_aprovado(waba_id, args.template, token, api_version)
    status_template = template_info.get("status")
    print(f"Template '{args.template}': status atual = {status_template}")

    if status_template != "APPROVED":
        print(
            f"Erro: template ainda não está APPROVED (status: {status_template}). "
            "Não é possível disparar até a Meta aprovar. Abortando.",
            file=sys.stderr,
        )
        sys.exit(1)

    if args.dry_run:
        print("\n--dry-run: nenhuma mensagem será enviada. Contatos que seriam usados:")
        for telefone, nome in contatos:
            print(f"  {telefone}  {nome}")
        return

    url_imagem_header = URL_BANNER_PADRAO if template_exige_header_imagem(template_info) else None
    if url_imagem_header:
        print(f"Template tem HEADER de imagem — usando {url_imagem_header}")

    print(f"\nDisparando '{args.template}' para {len(contatos)} contato(s)...\n")
    sucesso, falha = 0, 0
    for i, (telefone, nome) in enumerate(contatos, start=1):
        status, body = enviar_template(phone_number_id, telefone, args.template, token, api_version, url_imagem_header)
        ok = status < 400
        sucesso += ok
        falha += not ok
        rotulo = nome or telefone
        print(f"[{i}/{len(contatos)}] {rotulo} ({telefone}): {'OK' if ok else 'FALHA'} (HTTP {status})")
        if not ok:
            print(f"    {body}")
        if i < len(contatos):
            time.sleep(PACING_SEGUNDOS)

    print(f"\nConcluído: {sucesso} enviado(s), {falha} falha(s).")


if __name__ == "__main__":
    main()
