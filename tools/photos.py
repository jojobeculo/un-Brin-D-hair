"""Prépare une photo pour le site : versions AVIF et WebP en plusieurs largeurs.

Usage : python3 tools/photos.py <photo source> <nom>
Exemple : python3 tools/photos.py ~/Images/sandy-vitrine.jpg sandy-salon
Résultat : assets/img/photos/<nom>-<largeur>.avif et .webp, plus <nom>.json (largeurs et proportions).
Nécessite Pillow (pip install pillow).
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

WIDTHS = (480, 960, 1440)
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'photos'


def main(source, name):
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    OUT.mkdir(parents=True, exist_ok=True)
    widths = [w for w in WIDTHS if w < image.width] + [min(image.width, WIDTHS[-1])]
    widths = sorted(set(widths))
    for width in widths:
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.LANCZOS)
        resized.save(OUT / f'{name}-{width}.avif', quality=55)
        resized.save(OUT / f'{name}-{width}.webp', quality=78, method=6)
    info = {'widths': widths, 'ratio': round(image.width / image.height, 4)}
    (OUT / f'{name}.json').write_text(json.dumps(info))
    print(name, info)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
