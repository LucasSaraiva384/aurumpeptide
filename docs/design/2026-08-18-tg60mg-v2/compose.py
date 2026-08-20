# -*- coding: utf-8 -*-
"""Compositor do carrossel TG 60MG (Tirzepatida) -- REESCRITA COMPLETA (18/08/2026),
que SUBSTITUI a peca publicada e apagada em 18/08. 6 paginas, 1080x1350 (4:5).

Reaproveita o mesmo sistema visual ja validado nas pecas anteriores da serie
(28/07, 12/08, 14/08-17/08): mesmo fundo institucional (bg-gemini-01.png,
copiado de docs/design/2026-07-28-tg60mg/raw/), mesma tipografia (Georgia
serif / Segoe UI sans), mesmo recorte oficial da molecula/lockup (nunca
redesenhada, sempre derivada de assets/logo-oficial*.png).

Copy exata: docs/marketing/conteudo.md, secao "Reescrita completa (2026-08-18)
-- nova versao do carrossel TG 60mg, SUBSTITUI a peca publicada e apagada em
18/08". Ver docs/design/pecas.md para o log completo desta execucao.
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"
RAW = os.path.join(REPO, "docs", "design", "2026-08-18-tg60mg-v2", "raw")
FINAL = os.path.join(REPO, "docs", "design", "2026-08-18-tg60mg-v2", "final")
FONTS = r"C:\Windows\Fonts"

GOLD = (198, 165, 90)
ICE_WHITE = (238, 236, 228)
GOLD_DIM = (168, 140, 78)  # dourado levemente mais discreto, para rodape/fonte

FEED_W, FEED_H = 1080, 1350

TITLE_FONT = os.path.join(FONTS, "georgia.ttf")
TITLE_FONT_BOLD = os.path.join(FONTS, "georgiab.ttf")
BODY_FONT = os.path.join(FONTS, "segoeui.ttf")
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
    base = Image.open(os.path.join(RAW, "bg-gemini-01-reused.png")).convert("RGB")
    return cover_resize(base, w, h)


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


def save(img, name):
    path = os.path.join(FINAL, name)
    img.convert("RGB").save(path, quality=95)
    print("salvo:", path)


molecule = Image.open(os.path.join(RAW, "molecule-cutout.png")).convert("RGBA")
lockup = Image.open(os.path.join(RAW, "lockup-cutout.png")).convert("RGBA")


# ---------------------------------------------------------------------------
# PAGINA 1 -- Capa (gancho cientifico, NAO "produto novo"/"portfolio")
# ---------------------------------------------------------------------------
def pagina1():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    top_margin = 85
    gap_hero_title = 50
    gap_title_sub = 26
    gap_sub_lockup = 55

    hero_w = 480
    hero_h = hero_w * molecule.height / molecule.width
    lockup_w = 260
    lockup_h = lockup_w * lockup.height / lockup.width

    f_title = font(TITLE_FONT, 58)
    title_lines = wrap_text(
        draw, "Nem toda molécula chega à aprovação regulatória.", f_title, FEED_W - 170
    )

    f_sub = font(BODY_FONT_LIGHT, 32)
    sub_lines = wrap_text(
        draw,
        "O que a ciência diz sobre a Tirzepatida — e por que isso importa "
        "antes de qualquer decisão de confiança.",
        f_sub,
        FEED_W - 220,
    )

    y = top_margin
    hero_cy = y + hero_h / 2
    paste_rgba(img, molecule, FEED_W / 2, hero_cy, target_w=hero_w, opacity=1.0)
    y += hero_h + gap_hero_title

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y = draw_multiline_centered(draw, sub_lines, f_sub, ICE_WHITE, FEED_W, y + gap_title_sub - 14, 12)

    lockup_cy = y + gap_sub_lockup + lockup_h / 2
    paste_rgba(img, lockup, FEED_W / 2, lockup_cy, target_w=lockup_w)

    save(img, "pagina-1-capa.png")


# ---------------------------------------------------------------------------
# PAGINA 2 -- Contexto
# ---------------------------------------------------------------------------
def pagina2():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_body = font(BODY_FONT, 38)
    paras = [
        "No mercado de peptídeos metabólicos, é comum ouvir falar em "
        "moléculas \u201cpromissoras\u201d. Mas poucas de fato percorrem o "
        "caminho mais rigoroso da ciência: ensaios clínicos controlados, "
        "revisão regulatória, aprovação por agências internacionais.",
        "A Tirzepatida é uma delas. Antes de falar sobre ela "
        "especificamente, vale entender o que esse nível de comprovação "
        "significa de fato — e por que nem toda substância chega até ali.",
    ]
    max_w = FEED_W - 210
    all_lines = []
    for i, p in enumerate(paras):
        all_lines += wrap_text(draw, p, f_body, max_w)
        if i < len(paras) - 1:
            all_lines.append("")

    total_h = block_height(all_lines, f_body, 20)
    y = (FEED_H - total_h) / 2
    draw_multiline_centered(draw, all_lines, f_body, ICE_WHITE, FEED_W, y, 20)

    save(img, "pagina-2-contexto.png")


# ---------------------------------------------------------------------------
# PAGINA 3 -- Criterio / metodologia (o que significa "comprovacao cientifica")
# Mesmo recurso tipografico ja validado na Pagina 3 do carrossel de 12/08
# (lista numerada, numerais dourados grandes, respiro generoso entre blocos).
# ---------------------------------------------------------------------------
def pagina3():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 46)
    title = "Como a ciência classifica esse tipo de comprovação"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 190)
    y = 90
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 44

    items = [
        "Aprovação por agências regulatórias internacionais — como FDA e "
        "ANVISA — que exige revisão completa de segurança e eficácia.",
        "Estudos clínicos controlados em humanos, de fase 2 ou 3, com "
        "número relevante de participantes.",
        "Multicentricidade — o mesmo estudo conduzido em diferentes "
        "países, incluindo o Brasil.",
        "Desenho duplo-cego, controlado por placebo, para isolar o efeito "
        "real da substância do efeito esperado por quem participa.",
    ]

    f_num = font(TITLE_FONT_BOLD, 44)
    f_item = font(BODY_FONT, 29)

    left_margin = 110
    num_col_w = 68
    text_x = left_margin + num_col_w
    text_max_w = FEED_W - text_x - 90

    item_blocks = []
    for text in items:
        lines = wrap_text(draw, text, f_item, text_max_w)
        h = block_height(lines, f_item, 10)
        item_blocks.append((lines, h))

    gap_between = 40
    total_items_h = sum(h for _, h in item_blocks) + gap_between * (len(items) - 1)
    remaining = FEED_H - y - 70
    start_y = y + max(0, (remaining - total_items_h) / 2)

    cy = start_y
    for idx, (lines, h) in enumerate(item_blocks, start=1):
        draw.text((left_margin, cy - 6), str(idx), font=f_num, fill=GOLD)
        ty = cy
        for line in lines:
            draw.text((text_x, ty), line, font=f_item, fill=ICE_WHITE)
            ty += line_height(f_item, line, 10)
        cy += h + gap_between

    save(img, "pagina-3-criterio.png")


# ---------------------------------------------------------------------------
# PAGINA 4 -- Tirzepatida: o que a evidencia mostra
# Reaproveita, verbatim, o copy ja validado na correcao de 17/08 para o
# antigo Slide 4 (docs/design/2026-07-28-tg60mg/compose.py, funcao slide4()).
# ---------------------------------------------------------------------------
def pagina4():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=480, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 50)
    title = "Tirzepatida: o que a evidência mostra"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 180)
    y = 96
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 34

    f_body = font(BODY_FONT, 33)
    body = (
        "Tirzepatida é uma das moléculas de sua classe com maior nível de "
        "comprovação científica até hoje: aprovada por agências regulatórias "
        "internacionais — FDA, nos Estados Unidos, e ANVISA, no Brasil — e "
        "avaliada no maior estudo clínico de fase 3 já publicado sobre o "
        "tema, controlado por placebo e multicêntrico em 9 países, "
        "incluindo centros no Brasil, com mais de 2.500 participantes."
    )
    body_lines = wrap_text(draw, body, f_body, FEED_W - 220)
    body_h = block_height(body_lines, f_body, 14)

    f_footer = font(BODY_FONT_LIGHT, 21)
    footer = (
        "Fonte: estudo publicado em periódico científico revisado por "
        "pares, indexado no PubMed/NIH (SURMOUNT-1, New England Journal of "
        "Medicine, 2022). Este conteúdo é informativo, não constitui "
        "indicação de uso e não substitui avaliação de profissional de "
        "saúde habilitado."
    )
    footer_lines = wrap_text(draw, footer, f_footer, FEED_W - 260)
    footer_h = block_height(footer_lines, f_footer, 8)
    footer_y = FEED_H - 90 - footer_h

    available_bottom = footer_y - 40
    body_y = y + max(0, (available_bottom - y - body_h) / 2)

    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, body_y, 14)
    draw_multiline_centered(draw, footer_lines, f_footer, GOLD_DIM, FEED_W, footer_y, 8)

    save(img, "pagina-4-evidencia.png")


# ---------------------------------------------------------------------------
# PAGINA 5 -- Onde a Tirzepatida esta no portfolio Aurum
# Enquadramento estritamente informativo, sem "hero shot" nem preco.
# Mesmo nivel visual das paginas 2 e 3 -- nao uma "pagina de venda".
# ---------------------------------------------------------------------------
def pagina5():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title_lines = wrap_text(draw, "Tirzepatida no portfólio Aurum", f_title, FEED_W - 180)

    f_body = font(BODY_FONT, 36)
    body = (
        "Dentro da linha de emagrecimento e metabolismo do portfólio "
        "Aurum, a Tirzepatida está presente no TG 60MG — tratado com o "
        "mesmo critério aplicado a qualquer produto da marca: seriedade "
        "sobre o que é oferecido, sem exagero e sem promessa de resultado "
        "individual."
    )
    body_lines = wrap_text(draw, body, f_body, FEED_W - 210)

    title_h = block_height(title_lines, f_title, 14)
    body_h = block_height(body_lines, f_body, 18)
    gap = 54
    total_h = title_h + gap + body_h
    y = (FEED_H - total_h) / 2

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y += gap
    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, y, 18)

    save(img, "pagina-5-produto.png")


# ---------------------------------------------------------------------------
# PAGINA 6 -- Fechamento (CTA discreto, WhatsApp/Grupo VIP)
# ---------------------------------------------------------------------------
def pagina6():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 48)
    title_lines = wrap_text(
        draw, "A ciência evolui — e a informação também deveria", f_title, FEED_W - 170
    )

    f_body = font(BODY_FONT, 34)
    body1 = (
        "Este conteúdo é informativo. Não constitui indicação de uso, não "
        "substitui avaliação de profissional de saúde habilitado e não "
        "promete resultado individual."
    )
    body2 = (
        "Tem dúvidas sobre a Tirzepatida ou sobre os produtos da Aurum? "
        "Fale com a gente pelo WhatsApp ou no Grupo VIP — link na bio."
    )
    max_w = FEED_W - 210
    body_lines = wrap_text(draw, body1, f_body, max_w) + [""] + wrap_text(draw, body2, f_body, max_w)

    y = 175
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y += 44
    y = draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, y, 18)

    paste_rgba(img, lockup, FEED_W / 2, 1150, target_w=420)

    save(img, "pagina-6-fechamento.png")


if __name__ == "__main__":
    os.makedirs(FINAL, exist_ok=True)
    pagina1()
    pagina2()
    pagina3()
    pagina4()
    pagina5()
    pagina6()
