/**
 * The /consulting page's prose, factored out so the page and
 * `/llms-full.txt` render the exact same copy.
 */
export const consultingCopy = {
  hero: "You shipped an AI feature. Now it has to work in production.",
  subLine:
    "I build the parts between a working demo and something a team can actually run: the pipeline, the guardrails, and the interface people run it from.",
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
  proof:
    "Process Discovery is a real-time collaborative canvas in production with insurance, chemical, and government customers. ScamShield is an on-device browser extension with 903 unit and 138 end-to-end tests, benchmarked in the open. Both started the way an engagement here starts: a defined problem, a scoped build, and a result measured against real use.",
  ctaLabel: "Book a roadmapping session",
  ctaSecondaryLabel: "Or write to me",
} as const;
