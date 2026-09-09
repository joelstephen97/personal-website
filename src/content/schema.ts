import { z } from "zod";

export const DomainId = z.enum(["ai", "realtime", "interfaces", "product", "python", "cv"]);
export type DomainId = z.infer<typeof DomainId>;

export const Domain = z.object({
  id: DomainId,
  label: z.string(),
  short: z.string(),
  angle: z.number(),
  blurb: z.string(),
  tech: z.array(z.string()),
  work: z.array(z.string()),
  experience: z.array(z.string()),
});
export type Domain = z.infer<typeof Domain>;

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string().max(120),
  category: z.enum(["case-study", "product", "archive", "lab"]),
  featured: z.boolean().default(false),
  order: z.number().int(),
  company: z.string().optional(),
  role: z.string(),
  dates: z.object({ start: z.string(), end: z.string().nullable() }),
  domains: z.array(DomainId).min(1),
  technologies: z.array(z.string()),
  confidential: z.boolean().default(false),
  heroVisual: z.object({
    kind: z.enum(["diagram", "screenshot", "abstract"]),
    src: z.string(),
    alt: z.string(),
  }),
  screenshots: z
    .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
    .default([]),
  architecture: z
    .object({
      kind: z.enum(["pipeline", "layers", "graph"]),
      nodes: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          responsibility: z.string(),
          tech: z.array(z.string()),
          hard: z.string().optional(),
        }),
      ),
      edges: z.array(z.tuple([z.string(), z.string()])),
    })
    .optional(),
  links: z
    .object({
      github: z.url().optional(),
      chromeStore: z.url().optional(),
      live: z.url().optional(),
    })
    .default({}),
  results: z.array(z.string()).default([]),
  sources: z.array(z.string()),
});
export type Project = z.infer<typeof Project>;

export const Experience = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  dates: Project.shape.dates,
  depth: z.enum(["full", "60", "40", "25", "15"]),
  summary: z.string(),
  impact: z.array(z.string()),
  technologies: z.array(z.string()),
  lessons: z.array(z.string()).default([]),
  work: z.array(z.string()).default([]),
});
export type Experience = z.infer<typeof Experience>;

export const Service = z.object({
  id: z.string(),
  title: z.string(),
  step: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  problem: z.string(),
  what: z.string(),
  scope: z.string(),
  pricingRule: z.string(),
  domains: z.array(DomainId),
  provenIn: z.array(z.string()),
  technologies: z.array(z.string()),
  slug: z.string().nullable(),
});
export type Service = z.infer<typeof Service>;

export const NowEntry = z.object({
  updated: z.string(),
  building: z.array(z.string()),
  exploring: z.array(z.string()),
  reading: z.string(),
  away: z.string(),
});
export type NowEntry = z.infer<typeof NowEntry>;

export const Principle = z.object({
  title: z.string(),
  detail: z.string(),
});
export type Principle = z.infer<typeof Principle>;

export const LabEntry = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string(),
  buildLog: z.string(),
  group: z.enum(["ml", "algorithms", "tools", "games"]),
  tier: z.union([z.literal(1), z.literal(2)]),
  status: z.literal("planned"),
});
export type LabEntry = z.infer<typeof LabEntry>;

export const Testimonial = z.object({
  quote: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  url: z.url().optional(),
});
export type Testimonial = z.infer<typeof Testimonial>;

export const Profile = z.object({
  name: z.string(),
  title: z.string(),
  oneLine: z.string(),
  proof: z.string(),
  status: z.string(),
  email: z.string(),
  github: z.url(),
  linkedin: z.url(),
  location: z.string(),
  languages: z.array(z.string()),
  learning: z.string(),
  credibility: z.array(
    z.object({
      label: z.string(),
      detail: z.string(),
      href: z.url().optional(),
      tip: z.string().optional(),
    }),
  ),
});
export type Profile = z.infer<typeof Profile>;
