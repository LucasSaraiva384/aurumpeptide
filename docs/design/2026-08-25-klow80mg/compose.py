# -*- coding: utf-8 -*-
"""Compositor do carrossel de produto KLOW 80MG (GHK-Cu + BPC-157 + TB-500 +
KPV), 4 artes, 1080x1350 (4:5).

Briefing de origem: docs/marketing/conteudo.md, entrada
"2026-08-25 - Brief final: Carrossel de produto KLOW 80MG", secao
"BRIEF FINAL - pronto para o Designer Manager".

Mesmo sistema visual normativo (docs/identidade-visual.md) ja usado nos
carrosseis anteriores (TG 60mg 28/07, "Evidencia" 12/08, Semax/Selank 14/08):
Georgia serif para titulos em dourado #C6A55A, Segoe UI sans para corpo em
branco gelo, molecula/lockup SEMPRE derivados por recorte direto de
assets/logo-oficial*.png (nunca redesenhados).

Diferenca desta peca: o fundo institucional NAO foi reaproveitado dos
carrosseis anteriores -- foi gerado um fundo dedicado via OpenAI
(raw/bg-klow-openai-01.png), com motivo cientifico sutil (helice de DNA e
estruturas moleculares simples, monocromatico dourado, baixa proeminencia),
por avaliacao do Designer Manager de que a estetica "laboratorio/biotech de
alto padrao" pedida no brief justificava um fundo proprio para esta peca
(opcao explicitamente permitida no briefing). Mesmo assim, o fundo segue
100% dentro da paleta oficial (#0D1B16 / #0F2E25 / #C6A55A) e das proibicoes
(sem bokeh, luz laranja, brilho exagerado, frasco/seringa/agulha/comprimido/
jaleco/rosto humano, sem texto/logo embutido).

Tratamento do disclaimer regulatorio (Slide 4): por instrucao explicita do
Strategic Manager, repassando decisao ja tomada pelo usuario, o disclaimer
("Produto destinado exclusivamente a pesquisa. Nao destinado ao uso
humano...") e tratado como texto discreto (letra miuda), no MESMO padrao
tipografico ja usado em rodapes de fonte/disclaimer de pecas anteriores
(GOLD_DIM, Segoe UI Light, ~20-22px) -- nao ampliado, sem caixa/destaque
visual adicional -- mas mantendo o mesmo nivel de legibilidade dos rodapes
ja aprovados em pecas publicadas (nunca miniaturizado a ponto de ficar
ilegivel no feed). Ver docs/design/pecas.md para o registro completo desta
decisao e da divergencia pontual em relacao a recomendacao visual do
Marketing Manager (que sugeria peso maior).

Ver docs/design/pecas.md para o log completo desta entrega.
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"
RAW = os.path.join(REPO, "docs", "design", "2026-08-25-klow80mg", "raw")
FINAL = os.path.join(REPO, "docs", "design", "2026-08-25-klow80mg", "final")
FONTS = r"C:\Windows\Fonts"

GOLD = (198, 165, 90)
ICE_WHITE = (238, 236, 228)
GOLD_DIM = (168, 140, 78)  # dourado discreto, para rodape/disclaimer/fonte

FEED_W, FEED_H = 1080, 1350

TITLE_FONT = os.path.join(FONTS, "georgia.ttf")
TITLE_FONT_BOLD = os.path.join(FONTS, "georgiab.ttf")
TITLE_FONT_ITALIC = os.path.join(FONTS, "georgiai.ttf")
BODY_FONT = os.path.join(FONTS, "segoeui.ttf")
BODY_FONT_BOLD = os.path.join(FONTS, "segoeuib.ttf")
BODY_FONT_LIGHT = os.path.join(FONTS, "segoeuisl.ttf")


def cover_resize(img, w, h):
    src_ratio = img.width / img.height
    tgt_ratio = w / h
    if src_ratio > tgt_ratio:
        new_h = h
        new_w = int(h * src_ratio)
    else:
        new_w = w
        new_h = int(w / src_ratio)
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    return resized.crop((left, top, left + w, top + h))


def load_base(w, h):
    base = Image.open(os.path.join(RAW, "bg-klow-openai-01.png")).convert("RGB")
    return cover_resize(base, w, h)


def load_base_plain(w, h):
    """Recorte alternativo da MESMA imagem-base, ancorado na faixa inferior
    (livre dos motivos de DNA/estrutura molecular dos cantos superiores),
    usado nas artes de conteudo (Slides 2 e 3) para nao competir com o
    titulo/corpo de texto -- essas artes ja carregam a marca d'agua da
    molecula oficial (5-15%) como elemento cientifico, conforme o briefing."""
    base = Image.open(os.path.join(RAW, "bg-klow-openai-01.png")).convert("RGB")
    tgt_ratio = w / h
    y0 = 760
    y1 = base.height
    crop_h = y1 - y0
    crop_w = int(crop_h * tgt_ratio)
    x0 = max(0, (base.width - crop_w) // 2)
    x1 = min(base.width, x0 + crop_w)
    cropped = base.crop((x0, y0, x1, y1))
    return cropped.resize((w, h), Image.LANCZOS)


def font(path, size):
    return ImageFont.truetype(path, size)


def wrap_text(draw, text, fnt, max_width):
    words = text.split()
    lines = []
    cur = ""
    for word in words:
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def line_height(fnt, line, gap):
    bbox = fnt.getbbox(line) if line else (0, 0, 0, fnt.size)
    return (bbox[3] - bbox[1]) + gap


def draw_multiline_centered(draw, lines, fnt, fill, canvas_w, y, line_gap):
    for line in lines:
        w = draw.textlength(line, font=fnt)
        x = (canvas_w - w) / 2
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_height(fnt, line, line_gap)
    return y


def block_height(lines, fnt, line_gap):
    return sum(line_height(fnt, l, line_gap) for l in lines)


def paste_rgba(base, overlay, cx, cy, target_w=None, opacity=1.0):
    ov = overlay.copy()
    if target_w:
        ratio = target_w / ov.width
        ov = ov.resize((target_w, int(ov.height * ratio)), Image.LANCZOS)
    if opacity < 1.0:
        r, g, b, a = ov.split()
        a = a.point(lambda v: int(v * opacity))
        ov = Image.merge("RGBA", (r, g, b, a))
    x = int(cx - ov.width / 2)
    y = int(cy - ov.height / 2)
    base.paste(ov, (x, y), ov)
    return base


def new_canvas(w, h):
    return load_base(w, h).convert("RGBA")


def new_canvas_plain(w, h):
    return load_base_plain(w, h).convert("RGBA")


def save(img, name):
    path = os.path.join(FINAL, name)
    img.convert("RGB").save(path, quality=95)
    print("salvo:", path)


molecule = Image.open(os.path.join(RAW, "molecule-cutout.png")).convert("RGBA")
lockup = Image.open(os.path.join(RAW, "lockup-cutout.png")).convert("RGBA")


def rule_line(draw, cy, half_w, fill=GOLD_DIM, width=1):
    draw.line([(FEED_W / 2 - half_w, cy), (FEED_W / 2 - half_w + 40, cy)], fill=fill, width=width)
    draw.line([(FEED_W / 2 + half_w - 40, cy), (FEED_W / 2 + half_w, cy)], fill=fill, width=width)


# ---------------------------------------------------------------------------
# SLIDE 1 -- Capa
# ---------------------------------------------------------------------------
def slide1():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    # Hero grafico: molecula oficial em destaque (sem foto real do produto
    # disponivel -- mesmo criterio ja validado para o TG 60mg em 28/07 e
    # reaproveitado na capa do carrossel de 12/08: motivo grafico da
    # molecula dourada oficial, nunca rotulo/embalagem/selo fabricados).
    molecule_top = 96
    molecule_w = 360
    molecule_h = molecule_w * molecule.height / molecule.width
    paste_rgba(img, molecule, FEED_W / 2, molecule_top + molecule_h / 2, target_w=molecule_w, opacity=1.0)

    f_title = font(TITLE_FONT, 50)
    title_lines = wrap_text(
        draw, "QUATRO MECANISMOS. UMA MESMA LINHA DE PESQUISA.", f_title, FEED_W - 150
    )

    f_sub = font(BODY_FONT, 30)
    sub_lines = wrap_text(
        draw, "KLOW 80MG — GHK-Cu • BPC-157 • TB-500 • KPV", f_sub, FEED_W - 140
    )

    f_call = font(BODY_FONT_LIGHT, 24)
    call_lines = wrap_text(
        draw, "Conheça a ciência por trás da combinação.", f_call, FEED_W - 220
    )

    lockup_w = 190
    lockup_h = lockup_w * lockup.height / lockup.width

    title_h = block_height(title_lines, f_title, 12)
    sub_h = block_height(sub_lines, f_sub, 10)
    call_h = block_height(call_lines, f_call, 8)

    gap_hero_title = 56
    gap_title_sub = 26
    gap_sub_call = 46
    gap_call_lockup = 40
    bottom_margin = 70

    top_y = molecule_top + molecule_h + gap_hero_title
    y = top_y
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += gap_title_sub
    y = draw_multiline_centered(draw, sub_lines, f_sub, ICE_WHITE, FEED_W, y, 10)

    # Chamada + lockup ancorados perto da base, conforme briefing
    # ("chamada, discreta, proxima a base").
    lockup_top = FEED_H - bottom_margin - lockup_h
    call_top = lockup_top - gap_call_lockup - call_h
    draw_multiline_centered(draw, call_lines, f_call, GOLD_DIM, FEED_W, call_top, 8)
    paste_rgba(img, lockup, FEED_W / 2, lockup_top + lockup_h / 2, target_w=lockup_w)

    save(img, "slide-1-capa.png")


# ---------------------------------------------------------------------------
# SLIDE 2 -- O que existe por tras do KLOW?
# ---------------------------------------------------------------------------
def slide2():
    img = new_canvas_plain(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=560, opacity=0.07)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 46)
    title_lines = wrap_text(draw, "O QUE EXISTE POR TRÁS DO KLOW?", f_title, FEED_W - 140)
    top_y = 78
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, top_y, 12)
    y += 46

    f_name = font(TITLE_FONT_BOLD, 30)
    f_item = font(BODY_FONT, 26)
    max_w = FEED_W - 200

    components = [
        ("GHK-Cu", "associado em estudos à remodelação da matriz extracelular, síntese de colágeno e reparação tecidual."),
        ("BPC-157", "pesquisado em modelos pré-clínicos ligados a reparação tecidual, tendões e processos angiogênicos."),
        ("TB-500", "relacionado à migração celular, dinâmica do citoesqueleto e cicatrização em estudos experimentais."),
        ("KPV", "pesquisado por modular vias inflamatórias, incluindo sinalização relacionada ao NF-κB."),
    ]

    blocks = []
    for name, desc in components:
        desc_lines = wrap_text(draw, desc, f_item, max_w)
        h = line_height(f_name, name, 6) + block_height(desc_lines, f_item, 8)
        blocks.append((name, desc_lines, h))

    f_destaque = font(TITLE_FONT_BOLD, 26)
    destaque = "REPARAÇÃO • REGENERAÇÃO • MODULAÇÃO INFLAMATÓRIA"
    destaque_lines = wrap_text(draw, destaque, f_destaque, FEED_W - 170)
    destaque_h = block_height(destaque_lines, f_destaque, 10)

    f_footer = font(BODY_FONT_LIGHT, 21)
    footer = (
        "Os efeitos apresentados são derivados de estudos dos componentes "
        "individuais. O blend KLOW, como combinação, ainda não possui "
        "estudos clínicos controlados que comprovem sua eficácia."
    )
    footer_lines = wrap_text(draw, footer, f_footer, FEED_W - 220)
    footer_h = block_height(footer_lines, f_footer, 6)
    footer_y = FEED_H - 66 - footer_h

    block_gap = 30
    components_h = sum(b[2] for b in blocks) + block_gap * (len(blocks) - 1)
    gap_components_destaque = 44
    content_h = components_h + gap_components_destaque + destaque_h

    available_top = y
    available_bottom = footer_y - 46
    # Vies deliberado para o topo (0.3, nao 0.5): conteudo respira logo
    # abaixo do titulo, deixando o excedente de espaco concentrado antes do
    # rodape -- evita o vao vazio grande entre titulo e conteudo observado
    # na primeira renderizacao desta pagina.
    y = available_top + max(0, (available_bottom - available_top - content_h) * 0.3)

    for name, desc_lines, h in blocks:
        w = draw.textlength(name, font=f_name)
        draw.text(((FEED_W - w) / 2, y), name, font=f_name, fill=GOLD)
        y += line_height(f_name, name, 6)
        y = draw_multiline_centered(draw, desc_lines, f_item, ICE_WHITE, FEED_W, y, 8)
        y += block_gap

    y += gap_components_destaque - block_gap
    rule_line(draw, y - 14, 300)
    draw_multiline_centered(draw, destaque_lines, f_destaque, GOLD, FEED_W, y, 10)

    draw_multiline_centered(draw, footer_lines, f_footer, GOLD_DIM, FEED_W, footer_y, 6)

    save(img, "slide-2-componentes.png")


# ---------------------------------------------------------------------------
# SLIDE 3 -- Por que o KLOW desperta tanto interesse?
# ---------------------------------------------------------------------------
def slide3():
    img = new_canvas_plain(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=560, opacity=0.07)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 44)
    title_lines = wrap_text(draw, "POR QUE O KLOW DESPERTA TANTO INTERESSE?", f_title, FEED_W - 130)
    top_y = 84
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, top_y, 12)
    y += 50

    f_item = font(BODY_FONT, 32)
    items = [
        "Reparação Tecidual",
        "Matriz e Colágeno (GHK-Cu)",
        "Modulação Inflamatória (KPV)",
        "Migração e Dinâmica Celular (BPC-157/TB-500)",
    ]
    max_w = FEED_W - 220

    item_lines_list = []
    for it in items:
        item_lines_list.append(wrap_text(draw, it, f_item, max_w))

    row_gap = 40
    items_h = sum(block_height(lns, f_item, 10) for lns in item_lines_list) + row_gap * (len(items) - 1)

    f_destaque = font(TITLE_FONT_BOLD, 30)
    destaque_lines = wrap_text(draw, "4 PEPTÍDEOS / 4 MECANISMOS / 1 BLEND DE PESQUISA", f_destaque, FEED_W - 140)
    destaque_h = block_height(destaque_lines, f_destaque, 10)

    gap_items_destaque = 60
    content_h = items_h + gap_items_destaque + destaque_h
    available_top = y
    available_bottom = FEED_H - 110
    # Mesmo vies para o topo aplicado no Slide 2, pela mesma razao.
    y = available_top + max(0, (available_bottom - available_top - content_h) * 0.35)

    bullet_r = 4
    for lns in item_lines_list:
        h = block_height(lns, f_item, 10)
        first_line_h = line_height(f_item, lns[0], 0)
        bullet_cy = y + first_line_h / 2
        first_w = draw.textlength(lns[0], font=f_item)
        text_left = (FEED_W - first_w) / 2
        draw.ellipse(
            [text_left - 26 - bullet_r, bullet_cy - bullet_r, text_left - 26 + bullet_r, bullet_cy + bullet_r],
            fill=GOLD,
        )
        draw_multiline_centered(draw, lns, f_item, ICE_WHITE, FEED_W, y, 10)
        y += h + row_gap

    y += gap_items_destaque - row_gap
    rule_line(draw, y - 18, 320)
    draw_multiline_centered(draw, destaque_lines, f_destaque, GOLD, FEED_W, y, 10)
    y += destaque_h
    rule_line(draw, y + 4, 320)

    save(img, "slide-3-eixos.png")


# ---------------------------------------------------------------------------
# SLIDE 4 -- Fechamento
# ---------------------------------------------------------------------------
def slide4():
    # Fundo "plain" (sem os motivos de DNA/estrutura molecular dos cantos):
    # o volume de texto desta pagina (titulo + subtitulo + destaque +
    # disclaimer + CTA + assinatura + lockup) ocupa quase toda a altura do
    # canvas, e uma primeira renderizacao com o fundo completo mostrou o
    # disclaimer regulatorio perdendo legibilidade ao cruzar a helice
    # dourada do canto direito -- inaceitavel para um texto de protecao
    # regulatoria. Prioriza legibilidade sobre densidade decorativa aqui.
    img = new_canvas_plain(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=560, opacity=0.07)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 60)
    title_lines = wrap_text(draw, "KLOW 80MG", f_title, FEED_W - 160)

    f_sub = font(BODY_FONT, 30)
    sub_lines = wrap_text(
        draw, "Ciência em uma combinação de quatro peptídeos de pesquisa.", f_sub, FEED_W - 200
    )

    f_destaque = font(TITLE_FONT_BOLD, 28)
    destaque_lines = wrap_text(
        draw, "GHK-Cu + BPC-157 + TB-500 + KPV", f_destaque, FEED_W - 140
    )

    # Disclaimer regulatorio -- tratado como texto discreto (letra miuda),
    # mesmo padrao tipografico ja usado nos rodapes de fonte/disclaimer de
    # pecas anteriores (GOLD_DIM, Segoe UI Light) -- ver nota no cabecalho
    # deste arquivo.
    f_disclaimer = font(BODY_FONT_LIGHT, 21)
    disclaimer_lines = wrap_text(
        draw,
        "Produto destinado exclusivamente à pesquisa. Não destinado ao uso humano. "
        "Este conteúdo é informativo e não constitui indicação de uso.",
        f_disclaimer,
        FEED_W - 230,
    )

    f_cta = font(BODY_FONT, 27)
    cta_lines = wrap_text(
        draw,
        "Dúvidas sobre o KLOW? Fale com a Aurum Peptide pelo WhatsApp ou no Grupo VIP — link na bio.",
        f_cta,
        FEED_W - 220,
    )

    f_assinatura = font(TITLE_FONT_ITALIC, 24)
    assinatura = "Aurum Peptide — Ciência • Pureza • Excelência"
    assinatura_lines = wrap_text(draw, assinatura, f_assinatura, FEED_W - 180)

    lockup_w = 220
    lockup_h = lockup_w * lockup.height / lockup.width

    title_h = block_height(title_lines, f_title, 10)
    sub_h = block_height(sub_lines, f_sub, 10)
    destaque_h = block_height(destaque_lines, f_destaque, 10)
    disclaimer_h = block_height(disclaimer_lines, f_disclaimer, 6)
    cta_h = block_height(cta_lines, f_cta, 10)
    assinatura_h = block_height(assinatura_lines, f_assinatura, 8)

    gaps = [34, 40, 42, 40, 34, 40]
    total_h = (
        title_h + gaps[0] + sub_h + gaps[1] + destaque_h + gaps[2]
        + disclaimer_h + gaps[3] + cta_h + gaps[4] + assinatura_h + gaps[5] + lockup_h
    )
    y = (FEED_H - total_h) / 2

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 10)
    y += gaps[0]
    y = draw_multiline_centered(draw, sub_lines, f_sub, ICE_WHITE, FEED_W, y, 10)
    y += gaps[1]
    y = draw_multiline_centered(draw, destaque_lines, f_destaque, GOLD, FEED_W, y, 10)
    y += gaps[2]
    y = draw_multiline_centered(draw, disclaimer_lines, f_disclaimer, GOLD_DIM, FEED_W, y, 6)
    y += gaps[3]
    y = draw_multiline_centered(draw, cta_lines, f_cta, ICE_WHITE, FEED_W, y, 10)
    y += gaps[4]
    y = draw_multiline_centered(draw, assinatura_lines, f_assinatura, GOLD, FEED_W, y, 8)
    y += gaps[5]

    lockup_cy = y + lockup_h / 2
    paste_rgba(img, lockup, FEED_W / 2, lockup_cy, target_w=lockup_w)

    save(img, "slide-4-fechamento.png")


if __name__ == "__main__":
    os.makedirs(FINAL, exist_ok=True)
    slide1()
    slide2()
    slide3()
    slide4()
