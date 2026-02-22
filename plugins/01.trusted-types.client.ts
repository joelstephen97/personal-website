import DOMPurify from "dompurify";

const ALLOWED_SCRIPT_ORIGINS = [
  "https://cdn.jsdelivr.net",
  "https://va.vercel-insights.com",
  "https://va.vercel-scripts.com",
];

export default defineNuxtPlugin(() => {
  if (typeof window === "undefined") return;
  const tt = (window as Window & {
    trustedTypes?: {
      createPolicy: (
        name: string,
        config: {
          createHTML: (input: string) => unknown;
          createScriptURL?: (input: string) => string;
          createScript?: (input: string) => string;
        }
      ) => unknown;
    };
  }).trustedTypes;
  if (!tt?.createPolicy) return;
  try {
    tt.createPolicy("default", {
      createHTML: (input: string) =>
        DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: true }),
      createScriptURL: (input: string) => {
        let url: URL;
        try {
          url = new URL(input, window.location.origin);
        } catch {
          throw new Error("Invalid script URL");
        }
        const allowed =
          url.protocol === "blob:" ||
          url.origin === window.location.origin ||
          ALLOWED_SCRIPT_ORIGINS.includes(url.origin);
        if (!allowed) {
          throw new Error("Script URL not in allowlist");
        }
        return input;
      },
      createScript: (input: string) => {
        const trimmed = input.trim();
        if (
          (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"))
        ) {
          return input;
        }
        throw new Error("Only JSON-LD scripts allowed");
      },
    });
  } catch {
    // Policy may already exist
  }
});
