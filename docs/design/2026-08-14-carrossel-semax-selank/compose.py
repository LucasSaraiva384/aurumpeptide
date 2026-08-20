# -*- coding: utf-8 -*-
"""Compositor do carrossel educacional "Duas moleculas. Duas perguntas sobre
a mente humana." (Semax vs. Selank), 6 paginas, 1080x1350 (4:5).

Reaproveita o MESMO sistema visual dos carrosseis TG 60mg (2026-07-28) e
"Evidencia nao e igual para todos" (2026-08-12): mesmo fundo institucional
(bg-gemini-01.png), mesma tipografia (Georgia serif / Segoe UI sans), mesmo
recorte oficial da molecula/lockup (nunca redesenhada, sempre derivada de
assets/logo-oficial*.png).

Excecao desta peca: a Pagina 1 (capa) usa um elemento grafico NOVO, gerado
via OpenAI (gpt-image-1) por pedido explicito do usuario -- um cerebro
estilizado em tracos/nos geometricos dourados, nunca anatomico/realista,
gerado ja sobre o proprio sistema de fundo institucional (verde profundo,
gradiente radial suave, glow inferior sutil, textura canvas), servindo como
base completa da capa. Titulo, subtitulo e lockup sao compostos por script
por cima dessa base, como em todas as demais paginas.

Ver docs/design/pecas.md para o log completo desta entrega.
"""
import os
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"
RAW = os.path.join(REPO, "docs", "design", "2026-08-14-carrossel-semax-selank", "raw")
FINAL = os.path.join(REPO, "docs", "design", "2026-08-14-carrossel-semax-selank", "final")
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


def bottom_align_resize(img, w, h):
    """Como cover_resize, mas ancora o recorte na base da imagem em vez de
    centralizar verticalmente. Usado na capa para preservar o maximo de
    espaco calmo abaixo do motivo grafico do cerebro (que a IA posicionou
    proximo ao centro/topo da imagem gerada), garantindo respiro suficiente
    para o bloco de texto no rodape da pagina."""
    ratio = w / img.width
    new_w = w
    new_h = int(img.height * ratio)
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    top = max(0, new_h - h)
    return resized.crop((0, top, new_w, top + h))


def load_base(w, h):
    base = Image.open(os.path.join(RAW, "bg-gemini-01-reused.png")).convert("RGB")
    return cover_resize(base, w, h)


def load_capa_base(w, h):
    base = Image.open(os.path.join(RAW, "capa-cerebro-openai-01.png")).convert("RGB")
    return bottom_align_resize(base, w, h)


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
def pagina1():
    img = load_capa_base(FEED_W, FEED_H).convert("RGBA")
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title_lines = wrap_text(
        draw, "Duas moléculas. Duas perguntas sobre a mente humana.", f_title, FEED_W - 160
    )

    f_sub = font(BODY_FONT_LIGHT, 28)
    sub_lines = wrap_text(
        draw,
        "O que a ciência estuda sobre Semax e Selank — peptídeos russos.",
        f_sub,
        FEED_W - 210,
    )

    lockup_w = 210
    lockup_h = lockup_w * lockup.height / lockup.width

    title_h = block_height(title_lines, f_title, 12)
    sub_h = block_height(sub_lines, f_sub, 10)
    gap_title_sub = 22
    gap_sub_lockup = 34
    # bottom_margin reduzido de 70 para 45 de proposito: abre ~25px extras de
    # respiro entre o motivo do cerebro e o titulo (ajuste feito apos checagem
    # visual da primeira renderizacao, onde o titulo ficava colado ao caule
    # do cerebro).
    bottom_margin = 45

    block_h = title_h + gap_title_sub + sub_h + gap_sub_lockup + lockup_h
    y = FEED_H - bottom_margin - block_h

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += gap_title_sub
    y = draw_multiline_centered(draw, sub_lines, f_sub, ICE_WHITE, FEED_W, y, 10)
    y += gap_sub_lockup

    lockup_cy = y + lockup_h / 2
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
        "Entre os peptídeos estudados por sua relação com o sistema nervoso central, dois nomes aparecem com frequência na literatura científica russa: Semax e Selank.",
        "Este é um conteúdo puramente educacional, sobre o que a pesquisa científica registra até hoje.",
    ]
    max_w = FEED_W - 220
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
# PAGINA 3 -- Semax
# ---------------------------------------------------------------------------
def pagina3():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title = "Semax — o que a evidência mostra"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 160)
    y = 90
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 44

    f_body = font(BODY_FONT, 30)
    paras = [
        "Heptapeptídeo sintético desenvolvido na Rússia, estruturalmente relacionado a um fragmento do hormônio ACTH.",
        "Em modelos animais, foi estudado por sua relação com a expressão de BDNF e com os sistemas dopaminérgico e serotoninérgico.",
        "Em humanos, os estudos clínicos localizados — publicados em periódico científico russo, indexados no PubMed — avaliaram Semax em contexto de AVC isquêmico e reabilitação neurológica, não em desfechos de ansiedade.",
        "Os resumos disponíveis desses estudos não confirmam randomização nem controle por placebo.",
    ]
    max_w = FEED_W - 200
    body_lines = []
    for i, p in enumerate(paras):
        body_lines += wrap_text(draw, p, f_body, max_w)
        if i < len(paras) - 1:
            body_lines.append("")

    body_h = block_height(body_lines, f_body, 14)
    remaining = FEED_H - y - 80
    start_y = y + max(0, (remaining - body_h) / 2)
    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, start_y, 14)

    save(img, "pagina-3-semax.png")


