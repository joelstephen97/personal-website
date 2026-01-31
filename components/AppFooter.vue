<template>
  <footer class="fixed bottom-0 inset-x-0 z-40 glass">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <p class="text-sm text-[rgb(var(--foreground-secondary))]">
        © {{ new Date().getFullYear() }} Joel Stephen
      </p>
      <div class="flex items-center gap-1">
        <a
          v-for="s in socials"
          :key="s.url"
          :href="s.url"
          target="_blank"
          rel="noopener"
          class="p-2 rounded-xl text-[rgb(var(--foreground-secondary))] hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Icon :name="s.icon" :size="20" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

const socials = [
  { url: "https://linkedin.com/in/joelthomasstephen", icon: "Linkedin" },
  { url: "https://github.com/joelstephen97", icon: "Github" },
  { url: "https://youtube.com/@he11b1azer6", icon: "Youtube" },
];
</script>
