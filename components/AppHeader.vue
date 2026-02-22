<template>
  <header class="fixed top-0 inset-x-0 z-50 glass">
    <nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <img
          src="https://avatars.githubusercontent.com/u/40371897"
          alt="Joel Stephen"
          class="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-accent/50 transition-all"
        />
        <span
          class="font-semibold text-foreground group-hover:text-accent transition-colors"
        >
          Joel Stephen
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
            route.path === link.to
              ? 'text-accent bg-accent/10'
              : 'text-muted hover:text-foreground hover:bg-[rgb(var(--glass))]',
          ]"
        >
          <Icon :name="link.icon" :size="16" />
          {{ link.label }}
        </NuxtLink>
        <div class="w-px h-5 bg-border mx-2" />
        <button
          type="button"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all btn-primary',
            isChatOpen && 'ring-2 ring-accent ring-offset-2 ring-offset-[rgb(var(--bg))]',
          ]"
          aria-label="Open AI chat to ask about Joel"
          @click="toggleChat"
        >
          <Icon name="MessageCircle" :size="18" />
          AI Chat — Ask about Joel
        </button>
        <DarkModeToggle />
      </div>

      <!-- Mobile -->
      <div class="md:hidden flex items-center gap-2">
        <button
          type="button"
          :class="[
            'p-2.5 rounded-xl transition-colors',
            isChatOpen ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground hover:bg-[rgb(var(--glass))]',
          ]"
          aria-label="Open AI chat to ask about Joel"
          @click="toggleChat"
        >
          <Icon name="MessageCircle" :size="22" />
        </button>
        <DarkModeToggle />
        <button
          aria-label="Toggle menu"
          class="p-2 rounded-xl hover:bg-[rgb(var(--glass))] transition-colors"
          @click="toggleOpen()"
        >
          <Icon :name="open ? 'X' : 'Menu'" :size="22" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="md:hidden px-6 pb-4 space-y-1">
        <button
          type="button"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold w-full btn-primary"
          @click="toggleOpen(false); toggleChat()"
        >
          <Icon name="MessageCircle" :size="20" />
          AI Chat — Ask about Joel
        </button>
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
            route.path === link.to
              ? 'text-accent bg-accent/10'
              : 'text-foreground hover:bg-[rgb(var(--glass))]',
          ]"
          @click="toggleOpen(false)"
        >
          <Icon :name="link.icon" :size="18" />
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useToggle } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

const route = useRoute();
const [open, toggleOpen] = useToggle(false);
const { isOpen: isChatOpen, toggleOpen: toggleChat, openChat } = useJoelAgent();

const links = [
  { to: "/", label: "About", icon: "User" },
  { to: "/experience", label: "Experience", icon: "Briefcase" },
  { to: "/project", label: "Projects", icon: "FolderOpen" },
  { to: "/contact", label: "Contact", icon: "Mail" },
];
</script>
