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
for src, out in [(normal, "src/fonts/BodoniModa-500.woff2"), (italic, "src/fonts/BodoniModa-500-italic.woff2")]:
    font = TTFont(src)
    inst = instancer.instantiateVariableFont(font, {"wght": 500, "opsz": 60}, inplace=False, updateFontNames=False)
    inst.flavor = "woff2"
    inst.save(out)
    print(out)
