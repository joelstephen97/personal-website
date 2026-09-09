import { NowEntry } from "./schema";

export const now = NowEntry.parse({
  updated: "2026-09",
  building: ["Opus at AppliedAI", "ScamShield 0.13 and its hourly hot list"],
  exploring: [
    "agentic systems",
    "LLM interfaces",
    "real-time state",
    "developer tooling",
    "frontend architecture",
  ],
  reading: "Whatever the latest CRDT paper argues about intent.",
  away: "A year of Mandarin. The software side of time-domain astronomy on weekends.",
});
