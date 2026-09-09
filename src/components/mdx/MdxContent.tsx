import { MDXContent } from "@content-collections/mdx/react";
import { createMdxComponents, type Heading } from "./components";

export interface MdxContentProps {
  code: string;
  headings: Heading[];
}

/**
 * Renders a compiled `work`/`writing` document's MDX, numbering its H2s.
 *
 * A server component: `@content-collections/mdx/react`'s package.json
 * declares a `"react-server"` export condition pointing `MDXContent` at
 * `dist/react/server.js`, which runs its `new Function(...)` compile step
 * in Node during the server render, not in the browser. Rendered from a
 * client component, the bundler instead resolves the `dist/react/client.js`
 * implementation, which runs that same `new Function(...)` call in the
 * browser and requires `'unsafe-eval'` in `script-src` — verified: with
 * this file as `"use client"`, every `/work/[slug]` page threw a CSP
 * `'unsafe-eval'` violation on load and never hydrated (see proxy.ts and
 * task-11-report.md). Server-rendering it here means the compiled output
 * is plain HTML/RSC payload; nothing evaluates in the browser at all, so
 * `script-src` no longer needs `'unsafe-eval'`.
 *
 * `createMdxComponents` (in `./components`, no `"use client"` of its own)
 * can be called directly here: it returns a components map that includes
 * client components (`DateWindow`) alongside server-safe ones (`Callout`,
 * `Tag`) — a server component referencing an imported client component in
 * its output is the normal React Server Components pattern, not a
 * boundary violation.
 */
export function MdxContent({ code, headings }: MdxContentProps) {
  const components = createMdxComponents(headings);
  return <MDXContent code={code} components={components} />;
}
