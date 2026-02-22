const CHAT_STORAGE_KEY = "joel-agent-chat";
const PERSONALITY_STORAGE_KEY = "joel-agent-personality";
const MIN_RESPONSE_DELAY_MS = 600;
const TYPING_CHAR_MS = 28;
const PUNCTUATION_PAUSE_MS = 320;
const PUNCTUATION_CHARS = new Set([".", ",", ";", "!", "?", ":"]);


export const CHAT_PERSONALITIES = [
  { id: "yoda", name: "Master Yoda" },
  { id: "tony", name: "Tony Stark" },
  { id: "house", name: "Dr. House" },
] as const;

export type PersonalityId = (typeof CHAT_PERSONALITIES)[number]["id"];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function loadStoredMessages(): ChatMessage[] {
  if (import.meta.server) return [];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        "content" in m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  if (import.meta.server) return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota / storage errors
  }
}

function loadStoredPersonality(): PersonalityId {
  if (import.meta.server) return "yoda";
  try {
    const raw = localStorage.getItem(PERSONALITY_STORAGE_KEY);
    if (!raw) return "yoda";
    const valid = CHAT_PERSONALITIES.some((p) => p.id === raw);
    return valid ? (raw as PersonalityId) : "yoda";
  } catch {
    return "yoda";
  }
}

function savePersonality(id: PersonalityId) {
  if (import.meta.server) return;
  try {
    localStorage.setItem(PERSONALITY_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function useJoelAgent() {
  const messages = ref<ChatMessage[]>([]);
  const input = ref("");
  const isLoading = ref(false);
  const typingContent = ref("");
  const error = ref<string | null>(null);
  const isOpen = useState("joel-chat-open", () => false);
  const personality = ref<PersonalityId>("yoda");

  onMounted(() => {
    messages.value = loadStoredMessages();
    personality.value = loadStoredPersonality();
  });

  watch(personality, (val) => savePersonality(val));

  watch(
    messages,
    (val) => saveMessages(val),
    { deep: true }
  );

  let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading.value) return;

    messages.value.push({ role: "user", content: text });
    input.value = "";
    error.value = null;
    typingContent.value = "";
    isLoading.value = true;

    const fetchStart = Date.now();

    try {
      const { content } = await $fetch<{ content: string }>("/api/chat", {
        method: "POST",
        body: {
          messages: messages.value.map((m) => ({ role: m.role, content: m.content })),
          personality: personality.value,
        },
      });
      const fullText = content ?? "Sorry, I couldn't generate a response.";
      const elapsed = Date.now() - fetchStart;
      const minDelayRemaining = Math.max(0, MIN_RESPONSE_DELAY_MS - elapsed);

      await new Promise((r) => setTimeout(r, minDelayRemaining));

      messages.value.push({ role: "assistant", content: fullText });
      isLoading.value = false;

      let idx = 0;
      typingContent.value = "";

      function typeNext() {
        if (idx >= fullText.length) {
          typingTimeoutId = null;
          typingContent.value = "";
          return;
        }
        const step = Math.min(2, fullText.length - idx);
        idx += step;
        typingContent.value = fullText.slice(0, idx);
        const lastChar = fullText[idx - 1];
        const delay = PUNCTUATION_CHARS.has(lastChar)
          ? PUNCTUATION_PAUSE_MS
          : TYPING_CHAR_MS;
        typingTimeoutId = setTimeout(typeNext, delay);
      }
      typingTimeoutId = setTimeout(typeNext, TYPING_CHAR_MS);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Something went wrong";
      isLoading.value = false;
    }
  }

  onUnmounted(() => {
    if (typingTimeoutId) clearTimeout(typingTimeoutId);
  });

  function clearChat() {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
    typingContent.value = "";
    messages.value = [];
    error.value = null;
    saveMessages([]);
  }

  function toggleOpen() {
    isOpen.value = !isOpen.value;
  }

  function openChat() {
    isOpen.value = true;
  }

  function closeChat() {
    isOpen.value = false;
  }

  return {
    messages,
    input,
    isLoading,
    typingContent,
    error,
    isOpen,
    personality,
    toggleOpen,
    openChat,
    closeChat,
    sendMessage,
    clearChat,
  };
}