# ---------------------------------------------------------------------------
# PAGINA 4 -- Selank
# ---------------------------------------------------------------------------
def pagina4():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title = "Selank — o que a evidência mostra"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 160)
    y = 90
    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 12)
    y += 44

    f_body = font(BODY_FONT, 30)
    paras = [
        "Heptapeptídeo sintético russo, análogo da tuftsina — peptídeo natural do sistema imunológico.",
        "Em modelos animais, foi associado à modulação de genes ligados à neurotransmissão GABAérgica.",
        "Em humanos, o principal estudo clínico localizado — também publicado em periódico científico russo, indexado no PubMed — avaliou Selank em pacientes com transtorno de ansiedade generalizada e neurastenia, comparado a um ansiolítico já estabelecido, com efeitos relatados como semelhantes.",
        "Também aqui, o resumo disponível não confirma desenho duplo-cego nem controle por placebo.",
    ]
    max_w = FEED_W - 200
    body_lines = []
    for i, p in enumerate(paras):
        body_lines += wrap_text(draw, p, f_body, max_w)
        if i < len(paras) - 1:
            body_lines.append("")

    body_h = block_height(body_lines, f_body, 14)
    remaining = FEED_H - y - 80
    start_y = y + max(0, (remaining - body_h) / 2)
    draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, start_y, 14)

    save(img, "pagina-4-selank.png")


