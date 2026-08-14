from PIL import Image, ImageDraw, ImageFont
import os

w, h = 1039, 1513
img = Image.new("RGB", (w, h), "#0b3a2a")
draw = ImageDraw.Draw(img)

font_paths = [
    "C:/Windows/Fonts/times.ttf",
    "C:/Windows/Fonts/georgia.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
]
bold_font = None
reg_font = None
small_font = None
for p in font_paths:
    if os.path.exists(p):
        if bold_font is None:
            bold_font = ImageFont.truetype(p, 96)
        elif reg_font is None:
            reg_font = ImageFont.truetype(p, 72)
            small_font = ImageFont.truetype(p, 30)

if not bold_font:
    bold_font = ImageFont.load_default()
    reg_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Title
lines = ["The Power of", "the Last Prophet"]
title_y = h // 2 - 180
for line in lines:
    bbox = draw.textbbox((0, 0), line, font=bold_font)
    tx = (w - (bbox[2] - bbox[0])) // 2
    draw.text((tx, title_y), line, fill="#dcb87a", font=bold_font)
    title_y += 120

# Subtitle
sub = "English Translation"
bbox = draw.textbbox((0, 0), sub, font=reg_font)
sx = (w - (bbox[2] - bbox[0])) // 2
sy = title_y + 40
draw.text((sx, sy), sub, fill="#c8aeb0", font=reg_font)

# Author
author = "Imran Raza Attari"
bbox = draw.textbbox((0, 0), author, font=reg_font)
ax = (w - (bbox[2] - bbox[0])) // 2
ay = sy + 80
draw.text((ax, ay), author, fill="#c8aeb0", font=reg_font)

out_dir = os.path.join(os.path.dirname(__file__), "..", "publishing", "ikhteyarate-mustafa-english", "assets")
out_dir = os.path.normpath(out_dir)
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "cover.png")
img.save(out_path)
print(f"Cover saved: {out_path}")
