<template>
  <div class="max-w-5xl mx-auto px-6">
    <!-- Hero Section -->
    <section class="py-20 md:py-32">
      <div class="grid lg:grid-cols-5 gap-16 items-start">
        <!-- Left: Content -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Intro -->
          <div class="space-y-4">
            <p class="text-sm font-medium text-red-500 tracking-wide uppercase">
              Software Engineer
            </p>
            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[rgb(var(--foreground))]"
            >
              Joel Stephen
            </h1>
            <p
              class="text-xl md:text-2xl text-[rgb(var(--foreground-secondary))] max-w-lg leading-relaxed"
            >
              Building beautiful, performant web experiences with modern
              technologies.
            </p>
          </div>

          <!-- Terminal -->
          <div
            class="rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl max-w-xl"
          >
            <div
              class="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 border-b border-white/5"
            >
              <div class="flex gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500" />
                <span class="w-3 h-3 rounded-full bg-yellow-500" />
                <span class="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span class="flex-1 text-center text-xs text-white/50 font-mono"
                >about.sh</span
              >
            </div>
            <div class="p-5 font-mono text-sm text-gray-300 leading-relaxed">
              <p>
                <span class="text-green-400">➜</span>
                <span class="text-cyan-400">~</span> cat profile.txt
              </p>
              <p class="mt-3 text-white/80">
                Full-stack engineer with 5+ years of experience. Passionate
                about clean code, intuitive UX, and solving complex problems.
              </p>
              <p class="mt-3 flex items-center gap-2">
                <span class="text-green-400">➜</span>
                <span class="text-cyan-400">~</span>
                <span class="w-2 h-4 bg-white/80 animate-pulse" />
              </p>
            </div>
          </div>

          <!-- Tech Stack -->
          <div class="space-y-4">
            <p
              class="text-sm font-medium text-[rgb(var(--foreground-muted))] uppercase tracking-wide"
            >
              Tech Stack
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="stack in stacks"
                :key="stack.name"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeStack === stack.name
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-[rgb(var(--glass))] text-[rgb(var(--foreground))] hover:bg-red-500/10 hover:text-red-500 border border-[rgb(var(--border))]',
                ]"
                @click="
                  activeStack = activeStack === stack.name ? null : stack.name
                "
              >
                {{ stack.name }}
              </button>
            </div>
            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 -translate-y-2"
              leave-active-class="transition duration-150"
              leave-to-class="opacity-0"
            >
              <div v-if="activeStack" class="flex flex-wrap gap-2 pt-2">
                <span
                  v-for="tech in currentTechs"
                  :key="tech"
                  class="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-500 font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right: Skills -->
        <div class="lg:col-span-2">
          <div class="space-y-6">
            <h3
              class="text-sm font-medium text-[rgb(var(--foreground-muted))] uppercase tracking-wide"
            >
              Years of Experience
            </h3>

            <div class="space-y-4">
              <div
                v-for="skill in sortedTimeline"
                :key="skill.name"
                class="group"
              >
                <div class="flex items-center justify-between mb-2">
                  <span
                    class="text-sm font-medium text-[rgb(var(--foreground))]"
                    >{{ skill.name }}</span
                  >
                  <span
                    class="text-sm tabular-nums text-[rgb(var(--foreground-secondary))]"
                    >{{ skill.years }} yrs</span
                  >
                </div>
                <div
                  class="h-2 bg-[rgb(var(--border))] rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-red-500 rounded-full transition-all duration-500 group-hover:bg-red-400"
                    :style="{ width: `${(skill.years / maxYears) * 100}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="pt-6 mt-6 border-t border-[rgb(var(--border))]">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-red-500">5+</p>
                  <p class="text-xs text-[rgb(var(--foreground-muted))]">
                    Years
                  </p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-red-500">
                    {{ timeline.length }}
                  </p>
                  <p class="text-xs text-[rgb(var(--foreground-muted))]">
                    Technologies
                  </p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-red-500">16+</p>
                  <p class="text-xs text-[rgb(var(--foreground-muted))]">
                    Projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const activeStack = ref<string | null>(null);

const stacks = [
  {
    name: "Frontend",
    items: ["Vue.js", "React", "TypeScript", "Tailwind CSS"],
  },
  { name: "Backend", items: ["Python", "Node.js", "FastAPI", "PostgreSQL"] },
  { name: "Tools", items: ["Docker", "Git", "Linux", "Cypress"] },
];

const currentTechs = computed(
  () => stacks.find((s) => s.name === activeStack.value)?.items || [],
);

const timeline = [
  { name: "Python", years: 6 },
  { name: "JavaScript", years: 5 },
  { name: "Vue.js", years: 4 },
  { name: "React.js", years: 4 },
  { name: "FastAPI", years: 4 },
  { name: "PostgreSQL", years: 4 },
  { name: "TypeScript", years: 4 },
  { name: "Docker", years: 3 },
  { name: "Kubernetes", years: 3 },
];

const sortedTimeline = computed(() =>
  [...timeline].sort((a, b) => b.years - a.years),
);

const maxYears = computed(() => Math.max(...timeline.map((s) => s.years)));
</script>
