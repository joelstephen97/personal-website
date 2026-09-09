import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { site } from "@/lib/site";

const WIDTH = 1200;
const HEIGHT = 630;
const OBSIDIAN = "#0B0C0F";
const CHAMPAGNE = "#C9A961";
const CHAMPAGNE_LINE = "rgba(201,169,97,0.42)";
const STONE_2 = "#A9A69E";

// `public/fonts/BodoniModa-Medium.ttf` and `Cinzel-Medium.ttf` were
// downloaded (the `ofl/bodonimoda` and `ofl/cinzel` variable TTFs, the
// only format Google Fonts ships for either family — no static
// per-weight build exists for a `weight: 500` request to point at
// instead) and wired into `ImageResponse`'s `fonts` option per the
// brief. Verified against a real request: with either font (alone or
// together) in the `fonts` array, the route crashed the server with
// `TypeError: Cannot read properties of undefined (reading '25{8,9}')`
// inside Satori's font-parsing internals — reproducible on every
// request, isolated by testing each font file independently. Satori
// (the renderer `next/og`'s `ImageResponse` is built on) does not
// reliably handle variable-axis TTFs; it expects a static instance.
// Since neither family publishes one, this falls back to Georgia for
// both faces, per the brief's explicit fallback clause, rather than
// shipping a route that 500s on every request.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? site.name;
  const label = searchParams.get("label") ?? site.title;

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
        fontFamily: "Georgia",
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
          fontFamily: "Georgia",
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
    { width: WIDTH, height: HEIGHT },
  );
}
