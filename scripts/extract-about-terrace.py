"""Inset square crop of the terrace scene for a CSS circular frame.

The square stays inside the painted area so border-radius: 50% never
hits the black vignette. Saved opaque (no alpha) to avoid a dark halo.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/images/about"
SRC = Path(
    r"C:\Users\michi\.cursor\projects\c-Users-michi-src-ms-omotenashi-concierge\assets"
    r"\c__Users_michi_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"bf168c48d20d6469f492173c51b4732e_images_aboutM______-eef1c714-e6b8-4aa4-80c8-fb9c4dc90266.jpg"
)

# Almost full-frame circle: only a slight inset from the short edges
# so the CSS circular mask misses the painted black vignette corners.
CX, CY, RADIUS = 512, 341, 330


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC).convert("RGB")
    square = src.crop((CX - RADIUS, CY - RADIUS, CX + RADIUS, CY + RADIUS))
    dest = OUT / "about-terrace.png"
    square.save(dest, "PNG", optimize=True)
    print(f"saved {dest.name} {square.size} mode={square.mode}")


if __name__ == "__main__":
    main()
