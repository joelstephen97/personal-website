<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-4"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-50"
    >
      <div
        class="glass-solid rounded-2xl p-4 shadow-xl border-accent/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-foreground">Install this app</p>
          <p class="text-xs text-muted mt-0.5">
            Add to home screen for a faster, app-like experience.
          </p>
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            class="btn-primary text-sm py-2 px-4 flex-1 sm:flex-none"
            @click="install"
          >
            Install
          </button>
          <button
            type="button"
            class="btn-secondary text-sm py-2 px-4"
            @click="dismiss"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSessionStorage } from "@vueuse/core";

const STORAGE_KEY = "pwa-install-dismissed";

const { $pwa } = useNuxtApp();
const dismissed = useSessionStorage(STORAGE_KEY, false);
const showPrompt = ref(false);

type PwaRef = { value: boolean } | boolean;

onMounted(() => {
  if (import.meta.server) return;
  const installed = ($pwa?.isPWAInstalled as PwaRef | undefined);
  if (installed && (typeof installed === "object" ? installed.value : installed)) return;
  if (dismissed.value) return;
  const prompt = ($pwa?.showInstallPrompt as PwaRef | undefined);
  showPrompt.value = !!(prompt && (typeof prompt === "object" ? prompt.value : prompt));
});

watch(
  () => {
    const prompt = ($pwa?.showInstallPrompt as PwaRef | undefined);
    return !!(prompt && (typeof prompt === "object" ? prompt.value : prompt));
  },
  (val) => {
    if (val && !dismissed.value) {
      showPrompt.value = true;
    }
  },
  { immediate: true }
);

async function install() {
  try {
    await $pwa?.install?.();
    showPrompt.value = false;
  } catch {
    showPrompt.value = false;
  }
}

function dismiss() {
  dismissed.value = true;
  $pwa?.cancelInstall?.();
  showPrompt.value = false;
}
</script>
