"""Crop the La Maison house restaurant from the transparent 4-pack."""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/images/about"
SRC = Path(
    r"C:\Users\michi\.cursor\projects\c-Users-michi-src-ms-omotenashi-concierge\assets"
    r"\c__Users_michi_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"bf168c48d20d6469f492173c51b4732e_images______-82a1f86c-5cef-415c-b613-0a13c87b07c2.jpg"
)

# Tight box around the top-right house (gap from tea set is ~x=660).
HOUSE_BOX = (668, 28, 1016, 458)


def luminance(rgb):
    r, g, b = rgb[:3]
    return (r + g + b) / 3


def chroma(rgb):
    r, g, b = rgb[:3]
    return max(r, g, b) - min(r, g, b)


def is_board(rgb):
    # Flattened checkerboard / near-white paper around the watercolor.
    return luminance(rgb) > 236 and chroma(rgb) < 16


def flood_background(im):
    w, h = im.size
    px = im.load()
    bg = [[False] * w for _ in range(h)]
    q = deque()

    def push(x, y):
        if 0 <= x < w and 0 <= y < h and not bg[y][x] and is_board(px[x, y]):
            bg[y][x] = True
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    # Soft paper halo connected to the board, not painted stone or foliage.
    for _ in range(8):
        extra = []
        for y in range(h):
            for x in range(w):
                if bg[y][x]:
                    continue
                rgb = px[x, y]
                if luminance(rgb) < 220 or chroma(rgb) > 22:
                    continue
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and bg[ny][nx]:
                        extra.append((x, y))
                        break
        if not extra:
            break
        for x, y in extra:
            bg[y][x] = True
    return bg


def extract(im):
    bg = flood_background(im)
    w, h = im.size
    px = im.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                continue
            r, g, b = px[x, y][:3]
            # Feather near-paper edge pixels so no white rectangle remains.
            lum = luminance((r, g, b))
            ch = chroma((r, g, b))
            if lum > 228 and ch < 18:
                t = min(1.0, (255 - lum) / 22)
                alpha = int(255 * t)
            else:
                alpha = 255
            opx[x, y] = (r, g, b, alpha)

    alpha = out.split()[3].filter(ImageFilter.GaussianBlur(radius=0.7))
    r, g, b, _ = out.split()
    out = Image.merge("RGBA", (r, g, b, alpha))
    bbox = out.getbbox()
    if not bbox:
        return out
    pad = 4
    left, top, right, bottom = bbox
    return out.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(w, right + pad),
            min(h, bottom + pad),
        )
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC).convert("RGB")
    piece = extract(src.crop(HOUSE_BOX))
    dest = OUT / "about-restaurant-house.png"
    piece.save(dest, "PNG")
    print(f"saved {dest.name} {piece.size} mode={piece.mode}")

    # Preview composites for visual QA (not used by the site).
    preview_dir = OUT / "_preview"
    preview_dir.mkdir(exist_ok=True)
    for name, color in (("house-cream", (244, 239, 230, 255)), ("house-magenta", (255, 0, 220, 255))):
        bg = Image.new("RGBA", piece.size, color)
        bg.alpha_composite(piece)
        bg.convert("RGB").save(preview_dir / f"{name}.png", "PNG")


if __name__ == "__main__":
    main()
