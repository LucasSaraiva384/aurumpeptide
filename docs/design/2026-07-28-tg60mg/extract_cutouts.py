"""Extrai recortes RGBA (fundo transparente) da molecula e do lockup oficiais,
usando deteccao de cor (dourado / branco) para separar do fundo verde escuro.
Nunca redesenha a molecula -- so isola pixels do arquivo oficial existente.
"""
import numpy as np
from PIL import Image

REPO = r"C:\Users\Lucas Saraiva\Desktop\Projeto Aurum"


def extract(path_in, path_out, include_white=False, pad_ratio=0.06):
    im = Image.open(path_in).convert("RGB")
    arr = np.array(im).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    gold_mask = (r > 55) & (r - b > 25)
    mask = gold_mask.copy()
    if include_white:
        white_mask = (r > 140) & (g > 140) & (b > 140)
        mask = mask | white_mask

    alpha = (mask * 255).astype(np.uint8)

    rgba = np.dstack([arr.astype(np.uint8), alpha])
    out = Image.fromarray(rgba, mode="RGBA")

    ys, xs = np.where(mask)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    w, h = x1 - x0, y1 - y0
    pad_x = int(w * pad_ratio)
    pad_y = int(h * pad_ratio)
    x0 = max(0, x0 - pad_x)
    y0 = max(0, y0 - pad_y)
    x1 = min(out.width, x1 + pad_x)
    y1 = min(out.height, y1 + pad_y)

    cropped = out.crop((x0, y0, x1, y1))
    cropped.save(path_out)
    print(path_out, cropped.size)


if __name__ == "__main__":
    extract(
        f"{REPO}\\assets\\logo-oficial.png",
        f"{REPO}\\docs\\design\\2026-07-28-tg60mg\\raw\\molecule-cutout.png",
        include_white=False,
    )
    extract(
        f"{REPO}\\assets\\logo-oficial-com-nome.png",
        f"{REPO}\\docs\\design\\2026-07-28-tg60mg\\raw\\lockup-cutout.png",
        include_white=True,
    )
