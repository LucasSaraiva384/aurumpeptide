# -*- coding: utf-8 -*-
"""Compositor das pecas TG 60MG (carrossel + stories) sobre o fundo institucional
gerado via IA, usando SEMPRE o recorte oficial da molecula/lockup (nunca redesenhada).
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"
RAW = os.path.join(REPO, "docs", "design", "2026-07-28-tg60mg", "raw")
FINAL = os.path.join(REPO, "docs", "design", "2026-07-28-tg60mg", "final")
FONTS = r"C:\Windows\Fonts"

GOLD = (198, 165, 90)
ICE_WHITE = (238, 236, 228)
GOLD_DIM = (168, 140, 78)  # dourado levemente mais discreto, para rodape/fonte (adicionado 2026-08-17, mesma cor do carrossel 12/08)

FEED_W, FEED_H = 1080, 1350
STORY_W, STORY_H = 1080, 1920

TITLE_FONT = os.path.join(FONTS, "georgia.ttf")
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
    base = Image.open(os.path.join(RAW, "bg-gemini-01.png")).convert("RGB")
    return cover_resize(base, w, h)


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    cur = ""
    for word in words:
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_multiline_centered(draw, lines, font, fill, canvas_w, y, line_gap, letter_spacing=0):
    for line in lines:
        if letter_spacing:
            line_draw = "".join(ch + (" " * 0) for ch in line)  # placeholder, spacing handled elsewhere
        w = draw.textlength(line, font=font)
        x = (canvas_w - w) / 2
        draw.text((x, y), line, font=font, fill=fill)
        bbox = font.getbbox(line)
        y += (bbox[3] - bbox[1]) + line_gap
    return y


def tracked(text, spaces=1):
    return (" " * spaces).join(list(text))


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
    base = load_base(w, h).convert("RGBA")
    return base


def save(img, name):
    path = os.path.join(FINAL, name)
    img.convert("RGB").save(path, quality=95)
    print("salvo:", path)


def font(path, size):
    return ImageFont.truetype(path, size)


molecule = Image.open(os.path.join(RAW, "molecule-cutout.png")).convert("RGBA")
lockup = Image.open(os.path.join(RAW, "lockup-cutout.png")).convert("RGBA")


# ---------------------------------------------------------------------------
# SLIDE 1 -- Capa
# ---------------------------------------------------------------------------
def slide1():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    paste_rgba(img, lockup, FEED_W / 2, 430, target_w=430)

    f_title = font(TITLE_FONT, 58)
    lines = wrap_text(draw, "Uma nova adição ao portfólio Aurum.", f_title, FEED_W - 200)
    y = draw_multiline_centered(draw, lines, f_title, GOLD, FEED_W, 760, 14)

    f_sub = font(BODY_FONT, 30)
    sub = tracked("TG 60MG", 2)
    w = draw.textlength(sub, font=f_sub)
    draw.text(((FEED_W - w) / 2, y + 22), sub, font=f_sub, fill=ICE_WHITE)

    save(img, "slide-1-capa.png")
    return img


# ---------------------------------------------------------------------------
# SLIDE 2 -- Confianca antes de produto
# ---------------------------------------------------------------------------
def slide2():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=520, opacity=0.09)
    draw = ImageDraw.Draw(img)

    f_body = font(BODY_FONT, 40)
    text = (
        "No mercado de peptídeos, a maior dúvida de quem compra não é sobre "
        "resultado — é sobre em quem confiar."
    )
    text2 = (
        "Por isso, todo produto que entra no portfólio Aurum segue o mesmo "
        "critério: seriedade sobre o que é vendido, sem exageros e sem "
        "promessas que a marca não possa sustentar."
    )
    max_w = FEED_W - 220
    lines = wrap_text(draw, text, f_body, max_w) + [""] + wrap_text(draw, text2, f_body, max_w)

    total_h = 0
    heights = []
    for line in lines:
        if line == "":
            h = 24
        else:
            bbox = f_body.getbbox(line)
            h = (bbox[3] - bbox[1]) + 22
        heights.append(h)
        total_h += h

    y = (FEED_H - total_h) / 2
    for line, h in zip(lines, heights):
        if line:
            w = draw.textlength(line, font=f_body)
            draw.text(((FEED_W - w) / 2, y), line, font=f_body, fill=ICE_WHITE)
        y += h

    save(img, "slide-2-confianca.png")
    return img


# ---------------------------------------------------------------------------
# SLIDE 3 -- Apresentacao do produto (Cenario 2: motivo grafico da molecula)
# ---------------------------------------------------------------------------
def slide3():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    paste_rgba(img, molecule, FEED_W / 2, 430, target_w=380)

    f_title = font(TITLE_FONT, 66)
    title = "TG 60MG"
    w = draw.textlength(title, font=f_title)
    draw.text(((FEED_W - w) / 2, 700), title, font=f_title, fill=GOLD)

    f_body = font(BODY_FONT, 38)
    body = (
        "À base de Tirzepatida, TG 60MG é a mais nova adição à linha de "
        "emagrecimento e metabolismo do portfólio Aurum Peptide."
    )
    lines = wrap_text(draw, body, f_body, FEED_W - 220)
    draw_multiline_centered(draw, lines, f_body, ICE_WHITE, FEED_W, 830, 16)

    save(img, "slide-3-produto.png")
    return img


# ---------------------------------------------------------------------------
# SLIDE 4 -- Tirzepatida: o que a evidencia mostra
# ---------------------------------------------------------------------------
# Recomposto em 2026-08-17 por nova diretriz permanente (docs/tom-de-voz.md,
# "Posts de produto no Instagram/Facebook -- nunca preco nem 'disponivel para
# venda'"): sai o tratamento de "numero grande" do preco, entra o mesmo
# tratamento de corpo de texto + rodape discreto ja usado na Pagina 4 do
# carrossel de 12/08 (docs/design/2026-08-12-carrossel-evidencia/compose.py,
# funcao pagina4()) -- titulo serif dourado, corpo sans-serif em bloco
# centralizado, rodape pequeno para fonte/disclaimer. Mesmo fundo, mesma
# marca d'agua da molecula (8% opacidade), nada de numeral gigante.
# Copy exata: docs/marketing/conteudo.md, entrada 2026-07-28, secao
# "Correcao pos-nova-diretriz (2026-08-17)".
def slide4():
    img = new_canvas(FEED_W, FEED_H)
    paste_rgba(img, molecule, FEED_W / 2, FEED_H / 2, target_w=480, opacity=0.08)
    draw = ImageDraw.Draw(img)

    def lines_height(lines, fnt, gap):
        h = 0
        for line in lines:
            bbox = fnt.getbbox(line) if line else (0, 0, 0, fnt.size)
            h += (bbox[3] - bbox[1]) + gap
        return h

    # Titulo
    f_title = font(TITLE_FONT, 50)
    title = "Tirzepatida: o que a evidência mostra"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 180)
    y = 96
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 34

    # Corpo
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
    body_h = lines_height(body_lines, f_body, 14)

    # Rodape (fonte + disclaimer)
    f_footer = font(BODY_FONT_LIGHT, 21)
    footer = (
        "Fonte: estudo publicado em periódico científico revisado por "
        "pares, indexado no PubMed/NIH (SURMOUNT-1, New England Journal of "
        "Medicine, 2022). Este conteúdo é informativo, não constitui "
        "indicação de uso e não substitui avaliação de profissional de "
        "saúde habilitado."
    )
    footer_lines = wrap_text(draw, footer, f_footer, FEED_W - 260)
    footer_h = lines_height(footer_lines, f_footer, 8)
    footer_y = FEED_H - 90 - footer_h

    # Centraliza o bloco do corpo no espaco disponivel entre titulo e rodape
    available_bottom = footer_y - 40
    body_y = y + max(0, (available_bottom - y - body_h) / 2)

    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, body_y, 14)
    draw_multiline_centered(draw, footer_lines, f_footer, GOLD_DIM, FEED_W, footer_y, 8)

    save(img, "slide-4-preco.png")
    return img


# ---------------------------------------------------------------------------
# SLIDE 5 -- Fechamento / CTA
# ---------------------------------------------------------------------------
def slide5():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_body = font(BODY_FONT, 40)
    text1 = "Fale com a Aurum Peptide."
    text2 = "Grupo VIP e atendimento via WhatsApp — link na bio."
    lines = [text1] + wrap_text(draw, text2, f_body, FEED_W - 220)
    draw_multiline_centered(draw, lines, f_body, ICE_WHITE, FEED_W, 300, 18)

    paste_rgba(img, lockup, FEED_W / 2, 880, target_w=460)

    save(img, "slide-5-fechamento.png")
    return img


# ---------------------------------------------------------------------------
# STORIES
# ---------------------------------------------------------------------------
def story1():
    img = new_canvas(STORY_W, STORY_H)
    draw = ImageDraw.Draw(img)
    f_title = font(TITLE_FONT, 62)
    lines = wrap_text(draw, "Algo novo chegou ao portfólio Aurum.", f_title, STORY_W - 200)
    total_h = sum((f_title.getbbox(l)[3] - f_title.getbbox(l)[1]) + 18 for l in lines)
    y = (STORY_H - total_h) / 2
    draw_multiline_centered(draw, lines, f_title, GOLD, STORY_W, y, 18)
    save(img, "story-1-teaser.png")


def story2():
    # Reaproveita o Slide 3 (produto) e adapta para o formato de story.
    img = new_canvas(STORY_W, STORY_H)
    draw = ImageDraw.Draw(img)

    paste_rgba(img, molecule, STORY_W / 2, 720, target_w=420)

    f_title = font(TITLE_FONT, 70)
    title = "TG 60MG"
    w = draw.textlength(title, font=f_title)
    draw.text(((STORY_W - w) / 2, 1000), title, font=f_title, fill=GOLD)

    f_body = font(BODY_FONT, 40)
    body = (
        "À base de Tirzepatida, TG 60MG é a mais nova adição à linha de "
        "emagrecimento e metabolismo do portfólio Aurum Peptide."
    )
    lines = wrap_text(draw, body, f_body, STORY_W - 220)
    draw_multiline_centered(draw, lines, f_body, ICE_WHITE, STORY_W, 1150, 16)

    # rotulo estatico equivalente ao sticker "Veja no feed"
    f_tag = font(BODY_FONT, 30)
    tag = tracked("VEJA NO FEED", 1)
    w = draw.textlength(tag, font=f_tag)
    pad = 22
    box_w = w + pad * 2
    box_h = 64
    box_x0 = (STORY_W - box_w) / 2
    box_y0 = STORY_H - 380  # margem de seguranca acima da area de resposta do Instagram
    draw.rounded_rectangle(
        [box_x0, box_y0, box_x0 + box_w, box_y0 + box_h], radius=32,
        outline=GOLD, width=2,
    )
    draw.text((box_x0 + pad, box_y0 + (box_h - 34) / 2), tag, font=f_tag, fill=GOLD)

    save(img, "story-2-reveal.png")


def story3():
    img = new_canvas(STORY_W, STORY_H)
    paste_rgba(img, molecule, STORY_W / 2, STORY_H / 2, target_w=560, opacity=0.08)
    draw = ImageDraw.Draw(img)
    f_body = font(BODY_FONT, 46)
    text = (
        "Seriedade sobre o que vendemos. Sem exageros, sem promessas que não "
        "possamos sustentar."
    )
    lines = wrap_text(draw, text, f_body, STORY_W - 220)
    total_h = sum((f_body.getbbox(l)[3] - f_body.getbbox(l)[1]) + 22 for l in lines)
    y = (STORY_H - total_h) / 2
    draw_multiline_centered(draw, lines, f_body, ICE_WHITE, STORY_W, y, 22)
    save(img, "story-3-confianca.png")


def story4():
    # Fundo/copy finalizados. Os stickers nativos do Instagram (pergunta aberta
    # e link) sao elementos de interface da propria plataforma -- nao podem ser
    # "assados" num PNG estatico. Este arquivo entrega o fundo + a pergunta em
    # texto, pronto para o Publishing Manager encaixar os dois stickers nativos
    # por cima ao publicar (documentado em docs/design/pecas.md).
    img = new_canvas(STORY_W, STORY_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 56)
    lines = wrap_text(draw, "Dúvidas sobre o TG 60MG?", f_title, STORY_W - 200)
    y = 780
    y = draw_multiline_centered(draw, lines, f_title, GOLD, STORY_W, y, 16)

    f_body = font(BODY_FONT, 36)
    sub = "Deixe sua pergunta aqui nos stories."
    w = draw.textlength(sub, font=f_body)
    draw.text(((STORY_W - w) / 2, y + 30), sub, font=f_body, fill=ICE_WHITE)

    save(img, "story-4-cta.png")


if __name__ == "__main__":
    os.makedirs(FINAL, exist_ok=True)
    slide1()
    slide2()
    slide3()
    slide4()
    slide5()
    story1()
    story2()
    story3()
    story4()
