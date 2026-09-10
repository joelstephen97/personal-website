import { z } from "zod";
import colorTokensJson from "../../tokens/color.tokens.json";
import semanticTokensJson from "../../tokens/semantic.tokens.json";

/**
 * Server/test-only: validates `tokens/color.tokens.json` and
 * `tokens/semantic.tokens.json` against a Zod schema once, at module load,
 * then re-exports the same `ramps` / `semantic` / `resolve` / `Theme` API
 * as `./tokens.data` (which holds the actual, non-validating
 * implementation — see that file's comment for why the split exists).
 *
 * Throws synchronously on import if either token file doesn't match the
 * expected shape, so a malformed hand-edit to either JSON file fails the
 * build (`next build`, via `dev/tokens/page.tsx`) or the test run
 * (`tests/unit/contrast.test.ts`) immediately, at the point of the bad
 * edit, instead of surfacing later as a silent `undefined`/`NaN` in a
 * resolved color somewhere on the site.
 *
 * Do not import this from a "use client" component — that would pull
 * `zod` into the client bundle for validation that only ever needs to run
 * server-side or in tests. Import `./tokens.data` instead (verified via
 * `grep -rn "from \"@/lib/tokens\"" src` that only server components and
 * test files import this one; `src/app/dev/tokens/TokensClient.tsx`, the
 * one client component that needs `ramps`/`resolve`, imports
 * `./tokens.data` directly).
 */

const colorTokenSchema = z.object({
  $type: z.literal("color"),
  $value: z.string().min(1),
});

const colorTokensJsonSchema = z.object({
  color: z.record(z.string(), z.record(z.string(), colorTokenSchema)),
});

const semanticLeafSchema = z.object({
  $type: z.literal("color"),
  $value: z.object({ dark: z.string().min(1), light: z.string().min(1) }),
});

type SemanticGroupShape = {
  [key: string]: z.infer<typeof semanticLeafSchema> | SemanticGroupShape;
};

const semanticGroupSchema: z.ZodType<SemanticGroupShape> = z.lazy(() =>
  z.record(z.string(), z.union([semanticLeafSchema, semanticGroupSchema])),
);

colorTokensJsonSchema.parse(colorTokensJson);
semanticGroupSchema.parse(semanticTokensJson);

export { ramps, semantic, resolve, type Theme } from "./tokens.data";
