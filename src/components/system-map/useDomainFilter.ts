"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { isDomainId, type DomainId } from "@/content/domain-ids";

export interface DomainFilter {
  selected: DomainId | null;
  select(id: DomainId | null): void;
  toggle(id: DomainId): void;
}

/**
 * URL-backed domain filter: `?domain=<id>` is the source of truth so the
 * System Map's selection survives navigation and is shareable/linkable.
 * Must be rendered under a `<Suspense>` boundary by callers — required by
 * `useSearchParams` in the App Router.
 */
export function useDomainFilter(): DomainFilter {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = useMemo<DomainId | null>(() => {
    const raw = searchParams.get("domain");
    return isDomainId(raw) ? raw : null;
  }, [searchParams]);

  const select = useCallback(
    (id: DomainId | null) => {
      const href = pathname + (id ? `?domain=${id}` : "");
      const apply = () =>
        router.replace(href as Parameters<typeof router.replace>[0], { scroll: false });

      // Same pattern as `TransitionLink.tsx` (a plain browser API, not
      // React's — React 19.2.8 stable doesn't export `ViewTransition`;
      // see that file's comment): wrapping the URL update in
      // `document.startViewTransition` animates `FeaturedWork`'s card
      // reorder/enter/exit via each card's `viewTransitionName`, without
      // Motion's `domMax` (layout animations) — that feature bundle's
      // ~45 kB gzipped existed in the client bundle only for this one
      // transition. Reduced motion simply skips the wrapper; `apply()`
      // still runs.
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || typeof doc.startViewTransition !== "function") {
        apply();
        return;
      }

      // `vt-filter` scopes globals.css's group-animation override to this
      // transition only, leaving page-navigation view transitions
      // (`TransitionLink.tsx`'s root/.page/.cut durations) untouched.
      document.documentElement.classList.add("vt-filter");
      const removeScope = () => document.documentElement.classList.remove("vt-filter");
      doc.startViewTransition(apply).finished.then(removeScope, removeScope);
    },
    [router, pathname],
  );

  const toggle = useCallback(
    (id: DomainId) => {
      select(selected === id ? null : id);
    },
    [select, selected],
  );

  return { selected, select, toggle };
}
