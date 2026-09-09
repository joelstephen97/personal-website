import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { services } from "@/content/services";
import { domains } from "@/content/domains";
import { deriveEdges } from "@/lib/content";

const BANNED = [
  "passionate",
  "cutting-edge",
  "innovative",
  "scalable solutions",
  "digital transformation",
  "next-generation",
  "visionary",
  "ninja",
  "rockstar",
  "10x",
  "disruptive",
  "seamless",
  "robust",
  "leverage",
  "spearheaded",
  "architected",
  "delve",
  "empower",
  "holistic",
  "journey",
  "world-class",
  "not just",
  "responsible for",
  "Technical Canvas",
  "Opus-CX",
  "n8n",
];

const text = JSON.stringify([projects, experience, services, domains]).toLowerCase();

describe("content", () => {
  it("contains no banned words or non-public names", () => {
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
  });

  it("uses the title everywhere it names the current role", () => {
    expect(experience[0]?.role).toBe("Full-Stack & AI Product Engineer");
  });

  it("uses the Yjs sentence verbatim", () => {
    expect(JSON.stringify(experience)).toContain(
      "Built on Yjs, now a custom conflict-resolution engine to handle scale.",
    );
  });

  // Practical guard for the copy-voice rule ("first person; past tense for
  // finished work, present for AppliedAI"): every role's summary/impact
  // strings should read as first person ("I led…", "I build…"), not the
  // elided-subject third-person CV voice ("Led…", "Builds…"). Rather than
  // requiring every string to start with "I " (the Yjs sentence, a second
  // sentence within `summary`, legitimately doesn't), this checks that no
  // summary/impact string *starts* with a bare third-person verb from the
  // set this content actually used before the task-1 voice fix.
  const THIRD_PERSON_VERBS = [
    "Leads",
    "Ships",
    "Builds",
    "Partners",
    "Coaches",
    "Led",
    "Trained",
    "Embedded",
    "Migrated",
    "Designed",
    "Owned",
    "Built",
    "Shipped",
    "Mentored",
    "Tested",
    "Forked",
    "Integrated",
  ];

  it("summary/impact strings read as first person, not elided-subject third person", () => {
    for (const role of experience) {
      for (const line of [role.summary, ...role.impact]) {
        const firstWord = line.split(" ")[0];
        expect(
          THIRD_PERSON_VERBS.includes(firstWord ?? ""),
          `${role.id}: "${line}" starts with a bare third-person verb`,
        ).toBe(false);
      }
    }
  });

  it("every project has a domain and a source", () => {
    for (const p of projects) {
      expect(p.domains.length).toBeGreaterThan(0);
      expect(p.sources.length).toBeGreaterThan(0);
    }
  });

  it("featured projects are exactly five, ordered", () => {
    const f = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
    expect(f.map((p) => p.slug)).toEqual([
      "process-discovery",
      "workflow-canvas",
      "scamshield",
      "flower-meister",
      "fmi-platform",
    ]);
  });

  it("derives edges from shared work", () => {
    const e = deriveEdges();
    expect(
      e.find((x) => (x.a === "ai" && x.b === "realtime") || (x.a === "realtime" && x.b === "ai"))
        ?.weight,
    ).toBeGreaterThanOrEqual(1);
  });

  it("domain work references resolve", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const d of domains)
      for (const w of d.work) expect(slugs.has(w), `${d.id} → ${w}`).toBe(true);
  });
});

const WORK_DIR = join(process.cwd(), "content", "work");
const CASE_STUDY_SLUGS = [
  "process-discovery",
  "workflow-canvas",
  "scamshield",
  "flower-meister",
  "fmi-platform",
];
const OPUS_SLUGS = ["process-discovery", "workflow-canvas"];
const EXPECTED_HEADINGS = [
  "Problem",
  "Context and constraints",
  "My role",
  "Approach",
  "Architecture",
  "What was actually hard",
  "Trade-offs",
  "Result",
  "What I learned",
];
const OPUS_ONLY_BANNED = [
  "technical canvas",
  "opus-cx",
  "n8n",
  "anthropic",
  "openai",
  "claude",
  "gpt",
];

describe("case study MDX documents", () => {
  const bodies = Object.fromEntries(
    CASE_STUDY_SLUGS.map((slug) => [slug, readFileSync(join(WORK_DIR, `${slug}.mdx`), "utf8")]),
  );

  it("has the nine H2 sections in order", () => {
    for (const slug of CASE_STUDY_SLUGS) {
      const headings = Array.from(bodies[slug]!.matchAll(/^##\s+(.+)$/gm)).map((m) => m[1]!.trim());
      expect(headings, slug).toEqual(EXPECTED_HEADINGS);
    }
  });

  it("contains no banned words", () => {
    for (const slug of CASE_STUDY_SLUGS) {
      const lower = bodies[slug]!.toLowerCase();
      for (const w of BANNED) expect(lower, `${slug}: "${w}"`).not.toContain(w.toLowerCase());
    }
  });

  it("never names confidential internals or LLM vendors in the Opus case studies", () => {
    for (const slug of OPUS_SLUGS) {
      const lower = bodies[slug]!.toLowerCase();
      for (const w of OPUS_ONLY_BANNED) {
        expect(lower, `${slug}: "${w}"`).not.toContain(w);
      }
    }
  });

  it("uses the Yjs sentence verbatim in process-discovery", () => {
    expect(bodies["process-discovery"]).toContain(
      "Built on Yjs, now a custom conflict-resolution engine to handle scale.",
    );
  });
});
