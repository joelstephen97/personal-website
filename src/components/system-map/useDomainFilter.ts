"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DomainId } from "@/content/schema";

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
    const parsed = DomainId.safeParse(raw);
    return parsed.success ? parsed.data : null;
  }, [searchParams]);

  const select = useCallback(
    (id: DomainId | null) => {
      const href = pathname + (id ? `?domain=${id}` : "");
      router.replace(href as Parameters<typeof router.replace>[0], { scroll: false });
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
