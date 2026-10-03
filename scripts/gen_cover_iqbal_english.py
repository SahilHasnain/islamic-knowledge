from PIL import Image, ImageDraw, ImageFont
import os

BOOKS = [
    {
        "project": "bal-e-jibreel-english",
        "title_lines": ["Bal-e-Jibreel"],
        "subtitle": "Poetic English Translation",
        "author": "Allama Muhammad Iqbal",
    },
    {
        "project": "zarb-e-kaleem-english",
        "title_lines": ["Zarb-e-Kaleem"],
        "subtitle": "Poetic English Translation",
        "author": "Allama Muhammad Iqbal",
    },
]

W, H = 1039, 1513
BG = "#0b3a2a"
GOLD = "#dcb87a"
MUTED = "#c8aeb0"
BORDER = "#5f8b75"

font_paths = [
    "C:/Windows/Fonts/times.ttf",
    "C:/Windows/Fonts/georgia.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
]


def load_fonts():
    bold_font = reg_font = small_font = None
    for p in font_paths:
        if os.path.exists(p):
            if bold_font is None:
                bold_font = ImageFont.truetype(p, 84)
            elif reg_font is None:
                reg_font = ImageFont.truetype(p, 54)
                small_font = ImageFont.truetype(p, 34)
    if not bold_font:
        bold_font = ImageFont.load_default()
        reg_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    return bold_font, reg_font, small_font


def center_x(img, draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return (img.width - (bbox[2] - bbox[0])) // 2


def generate(book):
    bold_font, reg_font, small_font = load_fonts()
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    margin = 96
    draw.rectangle([margin, margin, W - margin, H - margin], outline=BORDER, width=4)

    title_y = H // 2 - 120
    for line in book["title_lines"]:
        draw.text((center_x(img, draw, line, bold_font), title_y), line, fill=GOLD, font=bold_font)
        title_y += 105

    sub = book["subtitle"]
    draw.text((center_x(img, draw, sub, reg_font), title_y + 40), sub, fill=MUTED, font=reg_font)

    author = book["author"]
    draw.text((center_x(img, draw, author, small_font), title_y + 150), author, fill=MUTED, font=small_font)

    root = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "publishing", book["project"], "assets"))
    os.makedirs(root, exist_ok=True)
    out_path = os.path.join(root, "cover.png")
    img.save(out_path)
    print(f"Cover saved: {out_path}")


for book in BOOKS:
    generate(book)