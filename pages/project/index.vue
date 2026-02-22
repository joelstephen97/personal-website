<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <header class="text-center mb-8" aria-labelledby="projects-heading">
      <p class="text-xs font-medium text-accent tracking-wide uppercase mb-2">
        Portfolio
      </p>
      <h1
        id="projects-heading"
        class="text-h2 font-bold text-foreground mb-1"
      >
        Projects
      </h1>
      <p class="text-sm text-muted">
        Work and side projects.
      </p>
    </header>

    <DragDropProvider @dragEnd="onDragEnd">
    <!-- Work (priority, full width first) -->
    <section class="mb-8" aria-labelledby="professional-heading">
      <div class="flex items-center gap-2 mb-4">
        <div
          class="w-6 h-6 rounded-md bg-accent flex items-center justify-center"
        >
          <Icon name="Briefcase" :size="14" class="text-white" />
        </div>
        <h2 id="professional-heading" class="text-lg font-semibold text-foreground">
          Work
        </h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <WorkCard
          v-for="project in professional"
          :key="project.name"
          :project="project"
        />
      </div>
    </section>

    <!-- Bookmarked + Side Projects -->
    <div class="grid lg:grid-cols-2 gap-6 mb-8">
      <!-- Bookmarked Side Projects -->
      <ProjectsDragDropContent
        :stashed-projects="stashedProjects"
        :stashed-ids="stashedIds"
        :on-stash="toggleStash"
        :expanded-project-id="expandedProjectId"
        :on-expand-project="toggleExpandProject"
      />

    <!-- All other side projects (right column on lg, full width below) -->
    <section aria-labelledby="side-projects-heading" class="overflow-visible">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-md bg-[rgb(var(--foreground-muted))] flex items-center justify-center shrink-0"
          >
            <Icon name="Sparkles" :size="14" class="text-white" />
          </div>
          <div>
            <h2 id="side-projects-heading" class="text-lg font-semibold text-foreground">
              Side Projects
            </h2>
            <p class="text-xs text-muted mt-0.5">
              {{ hobbiesData.length }} projects
              <span class="mx-1.5">·</span>
              <span title="Drag to bookmark/unbookmark">
                <Icon name="Bookmark" :size="12" class="inline align-middle" />
                Drag to bookmark
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative flex items-center">
            <Icon
              name="Search"
              :size="16"
              class="absolute left-2.5 text-muted-foreground pointer-events-none"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-40 sm:w-48 pl-9 pr-9 py-2 rounded-lg text-sm bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <button
              v-if="isModelReady"
              type="button"
              :class="[
                'absolute right-1.5 p-1 rounded-md transition-colors',
                voiceSearch.isListening.value || voiceSearch.isProcessing.value
                  ? 'text-accent bg-accent/10'
                  : 'text-muted hover:text-accent hover:bg-accent/10',
              ]"
              :disabled="voiceSearch.isProcessing.value"
              :aria-label="
                voiceSearch.isProcessing.value
                  ? 'Transcribing...'
                  : voiceSearch.isListening.value
                    ? 'Stop recording'
                    : 'Voice search'
              "
              @click="
                voiceSearch.isListening.value
                  ? voiceSearch.stopRecording()
                  : voiceSearch.startRecording()
              "
            >
              <Icon
                v-if="voiceSearch.isProcessing.value"
                name="Loader2"
                :size="18"
                class="animate-spin"
              />
              <Icon v-else-if="voiceSearch.isListening.value" name="Square" :size="18" />
              <Icon v-else name="Mic" :size="18" />
            </button>
          </div>
          <p v-if="voiceSearchError" class="text-xs text-amber-600 mt-1">
            {{ voiceSearchError }}
          </p>
        </div>
      </div>

        <ProjectsGridZone>
          <template v-if="showSkeleton">
            <SkeletonCard v-for="i in 6" :key="`skeleton-${i}`" />
          </template>
          <SortableProjectCard
            v-else
            v-for="(project, index) in gridHobbies"
            :key="project.id"
            :project="project"
            :index="index"
            :stashed-ids="stashedIds"
            :on-stash="toggleStash"
            :expanded="expandedProjectId === project.id"
            :on-expand="() => toggleExpandProject(project.id)"
            group="grid"
          />
        </ProjectsGridZone>
    </section>
    </div>
    </DragDropProvider>
  </div>
