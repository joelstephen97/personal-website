<template>
  <footer class="fixed bottom-0 inset-x-0 z-40 glass">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <p class="text-sm text-[rgb(var(--foreground-secondary))]">
          © {{ new Date().getFullYear() }} Joel Stephen
        </p>
        <span
          v-if="lastUpdated"
          :title="`Updated ${lastUpdated}. Refreshes when PWA checks for updates.`"
          class="inline-flex items-center p-1.5 rounded-lg text-muted hover:text-foreground"
        >
          <Icon name="Calendar" :size="14" />
        </span>
      </div>
      <div class="flex items-center gap-1">
        <a
          v-for="s in socials"
          :key="s.url"
          :href="s.url"
          target="_blank"
          rel="noopener"
          :aria-label="s.label"
          class="p-2 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all"
        >
          <Icon :name="s.icon" :size="20" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

const lastUpdated = ref<string | null>(null);
onMounted(() => {
  lastUpdated.value = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
});

const socials = [
  {
    url: "https://linkedin.com/in/joelthomasstephen",
    icon: "Linkedin",
    label: "LinkedIn profile",
  },
  {
    url: "https://github.com/joelstephen97",
    icon: "Github",
    label: "GitHub profile",
  },
  {
    url: "https://youtube.com/@he11b1azer6",
    icon: "Youtube",
    label: "YouTube channel",
  },
];
</script>
