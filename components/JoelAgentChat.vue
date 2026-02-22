<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed z-50 flex flex-col rounded-2xl glass-solid shadow-xl border border-border overflow-hidden inset-x-4 bottom-[5.5rem] w-auto max-w-[400px] h-[min(520px,calc(100dvh-8rem))] sm:inset-x-auto sm:left-auto sm:right-6 sm:bottom-[5.5rem] sm:w-[380px] sm:h-[min(560px,calc(100dvh-10rem))]"
      >
        <div
          class="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-[rgb(var(--glass))] shrink-0"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
            >
              <Bot :size="16" class="text-accent" />
            </div>
            <select
              v-model="personality"
              class="min-w-0 max-w-[140px] text-sm font-medium text-foreground bg-transparent border-0 cursor-pointer focus:outline-none focus:ring-0 [&>option]:bg-[rgb(var(--bg))]"
              aria-label="Select chat personality"
            >
              <option v-for="p in CHAT_PERSONALITIES" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-0.5 shrink-0">
            <button
              v-if="messages.length > 0"
              type="button"
              class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              aria-label="Clear chat"
              @click="clearChat"
            >
              <Trash2 :size="16" />
            </button>
            <button
              type="button"
              class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              aria-label="Close chat"
              @click="closeChat"
            >
              <X :size="18" />
            </button>
          </div>
        </div>

        <div
          ref="messagesEl"
          class="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 min-h-0"
        >
          <div
            v-if="messages.length === 0"
            class="flex flex-col items-center justify-center h-full min-h-[180px] text-center px-3 py-4"
          >
            <p class="text-sm text-muted-foreground mb-3">
              Ask about Joel's experience, projects, or skills.
            </p>
            <div class="flex flex-wrap gap-1.5 justify-center">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                @click="askSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="[
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start',
            ]"
          >
            <div
              :class="[
                'max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed break-words shadow-sm',
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-md'
                  : 'bg-[rgb(var(--glass))] border border-border text-foreground rounded-bl-md',
              ]"
            >
              {{ displayContent(msg, i) }}
              <span
                v-if="
                  msg.role === 'assistant' &&
                  i === lastAssistantIndex &&
                  typingContent
                "
                class="inline-block w-2 h-3.5 ml-0.5 bg-accent/70 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>
          <div v-if="isLoading" class="flex justify-start">
            <div
              class="rounded-xl rounded-bl-md px-3 py-2 bg-[rgb(var(--glass))] border border-border flex items-center gap-2"
            >
              <span class="text-muted-foreground text-sm">typing</span>
              <span class="flex gap-0.5">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                  style="animation-delay: 0ms"
                />
                <span
                  class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                  style="animation-delay: 120ms"
                />
                <span
                  class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                  style="animation-delay: 240ms"
                />
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="error || voiceError"
          class="px-3 py-1.5 text-xs text-error bg-error/10 border-t border-error/20"
        >
          {{ error || voiceError }}
        </div>

        <form
          class="p-2.5 border-t border-border flex items-center gap-2 shrink-0"
          @submit.prevent="sendMessage"
        >
          <div class="relative flex-1 min-w-0">
            <input
              v-model="input"
              type="text"
              placeholder="Ask about Joel..."
              class="w-full px-3 py-2.5 pr-11 rounded-lg bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-sm"
              :disabled="isLoading"
            />
            <button
              v-if="isModelReady"
              type="button"
              :class="[
                'absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors',
                voiceInput.isListening.value || voiceInput.isProcessing.value
                  ? 'text-accent bg-accent/10'
                  : 'text-muted hover:text-accent hover:bg-accent/10',
              ]"
              :disabled="voiceInput.isProcessing.value || isLoading"
              :aria-label="
                voiceInput.isProcessing.value
                  ? 'Transcribing...'
                  : voiceInput.isListening.value
                    ? 'Stop recording'
                    : 'Voice input'
              "
              @click="
                voiceInput.isListening.value
                  ? voiceInput.stopRecording()
                  : voiceInput.startRecording()
              "
            >
              <Loader2
                v-if="voiceInput.isProcessing.value"
                :size="18"
                class="animate-spin"
              />
              <Square v-else-if="voiceInput.isListening.value" :size="18" />
              <Mic v-else :size="18" />
            </button>
          </div>
          <button
            type="submit"
            :disabled="!input.trim() || isLoading"
            class="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <Loader2 v-if="isLoading" :size="20" class="animate-spin" />
            <Send v-else :size="20" />
          </button>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Bot, Loader2, Mic, Send, Square, Trash2, X } from "lucide-vue-next";
import { CHAT_PERSONALITIES } from "~/composables/useJoelAgent";

const {
  messages,
  input,
  isLoading,
  typingContent,
  error,
  isOpen,
  personality,
  closeChat,
  sendMessage,
  clearChat,
} = useJoelAgent();

const lastAssistantIndex = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].role === "assistant") return i;
  }
  return -1;
});

function displayContent(
  msg: { role: string; content: string },
  i: number,
): string {
  if (msg.role !== "assistant" || i !== lastAssistantIndex.value)
    return msg.content;
  return typingContent.value || msg.content;
}

const voiceInput = useVoiceSearch(input, { manualStop: true });
const { loadError: voiceError, isModelReady } = voiceInput;
const messagesEl = ref<HTMLElement | null>(null);

const suggestions = [
  "What's Joel's experience with Vue?",
  "Tell me about his projects",
  "What companies has he worked at?",
];

function askSuggestion(suggestion: string) {
  input.value = suggestion;
  nextTick(() => sendMessage());
}

function scrollToBottom() {
  nextTick(() => {
    messagesEl.value?.scrollTo({
      top: messagesEl.value.scrollHeight,
      behavior: "smooth",
    });
  });
}

watch(() => messages.value.length, scrollToBottom);
watch(typingContent, scrollToBottom);
</script>
