import colorTokensJson from "../../tokens/color.tokens.json";
import semanticTokensJson from "../../tokens/semantic.tokens.json";

export type Theme = "dark" | "light";

type ColorToken = { $type: "color"; $value: string };
type ColorRamp = Record<string, ColorToken>;
type ColorTokensJson = { color: Record<string, ColorRamp> };

type SemanticLeaf = { $type: "color"; $value: { dark: string; light: string } };
type SemanticGroup = { [key: string]: SemanticLeaf | SemanticGroup };

const colorTokens = colorTokensJson as ColorTokensJson;

/** Ramp name -> step -> resolved hex color. Named ramp keys are guaranteed present. */
type RampSteps = Record<string, string>;
type Ramps = {
  stone: RampSteps;
  steel: RampSteps;
  champagne: RampSteps;
  success: RampSteps;
  warning: RampSteps;
  error: RampSteps;
  violet: RampSteps;
};

/** Ramp name -> step -> resolved hex color, e.g. `ramps.stone["925"] === "#0B0C0F"`. */
export const ramps = Object.fromEntries(
  Object.entries(colorTokens.color).map(([ramp, steps]) => [
    ramp,
    Object.fromEntries(Object.entries(steps).map(([step, token]) => [step, token.$value])),
  ]),
) as Ramps;

/** Semantic token tree, mirroring `tokens/semantic.tokens.json` (unresolved `{a.b.c}` references intact). */
export const semantic = semanticTokensJson as SemanticGroup;

function isLeaf(node: SemanticLeaf | SemanticGroup): node is SemanticLeaf {
  const value = (node as Partial<SemanticLeaf>).$value;
  return typeof value === "object" && value !== null && "dark" in value && "light" in value;
}

/** Flatten the semantic token tree into `"surface.ground" -> { dark, light }`, joining keys with `.`. */
function flattenSemantic(
  node: SemanticGroup,
  prefix = "",
  out: Record<string, { dark: string; light: string }> = {},
): Record<string, { dark: string; light: string }> {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isLeaf(value)) {
      out[path] = value.$value;
    } else {
      flattenSemantic(value, path, out);
    }
  }
  return out;
}

const flatSemantic = flattenSemantic(semantic);

const REF_PATTERN = /^\{(.+)\}$/;

const rampsByName: Record<string, RampSteps> = ramps;

function resolveRef(ref: string): string {
  // ref shape: "color.<ramp>.<step>"
  const parts = ref.split(".");
  const ramp = parts[1];
  const step = parts[2];
  const steps = ramp ? rampsByName[ramp] : undefined;
  const hex = steps && step ? steps[step] : undefined;
  if (!hex) {
    throw new Error(`Unresolvable token reference: {${ref}}`);
  }
  return hex;
}

/**
 * Resolve a dotted semantic token name (e.g. `"surface.ground"`, `"text.on-accent"`,
 * `"metal.champagne.line"`) for a theme into its final hex color or rgba string.
 * rgba literals are returned unchanged.
 */
export function resolve(name: string, theme: Theme): string {
  const entry = flatSemantic[name];
  if (!entry) {
    throw new Error(`Unknown semantic token: ${name}`);
  }
  const raw = entry[theme];
  const match = raw.match(REF_PATTERN);
  if (match && match[1]) {
    return resolveRef(match[1]);
  }
  return raw;
}
