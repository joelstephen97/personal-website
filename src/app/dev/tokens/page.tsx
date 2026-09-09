import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ramps, resolve } from "@/lib/tokens";
import { ease, spring } from "@/lib/motion";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Callout } from "@/components/ui/Callout";
import { KeyCap } from "@/components/ui/KeyCap";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Tooltip } from "@/components/ui/Tooltip";
import { ReadingDial } from "@/components/movement/ReadingDial";
import { DateWindow } from "@/components/movement/DateWindow";
import { Guilloche } from "@/components/movement/Guilloche";
import { ComplicationDrawer } from "@/components/movement/ComplicationDrawer";
import { TokensClient, CasebackClient } from "./TokensClient";

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

const RAMP_ORDER = [
  "stone",
  "steel",
  "champagne",
  "success",
  "warning",
  "error",
  "violet",
] as const;

// Mirrors `tokens/semantic.tokens.json`'s flattened leaf paths (see the
// "Semantic (dark / light)" line in the global constraints doc) — the
// module only exports the raw tree plus `resolve()`, not a flattened list,
// so the reference page owns its own read order here.
const SEMANTIC_NAMES = [
  "surface.ground",
  "surface.raised",
  "surface.sunken",
  "surface.pressed",
  "surface.inverse",
  "text.primary",
  "text.secondary",
  "text.muted",
  "text.inverse",
  "text.on-accent",
  "text.link",
  "border.subtle",
  "border.default",
  "border.strong",
  "border.focus",
  "accent.default",
  "accent.hover",
  "accent.active",
  "accent.soft",
  "metal.champagne",
  "metal.champagne.line",
  "metal.champagne.soft",
  "status.success",
  "status.warning",
  "status.error",
  "glass.bg",
  "glass.line",
  "glass.highlight",
  "glass.hud",
  "code.keyword",
  "code.string",
  "code.number",
  "code.function",
  "code.comment",
] as const;

const EASE_CURVES = [
  { name: "outExpo", points: ease.outExpo },
  { name: "inOut", points: ease.inOut },
  { name: "mechanical", points: ease.mechanical },
] as const;

const SPRINGS = Object.entries(spring) as Array<
  [string, { stiffness: number; damping: number; mass: number }]
>;

const TYPE_SPECIMENS = [
  {
    name: "display",
    sample: "Joel Stephen",
    font: "font-display",
    size: "text-[clamp(2.75rem,1.6rem+4.4vw,5.25rem)] leading-[1.0]",
  },
  {
    name: "h1",
    sample: "Full-Stack & AI Product Engineer",
    font: "font-display",
    size: "text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]",
  },
  {
    name: "h2",
    sample: "Design tokens, resolved",
    font: "font-display",
    size: "text-[clamp(1.875rem,1.4rem+1.6vw,2.625rem)] leading-[1.08]",
  },
  {
    name: "h3",
    sample: "One source of truth",
    font: "font-display",
    size: "text-[clamp(1.375rem,1.2rem+.6vw,1.875rem)] leading-[1.1]",
  },
  {
    name: "lead",
    sample: "Built on Yjs, now a custom conflict-resolution engine to handle scale.",
    font: "font-sans",
    size: "text-[clamp(1.0625rem,1rem+.3vw,1.1875rem)] leading-[1.55]",
  },
  {
    name: "body",
    sample: "Every ramp step, semantic mapping, and motion curve on one page.",
    font: "font-sans",
    size: "text-[clamp(1rem,0.97rem+.15vw,1.0625rem)] leading-[1.65]",
  },
  {
    name: "small",
    sample: "Small print reads at 14px regardless of viewport.",
    font: "font-sans",
    size: "text-[0.875rem] leading-[1.5]",
  },
  {
    name: "label",
    sample: "Eyebrow Label",
    font: "font-label uppercase",
    size: "text-[clamp(0.656rem,0.62rem+.15vw,0.72rem)] tracking-[0.22em]",
  },
  {
    name: "meta",
    sample: "build 6b575ef · 2026-09-08",
    font: "font-mono",
    size: "text-[clamp(0.72rem,0.7rem+.1vw,0.75rem)] tracking-[0.04em]",
  },
] as const;

