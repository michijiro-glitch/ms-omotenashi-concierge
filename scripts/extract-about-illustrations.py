"""Crop the 2x2 black board and the journal still life into transparent PNGs."""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/images/about"
ASSETS = Path(
    r"C:\Users\michi\.cursor\projects\c-Users-michi-src-ms-omotenashi-concierge\assets"
)

BOARD = ASSETS / "c__Users_michi_AppData_Roaming_Cursor_User_workspaceStorage_bf168c48d20d6469f492173c51b4732e_images_image-b2b754f3-de59-424c-b6c7-69c7dbdf59c9.jpg"
JOURNAL = ASSETS / "c__Users_michi_AppData_Roaming_Cursor_User_workspaceStorage_bf168c48d20d6469f492173c51b4732e_images_____-19151ea0-3871-4e3a-a12a-70efbe0a36ee.jpg"

# Tight boxes sitting in the black gutters of the 2x2 board.
BOXES = {
    # Do not write about-dog.png: About intro uses the terrace dining scene.
    "about-dining.png": (440, 8, 976, 376),
    "about-wine.png": (100, 392, 424, 676),
    "about-gifts.png": (440, 392, 976, 676),
}


def luminance(rgb):
    r, g, b = rgb[:3]
    return (r + g + b) / 3


def chroma(rgb):
    r, g, b = rgb[:3]
    return max(r, g, b) - min(r, g, b)


def flood_background(im):
    w, h = im.size
    px = im.load()
    bg = [[False] * w for _ in range(h)]
    q = deque()

    def is_board(rgb):
        return luminance(rgb) < 16 and chroma(rgb) < 14

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

    # Soft gray halo connected to the board, not colored paint.
    for _ in range(6):
        extra = []
        for y in range(h):
            for x in range(w):
                if bg[y][x]:
                    continue
                rgb = px[x, y]
                if luminance(rgb) > 48 or chroma(rgb) > 22:
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
            if not bg[y][x]:
                r, g, b = px[x, y][:3]
                opx[x, y] = (r, g, b, 255)

    alpha = out.split()[3].filter(ImageFilter.GaussianBlur(radius=0.8))
    r, g, b, _ = out.split()
    out = Image.merge("RGBA", (r, g, b, alpha))
    bbox = out.getbbox()
    if not bbox:
        return out
    pad = 6
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
    src = Image.open(BOARD).convert("RGB")
    src.save(OUT / "about-illustration-board.png", "PNG")
    for name, box in BOXES.items():
        piece = extract(src.crop(box))
        piece.save(OUT / name, "PNG")
        print(f"saved {name} {piece.size}")

    journal = extract(Image.open(JOURNAL).convert("RGB"))
    journal.save(OUT / "about-journal.png", "PNG")
    print(f"saved about-journal.png {journal.size}")


if __name__ == "__main__":
    main()
