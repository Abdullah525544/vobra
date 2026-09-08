"""
Compress product images for the web.
Source: C:\\Users\\The Best\\Pictures\\WEB\\
Output: <project>\\public\\images\\
"""
import os
from PIL import Image
import sys

SRC = r"C:\Users\The Best\Pictures\WEB"
DST = r"C:\Users\The Best\Pictures\WEB\delisoga-store\public\images"

# Map: (source_filename, output_name, target_max_width, quality)
# We target 1600px for hero / 1200px for lifestyle / 1000px for product detail.
PLAN = [
    # Hero (horizontal, full product on marble) — landscape, wide
    ("Glass_jar_on_marble_surface_2K_202609072327.jpeg", "hero-jar.jpg", 1800, 82),

    # Product main — vertical, marble counter
    ("Photographing_glass_jar_with_straw_2K_202609072327.jpeg", "product-main.jpg", 1400, 84),

    # Lid close-up — feature shot
    ("Glass_jar_with_bamboo_lid_2K_202609072327.jpeg", "feature-lid.jpg", 1200, 84),

    # Drink lifestyle (juice)
    ("Glass_jar_with_orange_juice_2K_202609072328.jpeg", "lifestyle-juice.jpg", 1200, 84),

    # Woman in kitchen (home)
    ("Woman_holding_glass_jar_2K_202609072327.jpeg", "lifestyle-kitchen.jpg", 1200, 84),

    # Man at desk (office)
    ("Man_drinking_from_glass_jar_2K_202609072328.jpeg", "lifestyle-desk.jpg", 1200, 84),

    # Packaging / what's in the box
    ("797415939_1796016518405430_2787467845509152050_n.jpg", "packaging.jpg", 1200, 84),

    # Product detail alt
    ("794166055_2292922451482260_4484272922472869732_n.jpg", "product-alt-1.jpg", 1100, 84),
    ("793899946_2112113646856718_5725165634043803623_n.jpg", "product-alt-2.jpg", 1100, 84),
    ("794946607_1059750686902446_3548329459560219995_n.jpg", "product-alt-3.jpg", 1100, 84),
]


def compress(src_path, dst_path, max_w, quality):
    img = Image.open(src_path)
    # Convert palette / RGBA safely
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    # Resize keeping aspect ratio
    w, h = img.size
    if w > max_w:
        new_h = int(h * (max_w / w))
        img = img.resize((max_w, new_h), Image.LANCZOS)
    # Save as JPEG with optimization
    img.save(dst_path, "JPEG", quality=quality, optimize=True, progressive=True)
    return os.path.getsize(dst_path)


def main():
    os.makedirs(DST, exist_ok=True)
    for src_name, out_name, max_w, q in PLAN:
        src_path = os.path.join(SRC, src_name)
        if not os.path.exists(src_path):
            print(f"!! missing source: {src_path}")
            continue
        dst_path = os.path.join(DST, out_name)
        try:
            size = compress(src_path, dst_path, max_w, q)
            print(f"OK  {out_name:24s}  {size/1024:7.1f} KB")
        except Exception as e:
            print(f"!!  {out_name}  {e}")
    print("done.")


if __name__ == "__main__":
    main()
