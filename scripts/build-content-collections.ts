import { createBuilder } from "@content-collections/core";

// `next build`/`next dev` generate `.content-collections/generated` as a
// side effect of loading `next.config.ts` (see `@content-collections/next`'s
// `withContentCollections`) — but `vitest` and `tsc` never load
// `next.config.ts`, and the generated directory is gitignored, so a fresh
// checkout has nothing there for `content.ts`'s `import { allWritings }
// from "content-collections"` to resolve. This script runs the same
// builder directly, standalone, so `pnpm test`/`pnpm typecheck` don't
// depend on `pnpm build` having already run once.
const builder = await createBuilder("content-collections.ts");
await builder.build();
