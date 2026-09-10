"""Cut the static Bodoni Moda instances used by src/lib/fonts.ts.

Inputs are Google Fonts' Latin-subset variable files (fetch the URLs from
https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900
with a browser user agent). Requires: pip install fonttools brotli

    python scripts/instance-bodoni.py bodoni-var.woff2 bodoni-italic-var.woff2
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

normal, italic = sys.argv[1], sys.argv[2]
jobs = [
    (normal, {"wght": 500, "opsz": 28}, "src/fonts/BodoniModa-500-text.woff2"),
    (normal, {"wght": 500, "opsz": 84}, "src/fonts/BodoniModa-500-display.woff2"),
    (italic, {"wght": 500, "opsz": 84}, "src/fonts/BodoniModa-500-display-italic.woff2"),
]
for src, location, out in jobs:
    inst = instancer.instantiateVariableFont(TTFont(src), location, inplace=False, updateFontNames=False)
    inst.flavor = "woff2"
    inst.save(out)
    print(out)