/**
 * Plots a `cubic-bezier(x1,y1,x2,y2)` easing curve as an SVG path in a
 * 120×80 box: P0 = (0,0), P3 = (1,1), control points scaled to the
 * viewBox, y flipped (CSS easing is y-up, SVG is y-down). This is exactly
 * the parametric curve devtools' own cubic-bezier editor draws.
 */
function bezierPath([x1, y1, x2, y2]: readonly [number, number, number, number]): string {
  const w = 120;
  const h = 80;
  const c1x = x1 * w;
  const c1y = h - y1 * h;
  const c2x = x2 * w;
  const c2y = h - y2 * h;
  return `M0,${h} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${w},0`;
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{title}</h2>
      <span className="label text-fg-3">{eyebrow}</span>
    </div>
  );
}

export default function TokensPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-6 py-16">
      <div className="space-y-3">
        <span className="label text-fg-3">Dev only · noindex</span>
        <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
          Tokens
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-fg-2">
          Every color ramp, semantic mapping, type specimen, material, motion curve, and movement
          component the redesign is built from, read straight from{" "}
          <code className="font-mono text-[13px] text-fg">src/lib/tokens.ts</code> and{" "}
          <code className="font-mono text-[13px] text-fg">src/lib/motion.ts</code>. This route is
          excluded from search indexing and returns 404 in production.
        </p>
      </div>

      <TokensClient />

      <section aria-labelledby="ramps-heading" className="space-y-6">
        <Header eyebrow="01 · Color" title="Ramps" />
        <div className="space-y-6">
          {RAMP_ORDER.map((ramp) => (
            <div key={ramp}>
              <p className="mb-2 font-mono text-[12px] text-fg-3">{ramp}</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(ramps[ramp])
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([step, hex]) => (
                    <div key={step} className="w-16 text-center">
                      <div
                        className="h-12 w-16 rounded-2 border border-line"
                        style={{ background: hex }}
                        aria-hidden="true"
                      />
                      <p className="mt-1.5 font-mono text-[11px] text-fg-2">{step}</p>
                      <p className="font-mono text-[10px] text-fg-3">{hex.toUpperCase()}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="semantic-heading" className="space-y-6">
        <Header eyebrow="02 · Semantic" title="Dark / light mapping" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left font-mono text-[12px]">
            <thead>
              <tr className="border-b border-line text-fg-3">
                <th className="py-2 pr-4 font-normal">Token</th>
                <th className="py-2 pr-4 font-normal">Dark</th>
                <th className="py-2 font-normal">Light</th>
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_NAMES.map((name) => {
                const darkValue = resolve(name, "dark");
                const lightValue = resolve(name, "light");
                return (
                  <tr key={name} className="border-b border-line/50">
                    <td className="py-1.5 pr-4 text-fg-2">{name}</td>
                    <td className="py-1.5 pr-4">
                      <span className="inline-flex items-center gap-2 text-fg">
                        <span
                          aria-hidden="true"
                          className="size-3 shrink-0 rounded-full border border-line-2"
                          style={{ background: darkValue }}
                        />
                        {darkValue}
                      </span>
                    </td>
                    <td className="py-1.5">
                      <span className="inline-flex items-center gap-2 text-fg">
                        <span
                          aria-hidden="true"
                          className="size-3 shrink-0 rounded-full border border-line-2"
                          style={{ background: lightValue }}
                        />
                        {lightValue}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="type-heading" className="space-y-6">
        <Header eyebrow="03 · Type" title="Fluid scale" />
        <div className="divide-y divide-line">
          {TYPE_SPECIMENS.map((spec) => (
            <div key={spec.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              <span className="w-16 shrink-0 font-mono text-[11px] text-fg-3">{spec.name}</span>
              <p className={`${spec.font} ${spec.size} text-fg`}>{spec.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="materials-heading" className="space-y-6">
        <Header eyebrow="04 · Materials" title="Glass" />
        <div
          className="relative flex h-56 items-center justify-center gap-6 overflow-hidden rounded-4 p-8"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-soft), var(--metal-champagne-soft), var(--accent-soft))",
          }}
        >
          <div className="glass w-48 rounded-3 p-4">
            <p className="label text-fg-3">glass</p>
            <p className="mt-1 text-sm text-fg">blur(20px) sat(180%)</p>
          </div>
          <div className="glass-hud w-48 rounded-3 p-4">
            <p className="label text-fg-3">glass-hud</p>
            <p className="mt-1 text-sm text-fg">blur(28px) sat(200%)</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="motion-heading" className="space-y-6">
        <Header eyebrow="05 · Motion" title="Curves" />
        <div className="flex flex-wrap gap-8">
          {EASE_CURVES.map((curve) => (
            <div key={curve.name} className="w-[120px]">
              <svg
                width="120"
                height="80"
                viewBox="0 0 120 80"
                role="img"
                aria-label={`${curve.name} cubic-bezier curve`}
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="119"
                  height="79"
                  fill="none"
                  stroke="var(--border-subtle)"
                />
                <path
                  d={bezierPath(curve.points)}
                  fill="none"
                  stroke="var(--accent-default)"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="mt-2 label text-fg-3">{curve.name}</p>
              <p className="font-mono text-[11px] text-fg-3">
                cubic-bezier({curve.points.join(", ")})
              </p>
            </div>
          ))}
        </div>
        <div>
          <p className="label mb-2 text-fg-3">springs</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left font-mono text-[12px]">
              <thead>
                <tr className="border-b border-line text-fg-3">
                  <th className="py-2 pr-4 font-normal">Name</th>
                  <th className="py-2 pr-4 font-normal">Stiffness</th>
                  <th className="py-2 pr-4 font-normal">Damping</th>
                  <th className="py-2 font-normal">Mass</th>
                </tr>
              </thead>
              <tbody>
                {SPRINGS.map(([name, params]) => (
                  <tr key={name} className="border-b border-line/50">
                    <td className="py-1.5 pr-4 text-fg-2">{name}</td>
                    <td className="py-1.5 pr-4 text-fg">{params.stiffness}</td>
                    <td className="py-1.5 pr-4 text-fg">{params.damping}</td>
                    <td className="py-1.5 text-fg">{params.mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="components-heading" className="space-y-6">
        <Header eyebrow="06 · Components" title="Primitives" />
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Tag dot>Default tag</Tag>
          <Tag tone="champagne" dot>
            Champagne tag
          </Tag>
          <KeyCap>⌘</KeyCap>
          <Tooltip label="A tooltip, rendered on the glass surface">
            <Button variant="ghost" size="sm">
              Hover me
            </Button>
          </Tooltip>
          <TextLink href="https://github.com/joelstephen97" external>
            External link
          </TextLink>
        </div>
        <Card className="max-w-sm p-4" interactive>
          <p className="text-sm text-fg">A Card, interactive on hover.</p>
        </Card>
        <Callout tone="note" title="Callout">
          Draws a 3px left rule in the tone color and a raised surface behind the body copy.
        </Callout>
      </section>

      <section aria-labelledby="movement-heading" className="space-y-6">
        <Header eyebrow="07 · Movement" title="Watch parts" />
        <div className="flex flex-wrap items-center gap-8">
          <ReadingDial />
          <DateWindow value="08" label="Day" />
          <Guilloche className="h-24 w-48 rounded-3 border border-line bg-sunken" />
        </div>
        <ComplicationDrawer
          items={[
            { label: "Framework", value: "Next 16" },
            { label: "Runtime", value: "React 19" },
            { label: "Styling", value: "Tailwind 4" },
          ]}
        />
        {/* Caseback reads `new Date().getFullYear()` internally, which Cache
            Components flags as an unstable prerender value — rendered from
            TokensClient (already a client boundary) instead of here. */}
        <CasebackClient />
      </section>
    </main>
  );
}
