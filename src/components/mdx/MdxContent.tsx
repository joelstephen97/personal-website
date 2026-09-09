"use client";

import { useMemo } from "react";
import { useMDXComponent } from "@content-collections/mdx/react";
import { createMdxComponents, type Heading } from "./components";

export interface MdxContentProps {
  code: string;
  headings: Heading[];
}

/** Renders a compiled `work`/`writing` document's MDX, numbering its H2s. */
export function MdxContent({ code, headings }: MdxContentProps) {
  // `useMDXComponent` is content-collections' documented API for turning
  // compiled MDX `code` into a component (it memoizes internally on `code`).
  // The static-components lint rule cannot see that internal memoization
  // and flags the resulting hook-returned component used as a JSX tag;
  // there is no alternative, sanctioned API to avoid this false positive.
  const Component = useMDXComponent(code);
  const components = useMemo(() => createMdxComponents(headings), [headings]);
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