</template>

<script setup lang="ts">
import { DragDropProvider } from "@dnd-kit/vue";
import { isSortable } from "@dnd-kit/vue/sortable";
import { useStorage, useVibrate } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";
import SortableProjectCard from "~/components/SortableProjectCard.vue";
import ProjectsDragDropContent from "~/components/ProjectsDragDropContent.vue";
import ProjectsGridZone from "~/components/ProjectsGridZone.vue";

const ORDER_KEY = "project-card-order";
const STASH_KEY = "project-stash";
const STASH_ZONE_ID = "stash-zone";
const GRID_ZONE_ID = "grid-zone";

const orderStorage = useStorage<number[]>(ORDER_KEY, []);
const stashedIds = useStorage<number[]>(STASH_KEY, []);
const { vibrate, isSupported: vibrateSupported } = useVibrate();

const hobbiesData = [
  { id: 1, slug: "rainbow-6-randomizer", title: "R6 Siege Randomizer", description: "Random operator selection for Rainbow Six Siege matches.", link: "/project/rainbow-6-randomizer", cta: "Try it", icon: "Shuffle", tech: ["Game"] },
  { id: 2, slug: "bg-remover", title: "Background Remover", description: "AI-powered tool to remove image backgrounds instantly.", link: "/project/bg-remover", cta: "Remove backgrounds", icon: "ImageMinus", tech: ["AI", "Image"] },
  { id: 3, slug: "aim-trainer", title: "Aim Trainer", description: "Improve your FPS aim with this reaction time trainer.", link: "/project/aim-trainer", cta: "Train now", icon: "Target", tech: ["Game"] },
  { id: 4, slug: "sorting-visualizer", title: "Sorting Visualizer", description: "Watch bubble, merge, quick, and heap sort race in real-time.", link: "/project/sorting-visualizer", cta: "Visualize", icon: "BarChart3", tech: ["Algorithms"] },
  { id: 5, slug: "pathfinding-visualizer", title: "Pathfinding Visualizer", description: "A*, Dijkstra, and BFS on an interactive grid with walls.", link: "/project/pathfinding-visualizer", cta: "Find paths", icon: "Route", tech: ["Algorithms"] },
  { id: 6, slug: "game-of-life", title: "Game of Life", description: "Conway's cellular automaton with presets and canvas rendering.", link: "/project/game-of-life", cta: "Simulate", icon: "Grid3x3", tech: ["Simulation"] },
  { id: 7, slug: "regex-tester", title: "Regex Tester", description: "Real-time regex matching with highlighted results and capture groups.", link: "/project/regex-tester", cta: "Test regex", icon: "Regex", tech: ["Dev Tools"] },
  { id: 8, slug: "json-diff", title: "JSON Diff", description: "Deep recursive comparison of two JSON objects with color-coded output.", link: "/project/json-diff", cta: "Compare", icon: "GitCompareArrows", tech: ["Dev Tools"] },
  { id: 9, slug: "cron-parser", title: "Cron Parser", description: "Parse cron expressions into human-readable schedules with next runs.", link: "/project/cron-parser", cta: "Parse cron", icon: "Clock", tech: ["Dev Tools"] },
  { id: 10, slug: "hash-generator", title: "Hash Generator", description: "SHA-1/256/384/512 hashing for text and files via Web Crypto API.", link: "/project/hash-generator", cta: "Generate hash", icon: "Fingerprint", tech: ["Dev Tools", "Crypto"] },
  { id: 11, slug: "color-palette", title: "Color Palette", description: "Generate harmonious palettes with color theory and contrast checking.", link: "/project/color-palette", cta: "Create palette", icon: "Palette", tech: ["Design"] },
  { id: 12, slug: "markdown-previewer", title: "Markdown Previewer", description: "Split-pane editor with live preview powered by a hand-rolled parser.", link: "/project/markdown-previewer", cta: "Write markdown", icon: "FileText", tech: ["Dev Tools"] },
  { id: 13, slug: "audio-visualizer", title: "Audio Visualizer", description: "Real-time waveform and frequency visualization via Web Audio API.", link: "/project/audio-visualizer", cta: "Visualize audio", icon: "AudioLines", tech: ["Web API", "Visualization"] },
  { id: 14, slug: "image-captioning", title: "Image Captioning", description: "AI-powered image descriptions run entirely in the browser.", link: "/project/image-captioning", cta: "Caption images", icon: "Image", tech: ["AI", "Image"] },
  { id: 15, slug: "screen-capture", title: "Screen Capture & Annotation", description: "Capture screen, draw annotations, share via Web Share API.", link: "/project/screen-capture", cta: "Capture screen", icon: "Monitor", tech: ["Web API"] },
  { id: 16, slug: "eye-dropper", title: "Eye Dropper", description: "Pick colors from anywhere on screen via the native EyeDropper API.", link: "/project/eye-dropper", cta: "Pick colors", icon: "Pipette", tech: ["Web API", "Design"] },
  { id: 17, slug: "speech-to-text", title: "Speech to Text", description: "Transcribe audio with Whisper AI—runs entirely in your browser.", link: "/project/speech-to-text", cta: "Transcribe", icon: "Mic", tech: ["AI", "Web API"] },
  { id: 18, slug: "local-file-editor", title: "Local File Editor", description: "Edit text files directly on disk via File System Access API.", link: "/project/local-file-editor", cta: "Edit files", icon: "FilePen", tech: ["Web API", "Dev Tools"] },
];

