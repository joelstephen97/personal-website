/**
 * The engineering-domain id list, factored out of `schema.ts` so client
 * code that only needs to validate/type a domain id (the System Map's
 * `useDomainFilter`) can do so without importing `zod` or any of the
 * other content schemas — `schema.ts` runs `.parse()` at module scope for
 * every schema it defines, so importing even one named export from it for
 * a runtime value pulls the whole module (zod included) into whatever
 * bundle imports it. This file has no such side effect: it's a plain
 * literal array.
 */
export const DOMAIN_IDS = ["ai", "realtime", "interfaces", "product", "python", "cv"] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export function isDomainId(value: string | null | undefined): value is DomainId {
  return typeof value === "string" && (DOMAIN_IDS as readonly string[]).includes(value);
}
