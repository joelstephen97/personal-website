"use client";

import { usePathname } from "next/navigation";
import {
  ComplicationDrawer,
  type ComplicationDrawerItem,
} from "@/components/movement/ComplicationDrawer";
import { getRouteBuildInfo } from "@/lib/build-info";

export interface BuildDrawerProps {
  sha?: string;
}

/**
 * `ComplicationDrawer`, wired up with the current route: `route` and
 * `client js` resolve client-side from `usePathname()` against the static
 * map in `src/lib/build-info.ts`, so the footer (a server component,
 * rendered once per layout, not per route) still shows the right values
 * per page.
 */
export function BuildDrawer({ sha }: BuildDrawerProps) {
  const pathname = usePathname();
  const { route, clientJs } = getRouteBuildInfo(pathname);

  const items: ComplicationDrawerItem[] = [
    { label: "route", value: route },
    { label: "rendering", value: "server components" },
    { label: "cache", value: "static" },
    { label: "client js", value: clientJs },
    { label: "fonts", value: "Bodoni Moda · Cinzel · Geist · Geist Mono" },
    { label: "build", value: sha || "local" },
  ];

  return <ComplicationDrawer items={items} />;
}