function saveOrder(ids: number[]) {
  orderStorage.value = ids;
}

function buildHobbiesFromOrder(order: number[], pinned: number[]) {
  const gridOrder = order.filter((id) => !pinned.includes(id));
  const fullOrder = [...pinned, ...gridOrder];
  const ordered = fullOrder
    .map((id) => hobbiesData.find((p) => p.id === id))
    .filter(Boolean) as (typeof hobbiesData)[number][];
  const remaining = hobbiesData.filter(
    (p) => !fullOrder.includes(p.id)
  );
  return [...ordered, ...remaining];
}

const hobbies = computed(() =>
  buildHobbiesFromOrder(orderStorage.value, stashedIds.value)
);

const stashedProjects = computed(() =>
  hobbiesData.filter((p) => stashedIds.value.includes(p.id))
);

function stash(id: number) {
  if (!stashedIds.value.includes(id)) {
    stashedIds.value = [...stashedIds.value, id];
    const gridIds = hobbies.value
      .filter((p) => !stashedIds.value.includes(p.id))
      .map((p) => p.id);
    saveOrder([...stashedIds.value, ...gridIds]);
  }
}

function unstash(id: number) {
  stashedIds.value = stashedIds.value.filter((x) => x !== id);
  const gridIds = hobbies.value
    .filter((p) => !stashedIds.value.includes(p.id))
    .map((p) => p.id);
  saveOrder([...stashedIds.value, ...gridIds]);
}

function toggleStash(id: number) {
  if (stashedIds.value.includes(id)) unstash(id);
  else stash(id);
}

const expandedProjectId = ref<number | null>(null);
function toggleExpandProject(id: number) {
  expandedProjectId.value = expandedProjectId.value === id ? null : id;
}

const searchQuery = ref("");
const voiceSearch = useVoiceSearch(searchQuery, { manualStop: true });
const { loadError: voiceSearchError, isModelReady } = voiceSearch;

const gridHobbies = computed(() => {
  const nonPinned = hobbies.value.filter(
    (p) => !stashedIds.value.includes(p.id)
  );
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return nonPinned;
  return nonPinned.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
});


