<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

const config = useRuntimeConfig();
const route = useRoute();
const siteUrl =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";
const shareTitle = "Joel Stephen | Software Engineer - Full-Stack Developer";
const shareUrl =
  route.path === "/" ? siteUrl : `${siteUrl}${route.path}`;

async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        url: shareUrl,
        text: "Full-stack engineer with 5+ years of experience. Vue, React, Python, TypeScript.",
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback: open share URL in new tab
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        "_blank",
      );
    }
  }
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      aria-label="Share this page"
      class="p-1.5 sm:p-2 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all"
      @click="handleShare"
    >
      <Icon name="Share2" :size="18" />
    </button>
    <template #fallback>
      <span class="p-1.5 sm:p-2 rounded-xl text-muted">
        <Icon name="Share2" :size="18" />
      </span>
    </template>
  </ClientOnly>
</template>
