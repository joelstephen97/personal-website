import type { DomainId } from "@/content/schema";

/** Second text line under each node's label — a short descriptor, not the schema's `short` blurb. */
export const SHORT_DESCRIPTOR: Record<DomainId, string> = {
  ai: "systems",
  realtime: "collaboration",
  interfaces: "canvases",
  product: "engineering",
  python: "& APIs",
  cv: "vision",
};
