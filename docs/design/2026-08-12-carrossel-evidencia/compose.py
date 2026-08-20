# -*- coding: utf-8 -*-
"""Compositor do carrossel educacional "Evidencia nao e igual para todos"
(Semaglutida / Tirzepatida / Retatrutida), 6 paginas, 1080x1350 (4:5).

Reaproveita o MESMO sistema visual do carrossel TG 60mg (2026-07-28):
mesmo fundo institucional (bg-gemini-01.png, escolhido naquela entrega),
mesma tipografia (Georgia serif / Segoe UI sans), mesmo recorte oficial
da molecula/lockup (nunca redesenhada, sempre derivada de
assets/logo-oficial*.png). Ver docs/design/pecas.md para o log completo.
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"
RAW = os.path.join(REPO, "docs", "design", "2026-08-12-carrossel-evidencia", "raw")
FINAL = os.path.join(REPO, "docs", "design", "2026-08-12-carrossel-evidencia", "final")
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
# PAGINA 1 -- Capa
# ---------------------------------------------------------------------------
# Revisao 2026-08-12 (ajuste pontual pos-aprovacao): capa antes era texto puro
# sobre o fundo institucional (lockup pequeno + titulo + subtitulo). A pedido
# do usuario, a molecula oficial (unica derivada de assets/logo-oficial.png,
# sem redesenho/distorcao/3D) passa a ser o elemento grafico protagonista da
# capa -- maior escala, opacidade total, no topo -- para dar mais impacto
# "estilo feed" mantendo o elemento cientifico dentro do permitido (motivo
# grafico decorativo da molecula, nunca frasco/rotulo/agulha/produto). O
# lockup completo (molecula + "Aurum Peptide") migra para o rodape da capa,
# no mesmo espirito do rodape da pagina 6 -- efeito de "moldura" entre a
# abertura e o fechamento do carrossel. Paginas 2-6 nao foram alteradas.
def pagina1():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    top_margin = 85
    gap_hero_title = 50
    gap_title_sub = 26
    gap_sub_lockup = 55

    hero_w = 560
    hero_h = hero_w * molecule.height / molecule.width
    lockup_w = 260
    lockup_h = lockup_w * lockup.height / lockup.width

    f_title = font(TITLE_FONT, 66)
    title_lines = wrap_text(draw, "Evidência não é igual para todos.", f_title, FEED_W - 180)

    f_sub = font(BODY_FONT_LIGHT, 34)
    sub_lines = wrap_text(
        draw,
        "Os peptídeos com mais comprovação científica até hoje.",
        f_sub,
        FEED_W - 220,
    )

    y = top_margin
    hero_cy = y + hero_h / 2
    paste_rgba(img, molecule, FEED_W / 2, hero_cy, target_w=hero_w, opacity=1.0)
    y += hero_h + gap_hero_title

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 16)
    y = draw_multiline_centered(draw, sub_lines, f_sub, ICE_WHITE, FEED_W, y + gap_title_sub - 16, 14)

    lockup_cy = y + gap_sub_lockup + lockup_h / 2
    paste_rgba(img, lockup, FEED_W / 2, lockup_cy, target_w=lockup_w)

    save(img, "pagina-1-capa.png")


# ---------------------------------------------------------------------------
# PAGINA 2 -- Contexto / pergunta
# ---------------------------------------------------------------------------
def pagina2():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_body = font(BODY_FONT, 40)
    paras = [
        "No mercado de peptídeos, é comum ouvir que \u201ca ciência comprova\u201d quase tudo.",
        "Mas nem toda substância tem o mesmo nível de comprovação — e essa diferença importa.",
        "Existe uma forma objetiva de medir isso: o grau de evidência científica por trás de cada peptídeo.",
    ]
    max_w = FEED_W - 220
    all_lines = []
    for i, p in enumerate(paras):
        all_lines += wrap_text(draw, p, f_body, max_w)
        if i < len(paras) - 1:
            all_lines.append("")

    total_h = block_height(all_lines, f_body, 22)
    y = (FEED_H - total_h) / 2
    y = draw_multiline_centered(draw, all_lines, f_body, ICE_WHITE, FEED_W, y, 22)

    save(img, "pagina-2-contexto.png")


# ---------------------------------------------------------------------------
# PAGINA 3 -- Criterio (lista numerada, do mais forte ao mais fraco)
# ---------------------------------------------------------------------------
def pagina3():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 50)
    title = "Como a ciência classifica a evidência"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 200)
    y = 90
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 46

    items = [
        "Aprovação por agências regulatórias internacionais (como FDA/EMA) — exige revisão completa de segurança e eficácia.",
        "Estudos clínicos controlados em humanos, de fase 2 ou 3, com número relevante de participantes.",
        "Revisões sistemáticas e meta-análises, que reúnem diversos estudos independentes.",
        "Resultado positivo e estatisticamente consistente nos estudos já publicados.",
        "Evidência apenas pré-clínica — testes em laboratório ou em modelos animais, o nível mais frágil de comprovação.",
    ]

    f_num = font(TITLE_FONT_BOLD, 46)
    f_item = font(BODY_FONT, 29)

    left_margin = 110
    num_col_w = 70
    text_x = left_margin + num_col_w
    text_max_w = FEED_W - text_x - 90

    # calcula altura total para centralizar o bloco verticalmente no espaco restante
    item_blocks = []
    for text in items:
        lines = wrap_text(draw, text, f_item, text_max_w)
        h = block_height(lines, f_item, 10)
        item_blocks.append((lines, h))

    gap_between = 34
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
# PAGINA 4 -- Ranking / comparacao
# ---------------------------------------------------------------------------
def pagina4():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title = "Os 3 com mais evidência hoje"
    w = draw.textlength(title, font=f_title)
    y = 84
    draw.text(((FEED_W - w) / 2, y), title, font=f_title, fill=GOLD)
    y += line_height(f_title, title, 0) + 44

    f_name = font(TITLE_FONT_BOLD, 38)
    f_body = font(BODY_FONT, 27)

    blocks = [
        (
            "Semaglutida",
            "Aprovada por agências regulatórias internacionais. Avaliada em "
            "estudo clínico de fase 3, controlado por placebo, com quase "
            "2.000 participantes.",
        ),
        (
            "Tirzepatida",
            "Também aprovada por agências regulatórias internacionais. "
            "Avaliada em estudo clínico de fase 3, controlado por placebo, "
            "com mais de 2.500 participantes em múltiplos países — "
            "incluindo centros no Brasil.",
        ),
        (
            "Retatrutida",
            "Ainda não aprovada por agências regulatórias. Concluiu estudo "
            "de fase 2, controlado por placebo, com resultados "
            "consistentes; segue em avaliação de fase 3.",
        ),
    ]

    max_w = FEED_W - 200
    block_gap = 46

    # pre-calcula alturas para centralizar o conjunto de 3 blocos no espaco
    # entre o titulo e o rodape (evita sobra de espaco em branco no final)
    prepared = []
    total_h = 0
    for name, body in blocks:
        name_h = line_height(f_name, name, 12)
        lines = wrap_text(draw, body, f_body, max_w)
        body_h = block_height(lines, f_body, 10)
        prepared.append((name, lines, name_h, body_h))
        total_h += name_h + body_h
    total_h += block_gap * (len(blocks) - 1)

    f_footer = font(BODY_FONT_LIGHT, 21)
    footer = (
        "Fonte: estudos publicados em periódicos científicos revisados "
        "por pares, indexados no PubMed/NIH."
    )
    footer_lines = wrap_text(draw, footer, f_footer, FEED_W - 260)
    fh = block_height(footer_lines, f_footer, 6)
    footer_y = FEED_H - 90 - fh

    available_bottom = footer_y - 40
    cy = y + max(0, (available_bottom - y - total_h) / 2)

    for name, lines, name_h, body_h in prepared:
        w = draw.textlength(name, font=f_name)
        draw.text(((FEED_W - w) / 2, cy), name, font=f_name, fill=GOLD)
        cy += name_h
        cy = draw_multiline_centered(draw, lines, f_body, ICE_WHITE, FEED_W, cy, 10)
        cy += block_gap

    draw_multiline_centered(draw, footer_lines, f_footer, GOLD_DIM, FEED_W, footer_y, 6)

    save(img, "pagina-4-ranking.png")


# ---------------------------------------------------------------------------
# PAGINA 5 -- O que isso nao significa
# ---------------------------------------------------------------------------
def pagina5():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.08)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 54)
    title = "O que isso não significa"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 180)

    f_body = font(BODY_FONT, 34)
    paras = [
        "Ter o maior nível de evidência científica não é o mesmo que prometer "
        "resultado individual — cada organismo responde de um jeito, e nenhum "
        "estudo substitui avaliação individual.",
        "E o oposto também é verdade: um peptídeo com evidência ainda limitada "
        "não é necessariamente inútil — apenas ainda não foi estudado o "
        "suficiente para afirmar isso com segurança.",
        "Ciência é isso: comprovação que evolui, nunca promessa fechada.",
    ]
    max_w = FEED_W - 200
    body_lines = []
    for i, p in enumerate(paras):
        body_lines += wrap_text(draw, p, f_body, max_w)
        if i < len(paras) - 1:
            body_lines.append("")

    title_h = block_height(title_lines, f_title, 14)
    body_h = block_height(body_lines, f_body, 18)
    gap = 56
    total_h = title_h + gap + body_h
    y = (FEED_H - total_h) / 2

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y += gap
    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, y, 18)

    save(img, "pagina-5-nao-significa.png")


# ---------------------------------------------------------------------------
# PAGINA 6 -- Fechamento (sem CTA comercial, convite a engajar)
# ---------------------------------------------------------------------------
def pagina6():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 54)
    title_lines = wrap_text(draw, "Este retrato muda com o tempo.", f_title, FEED_W - 180)

    f_body = font(BODY_FONT, 34)
    body1 = (
        "Ciência é um processo contínuo — o que vale hoje pode ser "
        "atualizado amanhã, conforme novos estudos surgem."
    )
    body2 = (
        "Qual peptídeo você gostaria de ver analisado com este mesmo "
        "critério? Deixe nos comentários."
    )
    max_w = FEED_W - 220
    body_lines = wrap_text(draw, body1, f_body, max_w) + [""] + wrap_text(draw, body2, f_body, max_w)

    y = 210
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y += 46
    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, y, 18)

    paste_rgba(img, lockup, FEED_W / 2, 1130, target_w=420)

    save(img, "pagina-6-fechamento.png")


if __name__ == "__main__":
    os.makedirs(FINAL, exist_ok=True)
    pagina1()
    pagina2()
    pagina3()
    pagina4()
    pagina5()
    pagina6()
