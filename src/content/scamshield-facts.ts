/**
 * ScamShield "Did you know" facts, benchmark, and scale numbers — rendered
 * only on `/work/scamshield` (see `ScamShieldExtras.tsx`). Copied verbatim
 * from the launch-ready blueprint's ScamShield section; do not paraphrase.
 */

export const facts: string[] = [
  "Two scikit-learn-class models run in about 100 lines of hand-written JS, with a CI test proving numeric parity with Python.",
  "Fake bank logins are caught by perceptually hashing the page's favicon and comparing Hamming distance against 49 real brand fingerprints.",
  'Fake "update your browser" pages are caught by checking the download link does not point at the browser vendor\'s real domain.',
  "The form.submit() bypass, which never fires a submit event, is defeated by patching HTMLFormElement.prototype.submit from inside the page's own JS context.",
  "EIP-7702 authorizationList wallet transactions, the post-Pectra account-delegation drainer technique, are flagged the instant one is requested.",
  "Newly registered domains are detected with a custom Bloom filter, double-hashed from SHA-256, tested fully offline.",
  "A dedicated tool crawls 400 popular websites just to measure the icon matcher's own false-positive rate.",
  'A ClickFix attack only trips "dangerous" when a real shell payload lands on the clipboard and the page\'s own text walks the user through Win+R.',
  "The hourly feed is treated as a potentially poisoned upstream, so a bad entry can never block a whole platform.",
  "An earlier model scored Wikipedia's phishing article at 99.4% phishing from URL path length alone; the fix and the post-mortem are in the repo.",
];

export interface BenchmarkRow {
  set: string;
  n: number;
  blockedBeforeLoad: string;
  stopped: string;
  warned: string;
  hardFalsePositives: string;
}

export const benchmark: { date: string; rows: BenchmarkRow[] } = {
  date: "2026-09-07",
  rows: [
    {
      set: "Fresh phishing",
      n: 134,
      blockedBeforeLoad: "56.0%",
      stopped: "68.7%",
      warned: "—",
      hardFalsePositives: "—",
    },
    {
      set: "All pages",
      n: 279,
      blockedBeforeLoad: "34.1%",
      stopped: "58.4%",
      warned: "12.9%",
      hardFalsePositives: "—",
    },
    {
      set: "Benign controls",
      n: 86,
      blockedBeforeLoad: "—",
      stopped: "—",
      warned: "—",
      hardFalsePositives: "0",
    },
  ],
};

export interface ScamShieldScale {
  unitTests: number;
  e2eTests: number;
  commits: number;
  days: number;
  zippedKb: number;
  locales: number;
}

export const scale: ScamShieldScale = {
  unitTests: 903,
  e2eTests: 138,
  commits: 237,
  days: 94,
  zippedKb: 638,
  locales: 20,
};
