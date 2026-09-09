import { site } from "@/lib/site";
import { Profile } from "./schema";

export const profile = Profile.parse({
  name: site.name,
  title: site.title,
  oneLine: "Building AI systems and the interfaces people run them from.",
  proof:
    "Production software across LLM integrations, real-time collaborative canvases, node-graph editors, and Python services. Five-plus years, currently on Opus, an enterprise AI workflow platform used by insurance, chemical, and government customers.",
  status: "Full-Stack & AI Product Engineer · Opus at AppliedAI · Abu Dhabi",
  email: site.email,
  github: site.github,
  linkedin: site.linkedin,
  location: site.location,
  languages: ["English", "Malayalam", "Hindi"],
  learning: "Mandarin",
  credibility: [
    { label: "AppliedAI", detail: "Opus", href: site.employer.url },
    {
      label: "Y Combinator X26",
      detail: "top 10% of applicants",
      tip: "Pitched Cursor for Product Managers, a full-stack agentic product for PMs, to the X26 batch. Reached the top 10% of applications.",
    },
    { label: "B.E. CSE (Hons)", detail: "BITS Pilani Dubai" },
    { label: "5+ years", detail: "4 companies" },
    {
      label: "ScamShield",
      detail: "Chrome Web Store",
      href: "https://chromewebstore.google.com/detail/fojjjofjimbfoddafoampojopijnlihl",
    },
  ],
});
