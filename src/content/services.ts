import { Service } from "./schema";

export const services = Service.array().parse([
  {
    id: "roadmapping-session",
    title: "AI Integration Roadmapping Session",
    step: 1,
    answer:
      "I run a 90-minute working session on your product, then send a written plan within two days. It's for a team that knows AI could help somewhere but hasn't pinned down where it pays off. I'll flag the likely failure modes too, before anyone writes a line of pipeline code.",
    problem:
      "You know AI could help somewhere in the product, but not where it earns its cost or how it fails.",
    what: "A working session that maps the candidate workflows, picks the one with the clearest payoff, and specifies what a first build needs: data, guardrails, and a way to tell if it worked.",
    scope: "90 minutes plus a written plan within two days.",
    pricingRule: "Fixed fee.",
    domains: ["ai", "product"],
    provenIn: ["process-discovery", "workflow-canvas"],
    technologies: [],
    slug: null,
  },
  {
    id: "ai-integration-sprint",
    title: "AI Integration Sprint",
    step: 2,
    answer:
      "I design and build one AI-assisted workflow end to end. That means the pipeline, the retrieval or prompting it actually needs, the guardrails, and the interface people run it from. It's for a team with a defined workflow that needs a model in the loop. Its engineers haven't taken an LLM feature to production before.",
    problem:
      "A defined workflow needs a model in the loop, and the team building it has not taken an LLM feature from prototype to production before.",
    what: "Design and build one AI-assisted workflow end to end: the pipeline, the prompting or retrieval it actually needs, the guardrails, and the interface people run it from.",
    scope: "Two to four weeks, scoped after the roadmapping session.",
    pricingRule: "Quoted after the roadmapping session.",
    domains: ["ai", "product", "python"],
    provenIn: ["process-discovery", "scamshield"],
    technologies: ["LLM APIs", "RAG", "Python", "Next.js"],
    slug: "ai-integration",
  },
  {
    id: "ai-workflow-sprint",
    title: "AI Workflow System Sprint",
    step: 2,
    answer:
      "I build the system that runs several AI-assisted steps together. That means task sequencing, human-in-the-loop checkpoints, retries, and an interface for people to monitor and step in. It's for a team whose AI-assisted process has outgrown a single script someone babysits. It needs to run as software instead.",
    problem:
      "Multiple AI-assisted steps need to run as one system with review points, not as a single script someone babysits.",
    what: "Build the workflow system: task sequencing, human-in-the-loop checkpoints, retries, and an interface for people to monitor and step in.",
    scope: "Three to six weeks, scoped after the roadmapping session.",
    pricingRule: "Quoted after the roadmapping session.",
    domains: ["ai", "interfaces", "python"],
    provenIn: ["process-discovery", "workflow-canvas"],
    technologies: ["LLM APIs", "Python", "FastAPI", "node-graph editor"],
    slug: "ai-workflows",
  },
  {
    id: "real-time-collaboration-build",
    title: "Real-Time Collaboration Build",
    step: 2,
    answer:
      "I design the collaborative data layer behind a document, board, or canvas: conflict resolution, presence, and versioning. I also build the interface that makes concurrent editing feel safe. It's for a product team whose single-user data model won't hold now that several people edit the same thing at once.",
    problem:
      "More than one person needs to work on the same document, board, or canvas at once, and a single-user data model will not hold.",
    what: "Design the collaborative data layer, conflict resolution, presence, and versioning, and the interface that makes concurrent editing feel safe.",
    scope: "Three to six weeks, scoped after the roadmapping session.",
    pricingRule: "Quoted after the roadmapping session.",
    domains: ["realtime", "interfaces"],
    provenIn: ["process-discovery"],
    technologies: ["Yjs/CRDT", "WebSocket", "custom conflict resolution"],
    slug: "real-time-collaboration",
  },
  {
    id: "prototype-in-weeks",
    title: "Prototype in Weeks",
    step: 2,
    answer:
      "I build a working prototype of the interface first, wired to real or realistic data. That lets the product get tested before the backend gets built. It's for a founder or product team that needs to put an idea in front of users or investors before the backend budget exists.",
    problem:
      "An idea needs to be in front of users or investors before the backend budget exists to build it properly.",
    what: "Build a working prototype of the interface first, wired to real or realistic data, so the product gets tested before the backend gets built.",
    scope: "One to three weeks.",
    pricingRule: "Quoted after the roadmapping session.",
    domains: ["product", "interfaces"],
    provenIn: ["soundprint", "meetingmind"],
    technologies: ["Next.js", "React", "Figma-to-production"],
    slug: "prototyping",
  },
  {
    id: "ai-reliability-audit",
    title: "AI Reliability Audit",
    step: 3,
    answer:
      "I test an AI feature already in production against real and adversarial inputs. Then I measure its failure modes and hand over a prioritized list of fixes. It's for a team that has shipped an AI feature and can no longer say how often it's wrong, or why.",
    problem:
      "An AI feature is live, and nobody can say with confidence how often it is wrong or why.",
    what: "Test the pipeline against real and adversarial inputs, measure the failure modes, and hand over a prioritized list of fixes.",
    scope: "One to two weeks.",
    pricingRule: "Fixed fee.",
    domains: ["ai"],
    provenIn: ["scamshield", "process-discovery"],
    technologies: ["LLM APIs", "evaluation tooling", "Playwright"],
    slug: "ai-reliability-audit",
  },
  {
    id: "architecture-review",
    title: "Architecture Review",
    step: 3,
    answer:
      "I read the codebase and trace the data flow. Then I deliver a written review of what to keep, what to change, and what to watch. It's for a team whose codebase has grown past the point where the original decisions still fit. They want a second opinion before the next big feature.",
    problem:
      "A codebase has grown past the point where the original decisions still fit, and the team wants a second opinion before the next big feature.",
    what: "Read the codebase, trace the data flow, and deliver a written review of what to keep, what to change, and what to watch.",
    scope: "One week.",
    pricingRule: "Fixed fee.",
    domains: ["interfaces", "product", "python"],
    provenIn: ["fmi-platform", "flower-meister"],
    technologies: [],
    slug: "architecture-review",
  },
  {
    id: "team-enablement-workshop",
    title: "Team Enablement Workshop",
    step: 3,
    answer:
      "I run hands-on sessions with a frontend or product team on the AI tooling that speeds up real engineering work. We use their own codebase as the material. It's for a team that is starting to bring AI tooling into daily work. They don't have a shared sense yet of what actually helps.",
    problem:
      "A frontend or product team is starting to use AI tooling in their day-to-day work without a shared sense of what works.",
    what: "Hands-on sessions with the team covering the AI tooling that speeds up real engineering work, using their own codebase as the material.",
    scope: "Half-day or full-day, on site or remote.",
    pricingRule: "Fixed fee.",
    domains: ["ai", "product"],
    provenIn: ["process-discovery"],
    technologies: [],
    slug: null,
  },
  {
    id: "implementation-support",
    title: "Implementation Support",
    step: 4,
    answer:
      "I embed as an engineer on your team for an agreed cadence. I ship alongside them and keep the original plan honest as scope shifts. It's for a team with a build in progress that needs an extra senior engineer for a stretch, not a handoff document.",
    problem:
      "A build is in progress and the team needs an extra senior engineer embedded for a stretch, not a handoff document.",
    what: "Embed as an engineer on the team for an agreed cadence, shipping alongside them and keeping the original plan honest as scope shifts.",
    scope: "Ongoing, monthly cadence.",
    pricingRule: "Stated monthly cadence.",
    domains: ["ai", "product", "python"],
    provenIn: ["process-discovery", "fmi-platform"],
    technologies: [],
    slug: null,
  },
]);
