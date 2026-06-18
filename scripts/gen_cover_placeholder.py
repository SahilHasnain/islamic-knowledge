from PIL import Image, ImageDraw, ImageFont
import os

w, h = 1039, 1513
img = Image.new("RGB", (w, h), "#0b3a2a")
draw = ImageDraw.Draw(img)

font_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/TTF/DejaVuSerif.ttf",
]
title_font = None
sub_font = None
for p in font_paths:
    if os.path.exists(p):
        title_font = ImageFont.truetype(p, 72)
        sub_font = ImageFont.truetype(p, 36)
        small_font = ImageFont.truetype(p, 24)
        break

if not title_font:
    title_font = ImageFont.load_default()
    sub_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

title = "Shifa Shareef"
bbox = draw.textbbox((0, 0), title, font=title_font)
tx = (w - (bbox[2] - bbox[0])) // 2
ty = h // 2 - 120
draw.text((tx, ty), title, fill="#dcb87a", font=title_font)

sub = "English Translation"
bbox = draw.textbbox((0, 0), sub, font=sub_font)
sx = (w - (bbox[2] - bbox[0])) // 2
sy = ty + 100
draw.text((sx, sy), sub, fill="#c8aeb0", font=sub_font)

author = "By Imam Qadi Iyad"
bbox = draw.textbbox((0, 0), author, font=sub_font)
ax = (w - (bbox[2] - bbox[0])) // 2
ay = sy + 70
draw.text((ax, ay), author, fill="#c8aeb0", font=sub_font)

pub = "Mustafawi Publishing"
bbox = draw.textbbox((0, 0), pub, font=small_font)
px = (w - (bbox[2] - bbox[0])) // 2
py = h - 120
draw.text((px, py), pub, fill="#8aa897", font=small_font)

out_dir = "D:/Projects/islamic-knowledge/publishing/shifa-shareef-english/assets"
os.makedirs(out_dir, exist_ok=True)
img.save(os.path.join(out_dir, "cover.png"))
print(f"Cover saved: {os.path.join(out_dir, 'cover.png')} ({w}x{h})")
