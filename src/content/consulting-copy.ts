/**
 * The /consulting page's prose, factored out so the page and
 * `/llms-full.txt` render the exact same copy.
 */
export const consultingCopy = {
  hero: "You shipped an AI feature. Now it has to work in production.",
  // Kept word-for-word identical to the hero lead rendered in
  // `src/app/consulting/page.tsx` — see the file header note above.
  subLine:
    "AI integration, workflow systems, and real-time collaboration for product teams. A small number of engagements alongside my role at AppliedAI. Remote, GMT+4. Fixed fees, never hourly.",
  whoFor: [
    "A team with an AI feature in production that fails in ways nobody can explain.",
    "A product idea that needs a working prototype before the backend budget exists.",
    "Multiple people who need to edit the same document, board, or canvas at once.",
    "A codebase that has outgrown its original architecture and needs a second opinion.",
  ],
  whoNotFor: [
    "A team looking for an AI chatbot bolted onto an existing product.",
    "A one-off script instead of software someone else will maintain.",
    "A project where nobody on the team can commit to a working session before it starts.",
    "Work that needs a full-time hire rather than a defined engagement.",
  ],
  // One-line results per project, kept as structured data (rather than one
  // prose paragraph) so `src/components/consulting/Proof.tsx`'s cards and
  // `/llms-full.txt`'s plain-text rendering both read from the same source
  // instead of drifting out of sync.
  proofItems: [
    {
      slug: "process-discovery",
      result: "In production with insurance, chemical, and government customers.",
    },
    {
      slug: "scamshield",
      result:
        "903 unit and 138 end-to-end tests, benchmarked in the open with zero hard false positives on the control set.",
    },
  ],
  ctaLabel: "Book a roadmapping session",
  ctaSecondaryLabel: "Or write to me →",
} as const;
