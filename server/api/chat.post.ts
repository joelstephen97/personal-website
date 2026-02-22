import { JOEL_CONTEXT } from "../utils/joel-context";
import { CHAT_MODELS, DEFAULT_CHAT_MODEL_ID, GROQ_CHAT_URL } from "../utils/chat-models";
import {
  buildXmlSystemMessage,
  type PersonalityId,
} from "../utils/chat-personalities";
import {
  detectJailbreakAttempt,
  sanitizeUserInput,
  escapeXmlForUntrustedInput,
  validateOutput,
  REFUSAL_MESSAGE,
} from "../utils/chat-guardrails";

const VALID_PERSONALITIES = ["yoda", "tony", "house"] as const;

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    messages: { role: string; content: string }[];
    personality?: string;
  }>(event);
  const rawMessages = body?.messages;
  const personalityId = (VALID_PERSONALITIES.includes(
    body?.personality as (typeof VALID_PERSONALITIES)[number]
  )
    ? body?.personality
    : "yoda") as PersonalityId;

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    throw createError({
      statusCode: 400,
      message: "messages array is required",
    });
  }

  for (const msg of rawMessages) {
    if (msg.role === "user" && typeof msg.content === "string") {
      if (detectJailbreakAttempt(msg.content)) {
        return { content: REFUSAL_MESSAGE };
      }
    }
  }

  const messages = rawMessages
    .map((m) => {
      if (m.role === "user") {
        const sanitized = sanitizeUserInput(m.content);
        if (!sanitized) return null;
        const escaped = escapeXmlForUntrustedInput(sanitized);
        return { role: m.role, content: `<untrusted_user_input>\n${escaped}\n</untrusted_user_input>` };
      }
      return (m.content as string).length > 0 ? { role: m.role, content: m.content } : null;
    })
    .filter((m): m is { role: string; content: string } => m !== null);

  if (messages.length === 0 || messages.every((m) => m.role !== "user")) {
    throw createError({
      statusCode: 400,
      message: "messages array is required",
    });
  }

  const model = CHAT_MODELS.find((m) => m.id === DEFAULT_CHAT_MODEL_ID);
  if (!model) {
    throw createError({
      statusCode: 500,
      message: "Chat model not configured",
    });
  }

  const config = useRuntimeConfig();
  const apiKey = config.groqApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message:
        "Chat is not configured. Set GROQ_API_KEY in environment variables.",
    });
  }

  const systemMessage = {
    role: "system",
    content: buildXmlSystemMessage(personalityId, JOEL_CONTEXT),
  };

  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.modelId,
      messages: [systemMessage, ...messages],
      max_tokens: 512,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw createError({
      statusCode: response.status,
      message: `AI provider error: ${response.statusText}. ${err.slice(0, 200)}`,
    });
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const rawContent = data.choices?.[0]?.message?.content ?? "No response generated.";

  const { safe, filtered } = validateOutput(rawContent);
  const content = safe ? rawContent : (filtered ?? REFUSAL_MESSAGE);

  return { content };
});
