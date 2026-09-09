import type { ReactNode } from "react";

// React 19.2.8 (the pinned, stable release here) does not export
// `ViewTransition` or `unstable_ViewTransition` from "react" — that API
// ships only on React's experimental/canary channel. Per the controller
// ruling, this template ships as a plain passthrough rather than wrapping
// children in a component that doesn't exist; see task-10-report.md for
// the concern writeup. The `.page`/`.cut` view-transition CSS still lives
// in globals.css so Task 11's `Link transitionTypes={["cut"]}` cards (and
// a future upgrade to a canary React that exports `ViewTransition`) have
// something to target.
export default function Template({ children }: { children: ReactNode }) {
  return children;
}
