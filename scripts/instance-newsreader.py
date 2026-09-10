"""Cut the static Newsreader instances used by src/lib/fonts.ts.

Inputs are Google Fonts' Latin-subset variable files (fetch the URLs from
https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700
with a browser user agent). Requires: pip install fonttools brotli

    python scripts/instance-newsreader.py newsreader-var.woff2 newsreader-italic-var.woff2

Weight 500, optical size 32 (a text-leaning cut so headings stay sturdy on
phones), subset to Latin-1 plus the punctuation the site uses.
"""
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022, 0x2192, 0x00B7, 0x2212]
)

def cut(src: str, out: str) -> None:
    font = instancer.instantiateVariableFont(TTFont(src), {"wght": 500, "opsz": 32}, inplace=False, updateFontNames=False)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(out)
    print(out)

cut(sys.argv[1], "src/fonts/Newsreader-500.woff2")
cut(sys.argv[2], "src/fonts/Newsreader-500-italic.woff2")
