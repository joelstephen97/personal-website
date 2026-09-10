import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { site } from "@/lib/site";

const WIDTH = 1200;
const HEIGHT = 630;
// Raw hex/rgba, not `var(--...)`, is the deliberate exception to the "no
// raw hex" rule here: Satori (the renderer `next/og`'s `ImageResponse` is
// built on) renders this JSX in an isolated context with no access to the
// page's CSS custom properties — `background: "var(--metal-champagne)"`
// would just fail to resolve to a color at all. These four literals are
// the resolved dark-theme values of `surface.ground` (obsidian),
// `metal.champagne` / `metal.champagne.line` (champagne / its line
// variant), and `stone.300` (the URL caption) from `tokens/*.json` —
// copied by value, not derived, so if those tokens ever change this file
// needs a manual re-sync.
const OBSIDIAN = "#0B0C0F";
const CHAMPAGNE = "#C9A961";
const CHAMPAGNE_LINE = "rgba(201,169,97,0.42)";
const STONE_2 = "#A9A69E";

// `public/fonts/Newsreader-500.ttf` and `Cinzel-500.ttf` are static
// weight-500 instances, generated once locally with fontTools —
// `python -m fontTools.varLib.instancer Newsreader[opsz,wght].ttf
// opsz=60 wght=500 -o Newsreader-500.ttf` (and the wght-only equivalent
// for Cinzel) — from the variable TTFs Google Fonts publishes for both
// families (neither ships a static per-weight build). Fix round 1:
// Satori (the renderer `next/og`'s `ImageResponse` is built on) doesn't
// reliably parse a variable-axis TTF directly — passing either
// family's variable file crashed the server on every request
// (`TypeError: Cannot read properties of undefined`, reproduced with
// each font isolated). A static instance has no `fvar` table, and
// Satori renders it correctly. `readFont` still degrades to `null` (and
// the JSX below falls back to Georgia) if a font file is ever missing
// or fails to load at runtime, rather than 500ing the route.
function readFont(fileName: string): Buffer | null {
  try {
    return readFileSync(join(process.cwd(), "public", "fonts", fileName));
  } catch {
    return null;
  }
}

const newsreaderFont = readFont("Newsreader-500.ttf");
const cinzelFont = readFont("Cinzel-500.ttf");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? site.name;
  const label = searchParams.get("label") ?? site.title;

  const fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"] = [];
  if (newsreaderFont) {
    fonts.push({ name: "Newsreader", data: newsreaderFont, weight: 500, style: "normal" });
  }
  if (cinzelFont) {
    fonts.push({ name: "Cinzel", data: cinzelFont, weight: 500, style: "normal" });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        background: OBSIDIAN,
        padding: "80px 96px",
        fontFamily: newsreaderFont ? "Newsreader" : "Georgia",
      }}
    >
      {/* Decorative static sunburst: a radial gradient plus a ring of
            absolutely-positioned hairlines standing in for a guilloché
            pattern (ImageResponse's Satori renderer has no canvas). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: "radial-gradient(circle at 82% 50%, rgba(201,169,97,0.16), transparent 55%)",
        }}
      />
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "82%",
            top: "50%",
            width: "620px",
            height: "1px",
            background: "rgba(201,169,97,0.08)",
            transform: `rotate(${(i * 360) / 24}deg)`,
            transformOrigin: "0 0",
          }}
        />
      ))}

      <span
        style={{
          display: "flex",
          fontFamily: cinzelFont ? "Cinzel" : "Georgia",
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          fontSize: 22,
          fontWeight: 500,
          color: CHAMPAGNE,
        }}
      >
        {label}
      </span>

      <div
        style={{
          display: "flex",
          width: 120,
          height: 1,
          background: CHAMPAGNE_LINE,
          margin: "28px 0",
        }}
      />

      <span
        style={{
          display: "flex",
          fontFamily: newsreaderFont ? "Newsreader" : "Georgia",
          fontSize: 64,
          lineHeight: 1.08,
          color: "#ECE9E2",
          maxWidth: 920,
        }}
      >
        {title}
      </span>

      <span
        style={{
          display: "flex",
          marginTop: 40,
          fontFamily: "Georgia",
          fontSize: 22,
          color: STONE_2,
        }}
      >
        {site.url.replace("https://", "")}
      </span>
    </div>,
    { width: WIDTH, height: HEIGHT, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