# ---------------------------------------------------------------------------
# PAGINA 5 -- Comparacao: duas rotas, uma origem em comum
# ---------------------------------------------------------------------------
def pagina5():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 46)
    title = "Duas rotas de pesquisa, uma origem em comum"
    title_lines = wrap_text(draw, title, f_title, FEED_W - 160)
    top_y = 84
    title_bottom = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, top_y, 12)

    f_name = font(TITLE_FONT_BOLD, 36)
    f_item = font(BODY_FONT, 29)

    col_gap = 46
    col_w = (FEED_W - 180 - col_gap) / 2
    left_x = 90
    right_x = left_x + col_w + col_gap

    semax_body = "Histórico de pesquisa clínica em recuperação neurológica e foco."
    selank_body = "Histórico de pesquisa clínica em ansiedade e neurastenia."

    semax_lines = wrap_text(draw, semax_body, f_item, col_w)
    selank_lines = wrap_text(draw, selank_body, f_item, col_w)

    name_h = line_height(f_name, "Semax", 14)
    semax_h = name_h + block_height(semax_lines, f_item, 12)
    selank_h = name_h + block_height(selank_lines, f_item, 12)
    cols_h = max(semax_h, selank_h)

    f_body2 = font(BODY_FONT, 32)
    closing = (
        "Essa diferença está no que cada um foi estudado para fazer em humanos, "
        "não numa separação completa de mecanismo: os dois compartilham, ao "
        "menos em parte, o mesmo mecanismo estudado — a inibição de uma "
        "enzima que degrada encefalinas no organismo."
    )
    closing_lines = wrap_text(draw, closing, f_body2, FEED_W - 200)
    closing_h = block_height(closing_lines, f_body2, 18)

    f_footer = font(BODY_FONT_LIGHT, 20)
    footer = (
        "Fonte: estudos publicados em periódicos científicos russos, indexados "
        "no PubMed/NIH; resumos disponíveis não confirmam desenho duplo-cego/"
        "placebo-controlado. Registro completo de referências: "
        "docs/pesquisa/cientifico.md."
    )
    footer_lines = wrap_text(draw, footer, f_footer, FEED_W - 260)
    fh = block_height(footer_lines, f_footer, 6)
    footer_y = FEED_H - 70 - fh

    # Centraliza verticalmente o bloco (colunas + paragrafo de fechamento) no
    # espaco disponivel entre o titulo e o rodape de fonte -- mesmo ajuste ja
    # aplicado na Pagina 4 do carrossel de 12/08, para evitar vao vazio no
    # meio da pagina detectado na primeira renderizacao desta peca.
    gap_title_cols = 70
    gap_cols_closing = 64
    content_h = cols_h + gap_cols_closing + closing_h
    available_top = title_bottom + gap_title_cols
    available_bottom = footer_y - 50
    y = available_top + max(0, (available_bottom - available_top - content_h) / 2)

    # elemento de conexao sutil: linha + no dourado entre os dois blocos
    connector_y = y + cols_h / 2
    draw.line(
        [(left_x + col_w + 8, connector_y), (right_x - 8, connector_y)],
        fill=GOLD_DIM,
        width=2,
    )
    node_r = 5
    draw.ellipse(
        [
            FEED_W / 2 - node_r,
            connector_y - node_r,
            FEED_W / 2 + node_r,
            connector_y + node_r,
        ],
        fill=GOLD,
    )

    draw.text((left_x, y), "Semax", font=f_name, fill=GOLD)
    ty = y + name_h
    for line in semax_lines:
        draw.text((left_x, ty), line, font=f_item, fill=ICE_WHITE)
        ty += line_height(f_item, line, 12)

    draw.text((right_x, y), "Selank", font=f_name, fill=GOLD)
    ty = y + name_h
    for line in selank_lines:
        draw.text((right_x, ty), line, font=f_item, fill=ICE_WHITE)
        ty += line_height(f_item, line, 12)

    y += cols_h + gap_cols_closing
    draw_multiline_centered(draw, closing_lines, f_body2, ICE_WHITE, FEED_W, y, 18)

    draw_multiline_centered(draw, footer_lines, f_footer, GOLD_DIM, FEED_W, footer_y, 6)

    save(img, "pagina-5-comparacao.png")


# ---------------------------------------------------------------------------
# PAGINA 6 -- Disclaimer / fechamento
# ---------------------------------------------------------------------------
def pagina6():
    img = new_canvas(FEED_W, FEED_H)
    draw = ImageDraw.Draw(img)

    f_title = font(TITLE_FONT, 52)
    title_lines = wrap_text(draw, "Antes de qualquer conclusão", f_title, FEED_W - 180)

    f_body = font(BODY_FONT, 30)
    body1 = (
        "Semax e Selank não são aprovados pela FDA nem pela ANVISA. Na "
        "Rússia, ambos são registrados como medicamento de prescrição — uma "
        "informação de contexto sobre seu uso local, não uma validação "
        "regulatória no Brasil."
    )
    body2 = (
        "Este conteúdo é informativo. Não é indicação de uso, não é "
        "orientação de aplicação, e não substitui avaliação de profissional "
        "de saúde habilitado."
    )
    body3 = "A ciência sobre os dois segue em construção. Vale conhecê-la — não tratá-la como verdade fechada."
    body4 = "O que mais te chamou atenção nessa comparação? Conta pra gente nos comentários."

    max_w = FEED_W - 200
    body_lines = []
    for i, p in enumerate([body1, body2, body3, body4]):
        body_lines += wrap_text(draw, p, f_body, max_w)
        if i < 3:
            body_lines.append("")

    lockup_w = 260
    lockup_h = lockup_w * lockup.height / lockup.width

    title_h = block_height(title_lines, f_title, 14)
    body_h = block_height(body_lines, f_body, 16)
    gap1 = 44
    gap2 = 56
    total_h = title_h + gap1 + body_h + gap2 + lockup_h
    y = (FEED_H - total_h) / 2

    y = draw_multiline_centered(draw, title_lines, f_title, GOLD, FEED_W, y, 14)
    y += gap1
    y = draw_multiline_centered(draw, body_lines, f_body, ICE_WHITE, FEED_W, y, 16)
    y += gap2

    lockup_cy = y + lockup_h / 2
    paste_rgba(img, lockup, FEED_W / 2, lockup_cy, target_w=lockup_w)

    save(img, "pagina-6-fechamento.png")


if __name__ == "__main__":
    os.makedirs(FINAL, exist_ok=True)
    pagina1()
    pagina2()
    pagina3()
    pagina4()
    pagina5()
    pagina6()
