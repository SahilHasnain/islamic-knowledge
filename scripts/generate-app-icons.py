from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "icon.png"
PUBLIC_ICONS = ROOT / "public" / "icons"
ANDROID_RES = ROOT / "mobile" / "twa" / "app" / "src" / "main" / "res"

source = Image.open(SOURCE).convert("RGBA")


def save(image: Image.Image, path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)


save(source, PUBLIC_ICONS / "icon-192.png", 192)
save(source, PUBLIC_ICONS / "icon-512.png", 512)
save(source, ROOT / "mobile" / "twa" / "store_icon.png", 512)

# Keep the complete mark inside Android's adaptive-icon safe zone.
maskable = Image.new("RGBA", (512, 512), "#fbf8f1")
mark = source.resize((358, 358), Image.Resampling.LANCZOS)
maskable.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
save(maskable, PUBLIC_ICONS / "icon-maskable-512.png", 512)

# Bubblewrap's bundled launcher and maskable assets are local Android resources.
for density, size in {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}.items():
    save(source, ANDROID_RES / f"mipmap-{density}" / "ic_launcher.png", size)
    save(maskable, ANDROID_RES / f"mipmap-{density}" / "ic_maskable.png", size)