function onDragEnd(event: {
  canceled?: boolean;
  operation?: { source?: unknown; target?: { id?: string | number } };
}) {
  if (event.canceled) return;
  const { source, target } = event.operation ?? {};
  const targetId = (target as { id?: string | number })?.id;

  if (targetId === STASH_ZONE_ID && source) {
    const id = (source as { id?: number }).id;
    if (typeof id === "number" && !stashedIds.value.includes(id)) {
      stash(id);
      if (vibrateSupported.value) vibrate(50);
    }
    return;
  }

  if (targetId === GRID_ZONE_ID && source) {
    const id = (source as { id?: number }).id;
    if (typeof id === "number" && stashedIds.value.includes(id)) {
      unstash(id);
      if (vibrateSupported.value) vibrate(50);
    }
    return;
  }

  const sourceId = (source as { id?: number })?.id;
  if (
    source &&
    typeof sourceId === "number" &&
    !stashedIds.value.includes(sourceId)
  ) {
    const targetProjectId = (target as { id?: number })?.id;
    if (
      targetProjectId &&
      stashedIds.value.includes(targetProjectId)
    ) {
      const targetIndex = stashedIds.value.indexOf(targetProjectId);
      const next = [...stashedIds.value];
      next.splice(targetIndex, 0, sourceId);
      stashedIds.value = next;
      const gridIds = hobbies.value
        .filter((p) => !stashedIds.value.includes(p.id))
        .map((p) => p.id);
      saveOrder([...stashedIds.value, ...gridIds]);
      if (vibrateSupported.value) vibrate(50);
      return;
    }
  }

  if (source && isSortable(source)) {
    const { initialIndex, index, id } = source as {
      initialIndex: number;
      index: number;
      id: number;
    };
    const isFromPinned = stashedIds.value.includes(id);
    const targetProjectId = (target as { id?: number })?.id;
    const isTargetPinned =
      typeof targetProjectId === "number" &&
      stashedIds.value.includes(targetProjectId);
    if (isFromPinned && !isTargetPinned) {
      unstash(id);
      if (vibrateSupported.value) vibrate(50);
      return;
    }
    if (!isFromPinned && isTargetPinned) return;
    if (initialIndex !== index) {
      if (isFromPinned) {
        const next = [...stashedIds.value];
        const [removed] = next.splice(initialIndex, 1);
        next.splice(index, 0, removed);
        stashedIds.value = next;
      } else {
        const gridList = hobbies.value.filter(
          (p) => !stashedIds.value.includes(p.id)
        );
        const next = [...gridList];
        const [removed] = next.splice(initialIndex, 1);
        next.splice(index, 0, removed);
        saveOrder([...stashedIds.value, ...next.map((p) => p.id)]);
      }
      if (vibrateSupported.value) vibrate(50);
    }
  }
}

const showSkeleton = ref(true);
onMounted(() => {
  const isReturning =
    import.meta.client && sessionStorage.getItem("project-list-returning");
  if (import.meta.client) sessionStorage.removeItem("project-list-returning");

  if (isReturning) {
    showSkeleton.value = false;
    const saved = sessionStorage.getItem("project-list-scroll");
    if (saved !== null) {
      sessionStorage.removeItem("project-list-scroll");
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number.parseInt(saved, 10), behavior: "auto" });
      });
    }
    return;
  }
  requestAnimationFrame(() => {
    setTimeout(() => {
      showSkeleton.value = false;
      const saved = sessionStorage.getItem("project-list-scroll");
      if (saved !== null) {
        sessionStorage.removeItem("project-list-scroll");
        requestAnimationFrame(() => {
          window.scrollTo({ top: Number.parseInt(saved, 10), behavior: "auto" });
        });
      }
    }, 400);
  });
});

const professional = [
  {
    name: "Opus",
    company: "APPLIED AI INNOVATION RESEARCH - SOLE PROPRIETORSHIP L.L.C.",
    url: "https://app.opus.com/",
    icon: "Workflow",
    description:
      "Low-code/no-code AI workflow builder. Built core features for creating and deploying AI-driven automation processes.",
    tech: ["Vue.js", "React", "TypeScript", "Node.js"],
  },
  {
    name: "Flower Meister International",
    company: "Otani Trading FZCO",
    url: "https://flowermeister.com/",
    icon: "Flower2",
    description:
      "B2B platform connecting flower growers and exporters with importers worldwide. Led frontend development and UI/UX design.",
    tech: ["Nuxt.js", "Vue.js", "GraphQL", "Python"],
  },
  {
    name: "RIOT",
    company: "Preowned Collective Portal (Acquired)",
    url: "https://wayback-classic.net/cgi-bin/history.cgi?q=riothere.com&utf8=%E2%9C%93",
    icon: "ShoppingBag",
    description:
      "Luxury consignment e-commerce platform. Built payment integrations, APIs, and managed live website operations.",
    tech: ["PHP", "React", "Next.js", "REST APIs"],
  },
];
</script>
