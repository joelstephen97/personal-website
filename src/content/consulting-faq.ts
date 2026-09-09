/**
 * The six consulting FAQ entries used by `/consulting` (all six) and each
 * service page (a curated `SERVICE_FAQ_IDS` subset — see
 * `src/components/consulting/Faq.tsx`).
 */
export interface ConsultingFaqEntry {
  id: string;
  q: string;
  a: string;
}

export const consultingFaq: ConsultingFaqEntry[] = [
  {
    id: "provider",
    q: "Does this work with the model provider we already use?",
    a: "I work with whichever model provider you already use. The pipeline itself is built against more than one provider by default. That keeps it portable if a provider or model changes later.",
  },
  {
    id: "not-sure",
    q: "What if we're not sure AI is the right answer yet?",
    a: "That's what the roadmapping session is for. It maps the candidate workflows against what a model can actually do today. A plain 'do not build it' is as valid an outcome as a build plan.",
  },
  {
    id: "nda",
    q: "Do you sign NDAs?",
    a: "Reasonable NDAs, yes — standard practice for any engagement that touches a codebase or customer data. What I won't take on is an unnamed, unscoped engagement with no defined deliverable.",
  },
  {
    id: "fit",
    q: "How does this fit around your full-time role?",
    a: "I run a small number of engagements alongside my full-time role at AppliedAI, on evenings and weekends, GMT+4. That number stays capped so it never competes with the day job.",
  },
  {
    id: "where-hours",
    q: "Where are you, and what hours do you keep?",
    a: "Abu Dhabi, GMT+4, and I work remotely. Calls and overlap windows are scheduled against that time zone, usually early morning or evening. It depends on where the team sits.",
  },
  {
    id: "billing",
    q: "Do you bill hourly?",
    a: "No. Every engagement is a fixed fee or a stated monthly cadence, and we agree on it before work starts. There's never a running hourly meter.",
  },
];

/** The three questions a service page shows: provider, NDA, billing. */
export const SERVICE_FAQ_IDS = ["provider", "nda", "billing"] as const;
