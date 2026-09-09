"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { cn } from "@/lib/cn";

// See Button.tsx for why this cast exists instead of a typed `href` prop.
type LinkHref = ComponentProps<typeof Link>["href"];

export interface TransitionLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
}

/**
 * `next/link`, wrapped to drive same-origin left-clicks through
 * `document.startViewTransition` when the browser supports it.
 *
 * React 19.2.8 (the pinned, stable release this repo runs) does not
 * export `ViewTransition` from "react" for `tsc` — that type only
 * exists in `@types/react`'s `canary.d.ts`, a module `tsc` never
 * resolves by default. Next's own bundler aliases "react" inside
 * `app/` to its vendored copy, which *does* ship the runtime export,
 * but `pnpm typecheck` (a required green gate) authors against
 * `@types/react`'s default `index.d.ts` and would fail on
 * `import { ViewTransition } from "react"` with "has no exported
 * member". Per the controller ruling, that's the signal to skip
 * straight to this fallback rather than land a change `tsc` rejects:
 * a manual `document.startViewTransition()` call is a plain browser
 * API, not a React one, so it needs no experimental React channel and
 * no unsupported `experimental.viewTransition` key in `next.config.ts`
 * (Next 16's `ExperimentalConfig` type has no such field either — see
 * task-11-report.md).
 *
 * Reduced motion is respected by simply not wrapping the navigation in
 * a view transition; `router.push` still runs.
 */
export function TransitionLink({
  href,
  onClick,
  className,
  children,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Only intercept plain same-tab left-clicks with no modifier keys —
    // everything else (middle-click, cmd/ctrl-click, shift-click,
    // target="_blank") should keep the browser's native behavior.
    const isPlainLeftClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPlainLeftClick) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (prefersReducedMotion || typeof doc.startViewTransition !== "function") return;

    event.preventDefault();
    doc.startViewTransition(() => {
      router.push(href as Parameters<typeof router.push>[0]);
    });
  }

  return (
    <Link href={href as LinkHref} onClick={handleClick} className={cn(className)} {...rest}>
      {children}
    </Link>
  );
}
