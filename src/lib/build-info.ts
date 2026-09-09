export interface RouteBuildInfo {
  route: string;
  clientJs: string;
}

/** Static per-route facts for the footer's `ComplicationDrawer`, keyed by pathname. */
export const ROUTE_BUILD_INFO: Record<string, RouteBuildInfo> = {
  "/": { route: "static", clientJs: "≈130 kB gz" },
  default: { route: "static", clientJs: "see /dev/tokens" },
};

export function getRouteBuildInfo(pathname: string | null): RouteBuildInfo {
  const key = pathname && pathname in ROUTE_BUILD_INFO ? pathname : "default";
  // Non-null: both the matched key and "default" are always present above.
  return ROUTE_BUILD_INFO[key] as RouteBuildInfo;
}
