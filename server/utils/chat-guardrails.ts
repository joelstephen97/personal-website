/**
 * Industry-standard jailbreak and hallucination prevention (OWASP 2024–2026).
 * Input validation, output sanitization, and strict grounding.
 */

const REFUSAL_MESSAGE =
  "I can only help with questions about Joel's experience and career. How can I assist you with that?";

/** Patterns indicating jailbreak / prompt injection attempts */
const JAILBREAK_PATTERNS = [
  // Direct injection
  /\bignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)\b/i,
  /\b(forget|disregard|override)\s+(all\s+)?(previous|prior|above|your)\b/i,
  /\byou\s+are\s+now\s+(in\s+)?(developer|debug|admin|unrestricted)\s+mode\b/i,
  /\b(developer|debug|DAN|jailbreak)\s+mode\b/i,
  /\breveal\s+(your\s+)?(system\s+)?(prompt|instructions?|rules?)\b/i,
  /\b(show|output|print|display)\s+(your\s+)?(system\s+)?(prompt|instructions?)\b/i,
  /\bwhat\s+(were|are)\s+(your\s+)?(exact\s+)?instructions?\b/i,
  /\bhypothetically\s*,?\s*(if\s+you\s+(could|were|had)|suppose)\b/i,
  /\bpretend\s+(you\s+)?(are|have|don't|do\s+not)\b/i,
  /\bact\s+as\s+if\s+(you\s+)?(are\s+not|have\s+no)\s+(restrictions?|limits?)\b/i,
  /\bbypass\s+(all\s+)?(safety|restrictions?|guardrails?)\b/i,
  /\bsystem\s+override\b/i,
  /\bnew\s+instructions?\s*[:=]\s*/i,
  /\boverride\s+(your\s+)?(instructions?|rules?|constraints?)\b/i,
  // Typoglycemia-style (scrambled middle)
  /\b(ignroe|ignoer|igrnore|revael|reveel|bpyass|bypas)\b/i,
  /\b(delte|deelte|ovverride|overide)\b/i,
  // Roleplay / persona hijack
  /\b(you\s+are|act\s+as|roleplay\s+as)\s+(DAN|another\s+character|a\s+different)\b/i,
  /\bdo\s+anything\s+now\b/i,
  // Prompt extraction
  /\brepeat\s+(the\s+)?(text|words?)\s+(above|before|starting)\b/i,
  /\bstarting\s+with\s+['"]?you\s+are/i,
  // Multi-turn / delayed
  /\bremember\s+this\s+(for\s+later|instruction)\b/i,
  /\bwhen\s+I\s+say\s+["']?[\w]+["']?\s*,?\s*(do|say|output)\b/i,
];

/** High-risk keywords that boost suspicion when combined */
const HIGH_RISK_KEYWORDS = [
  "system prompt",
  "internal",
  "instructions",
  "jailbreak",
  "developer mode",
  "ignore instructions",
  "bypass",
  "override",
  "reveal",
  "leak",
  "exfiltrate",
  "api key",
  "password",
  "secret",
];

const MAX_INPUT_LENGTH = 2000;
const MAX_OUTPUT_LENGTH = 2000;

/** Normalize text for pattern matching: collapse whitespace, remove repetition */
function normalizeForDetection(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/(.)\1{3,}/g, "$1")
    .trim();
}

/** Check if decoded base64 looks like an injection attempt */
function isSuspiciousBase64(decoded: string): boolean {
  const lower = decoded.toLowerCase();
  return (
    lower.includes("ignore") ||
    lower.includes("instruction") ||
    lower.includes("prompt") ||
    lower.includes("bypass") ||
    lower.includes("reveal")
  );
}

/** Attempt to decode base64 and check for injection */
function detectBase64Injection(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 20 || !/^[A-Za-z0-9+/=]+$/.test(trimmed)) return false;
  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf-8");
    return isSuspiciousBase64(decoded);
  } catch {
    return false;
  }
}

export function detectJailbreakAttempt(userInput: string): boolean {
  if (!userInput || typeof userInput !== "string") return true;
  if (userInput.length > MAX_INPUT_LENGTH) return true;
  if (detectXmlInjection(userInput)) return true;

  const normalized = normalizeForDetection(userInput);

  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(normalized)) return true;
  }

  if (detectBase64Injection(normalized)) return true;

  const lower = normalized.toLowerCase();
  const riskCount = HIGH_RISK_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  if (riskCount >= 2) return true;

  return false;
}

/** Sanitize user input: length limit, strip control chars */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

/** Escape XML special chars so user input cannot break out of tags or inject markup */
export function escapeXmlForUntrustedInput(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Detect XML tag injection: user trying to inject our control tags to escape untrusted boundary */
const XML_INJECTION_PATTERNS = [
  /<\s*\/\s*untrusted_user_input\s*>/i,
  /<\s*untrusted_user_input\s*\/?\s*>/i,
  /<\s*system_instructions\s*>/i,
  /<\s*trusted_context\s*>/i,
  /<\s*instructions\s*>/i,
  /<\s*\/\s*instructions\s*>/i,
];

export function detectXmlInjection(userInput: string): boolean {
  if (!userInput || typeof userInput !== "string") return true;
  for (const pattern of XML_INJECTION_PATTERNS) {
    if (pattern.test(userInput)) return true;
  }
  return false;
}

/** Patterns indicating prompt leakage or hallucination in output */
const OUTPUT_LEAKAGE_PATTERNS = [
  /\b(you\s+are|your\s+role|system\s*:)\s*(an?\s+)?(assistant|AI|LLM|model)\s+(that|who)\b/i,
  /\b(system\s+)?(prompt|instructions?)\s*[:=]\s*/i,
  /\b(API[_\s]?KEY|api_key|password)\s*[:=]\s*\S+/i,
  /\b(never\s+reveal|do\s+not\s+disclose)\s+(these\s+)?(instructions?|rules?)\b/i,
  /\d+\.\s*(use\s+only|never\s+invent|advocate\s+for)\b/i,
  /##\s*Core\s+Rules/i,
  /##\s*Context\s*\n/i,
  /<\s*system_instructions\s*>/i,
  /<\s*trusted_context\s*>/i,
  /<\s*untrusted_user_input\s*>/i,
  /<\s*security_rules\s*>/i,
  /<\s*grounding_rules\s*>/i,
];

export function validateOutput(content: string): { safe: boolean; filtered?: string } {
  if (!content || typeof content !== "string") {
    return { safe: false, filtered: REFUSAL_MESSAGE };
  }
  if (content.length > MAX_OUTPUT_LENGTH) {
    return { safe: false, filtered: REFUSAL_MESSAGE };
  }

  for (const pattern of OUTPUT_LEAKAGE_PATTERNS) {
    if (pattern.test(content)) {
      return { safe: false, filtered: REFUSAL_MESSAGE };
    }
  }

  return { safe: true };
}

export { REFUSAL_MESSAGE };
