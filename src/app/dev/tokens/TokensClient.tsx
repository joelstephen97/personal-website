"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Crown } from "@/components/movement/Crown";
import { Caseback } from "@/components/movement/Caseback";
import { ramps, resolve, type Theme } from "@/lib/tokens";
import { contrastRatio } from "@/lib/contrast";
import { cn } from "@/lib/cn";

const RAMP_ORDER = [
  "stone",
  "steel",
  "champagne",
  "success",
  "warning",
  "error",
  "violet",
] as const;

interface ContrastPair {
  fg: string;
  bg: string;
  /** AA-large threshold (3:1) instead of the normal-text threshold (4.5:1). */
  large?: boolean;
}

const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: "text.primary", bg: "surface.ground" },
  { fg: "text.primary", bg: "surface.raised" },
  { fg: "text.primary", bg: "surface.sunken" },
  { fg: "text.secondary", bg: "surface.ground" },
  { fg: "text.secondary", bg: "surface.raised" },
  { fg: "text.secondary", bg: "surface.sunken" },
  { fg: "text.link", bg: "surface.ground" },
  { fg: "text.link", bg: "surface.raised" },
  { fg: "text.link", bg: "surface.sunken" },
  { fg: "text.muted", bg: "surface.ground", large: true },
  { fg: "metal.champagne", bg: "surface.ground", large: true },
  { fg: "text.on-accent", bg: "accent.default" },
];

function subscribe() {
  return () => {};
}

/**
 * True only once mounted on the client (server snapshot = false, client
 * snapshot = true) — see `Reveal.tsx`'s identical `useMounted` for why
 * `useSyncExternalStore` rather than an effect + `setState` is used here:
 * it flips before paint with no cascading render.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * next-themes only knows the real theme after the client mounts (the
 * server has no notion of `data-theme`); this mirrors the standard
 * next-themes "avoid a hydration mismatch" pattern.
 */
function useMountedTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const active = (theme ?? resolvedTheme ?? "dark") as Theme;
  return { mounted, theme: active, setTheme };
}

/**
 * Live contrast readouts and the theme toggle for `/dev/tokens`. Split out
 * of the (server) page component because both need `useTheme()`: ramp
 * swatches and the semantic table are theme-invariant data rendered once by
 * the server, but "what does this resolve to, and is it AA, *right now*"
 * depends on which theme is active on the client.
 *
 * Also renders the one `Crown` instance for the movement-component gallery:
 * `Crown` requires an `onPress` callback, and a Server Component cannot
 * hand a Client Component a function prop, so it lives here instead of in
 * `page.tsx` alongside the other movement components.
 */
export function TokensClient() {
  const { mounted, theme, setTheme } = useMountedTheme();

  // QA screenshot support: `?theme=light` (or `=dark`) forces the theme on
  // mount, so `docs/superpowers/qa/tokens-light.png` can be captured from a
  // plain URL without clicking the toggle first.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const requested = new URLSearchParams(window.location.search).get("theme");
    if (requested === "light" || requested === "dark") setTheme(requested);
  }, [setTheme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          Theme: {mounted ? theme : "…"}
        </Button>
        <Crown onPress={toggleTheme} label="Toggle theme" />
        <p className="font-mono text-[11px] text-fg-3">
          data-theme flips on &lt;html&gt; — everything below is live, only the numbers on this
          panel needed JS to compute.
        </p>
      </div>

      <section aria-labelledby="live-contrast-heading">
        <h3 id="live-contrast-heading" className="label mb-3 text-fg-3">
          Live contrast — {mounted ? theme : "…"} theme
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left font-mono text-[12px]">
            <thead>
              <tr className="border-b border-line text-fg-3">
                <th className="py-2 pr-4 font-normal">Foreground</th>
                <th className="py-2 pr-4 font-normal">Background</th>
                <th className="py-2 pr-4 font-normal">Ratio</th>
                <th className="py-2 font-normal">Result</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST_PAIRS.map(({ fg, bg, large }) => {
                const ratio = mounted
                  ? contrastRatio(resolve(fg, theme), resolve(bg, theme))
                  : null;
                const threshold = large ? 3 : 4.5;
                const pass = ratio !== null && ratio >= threshold;
                return (
                  <tr key={`${fg}-${bg}`} className="border-b border-line/50">
                    <td className="py-1.5 pr-4 text-fg-2">{fg}</td>
                    <td className="py-1.5 pr-4 text-fg-2">{bg}</td>
                    <td className="py-1.5 pr-4 text-fg">{ratio ? ratio.toFixed(2) : "…"}</td>
                    <td
                      className={cn(
                        "py-1.5",
                        ratio === null ? "text-fg-3" : pass ? "text-success" : "text-error",
                      )}
                    >
                      {ratio === null ? "…" : pass ? `Pass (AA${large ? "-large" : ""})` : "Fail"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="live-ramp-contrast-heading">
        <h3 id="live-ramp-contrast-heading" className="label mb-3 text-fg-3">
          Ramp steps vs surface.ground — {mounted ? theme : "…"} theme
        </h3>
        <div className="space-y-4">
          {RAMP_ORDER.map((ramp) => (
            <div key={ramp}>
              <p className="mb-1.5 font-mono text-[11px] text-fg-3">{ramp}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ramps[ramp])
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([step, hex]) => {
                    const ratio = mounted
                      ? contrastRatio(hex, resolve("surface.ground", theme))
                      : null;
                    return (
                      <div key={step} className="text-center">
                        <div
                          aria-hidden="true"
                          className="size-9 rounded-1 border border-line"
                          style={{ background: hex }}
                        />
                        <p className="mt-1 font-mono text-[10px] text-fg-3">{step}</p>
                        <p className="font-mono text-[10px] text-fg-2">
                          {ratio !== null ? `${ratio.toFixed(1)}:1` : "…"}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * `Caseback` reads `new Date().getFullYear()` in its own render. Cache
 * Components (`next.config.ts`'s `cacheComponents: true`) rejects that as
 * an unstable value during prerendering even inside a Client Component
 * boundary (it still gets server-rendered once for the static HTML), so
 * the read is deferred past mount here — Next's own "[defer] move the
 * read into a useEffect" fix, applied at the call site since `Caseback`
 * itself belongs to an earlier task and calls `new Date()` unconditionally.
 */
export function CasebackClient() {
  const mounted = useMounted();
  if (!mounted) return null;
  return <Caseback build={{ sha: "6b575ef", date: "2026-09-08" }} className="max-w-sm" />;
}
