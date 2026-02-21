<template>
  <div class="max-w-5xl mx-auto px-6 py-20">
    <!-- Hero Section -->
    <section class="pt-0" aria-labelledby="hero-heading">
      <div class="grid lg:grid-cols-5 gap-16 items-start">
        <!-- Left: Content -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Intro -->
          <div class="space-y-4">
            <p class="text-sm font-medium text-accent tracking-wide uppercase">
              Software Engineer
            </p>
            <h1
              id="hero-heading"
              class="text-display font-bold tracking-tight text-foreground"
            >
              Joel Stephen
            </h1>
            <p
              class="text-lg md:text-xl text-muted max-w-lg leading-relaxed"
            >
              Building beautiful, performant web experiences with modern
              technologies.
            </p>

            <!-- Hero CTAs -->
            <div class="flex flex-wrap gap-3 pt-2">
              <UiButton variant="primary" to="/contact">
                Work with me
              </UiButton>
              <UiButton variant="secondary" to="/project">
                View Projects
              </UiButton>
              <UiButton
                variant="tertiary"
                href="https://github.com/joelstephen97"
              >
                <Icon name="Github" :size="18" />
                View Source on GitHub
              </UiButton>
            </div>
          </div>

          <!-- Terminal -->
          <TerminalWindow
            title="about.sh"
            command="cat profile.txt"
            class="max-w-xl"
          >
            Full-stack engineer with 5+ years of experience. Passionate
            about clean code, intuitive UX, and solving complex problems.
          </TerminalWindow>

          <!-- Tech Stack -->
          <div class="space-y-4 pt-8 border-t border-border">
            <p
              class="text-sm font-medium text-muted-foreground uppercase tracking-wide"
            >
              Tech Stack
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="stack in stacks"
                :key="stack.name"
                :aria-pressed="activeStack === stack.name"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]',
                  activeStack === stack.name
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'bg-[rgb(var(--glass))] text-foreground hover:bg-accent/10 hover:text-accent border border-border',
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
                  class="px-3 py-1.5 rounded-lg text-sm bg-accent/10 text-accent font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right: Skills -->
        <aside class="lg:col-span-2" aria-label="Skills and experience">
          <div class="space-y-6">
            <h3
              class="text-sm font-medium text-muted-foreground uppercase tracking-wide"
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
                    class="text-sm font-medium text-foreground"
                    >{{ skill.name }}</span
                  >
                  <span
                    class="text-sm tabular-nums text-muted"
                    >{{ skill.years }} yrs</span
                  >
                </div>
                <div
                  class="h-2 bg-border rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-accent rounded-full transition-all duration-500 group-hover:bg-accent-hover"
                    :style="{ width: `${(skill.years / maxYears) * 100}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="pt-6 mt-6 border-t border-border">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-accent">5+</p>
                  <p class="text-xs text-muted-foreground">
                    Years
                  </p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-accent">
                    {{ timeline.length }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Technologies
                  </p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-accent">16+</p>
                  <p class="text-xs text-muted-foreground">
                    Projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
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
