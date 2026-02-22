<script setup lang="ts">
import type { Component } from "vue";
import { Circle } from "lucide-vue-next";
import { computed, defineAsyncComponent } from "vue";

const iconLoaders = import.meta.glob<{ default: Component }>(
  "../../node_modules/lucide-vue-next/dist/esm/icons/*.js",
  { eager: false },
);

const ICON_PATHS: Record<string, string> = {
  ArrowLeft: "arrow-left",
  ArrowLeftRight: "arrow-left-right",
  ArrowRight: "arrow-right",
  ArrowUpRight: "arrow-up-right",
  AudioLines: "audio-lines",
  BarChart3: "chart-column",
  Bold: "bold",
  BookOpen: "book-open",
  Bookmark: "bookmark",
  BookmarkCheck: "bookmark-check",
  Bot: "bot",
  Briefcase: "briefcase",
  Calendar: "calendar",
  Camera: "camera",
  Check: "check",
  CheckCircle: "circle-check-big",
  ChevronDown: "chevron-down",
  ChevronUp: "chevron-up",
  Circle: "circle",
  CircleAlert: "circle-alert",
  Clock: "clock",
  Code: "code",
  Copy: "copy",
  Crosshair: "crosshair",
  Download: "download",
  Eraser: "eraser",
  FileDown: "file-down",
  FileJson: "file-json",
  FilePen: "file-pen",
  FilePlus: "file-plus",
  FileText: "file-text",
  Fingerprint: "fingerprint",
  Flower2: "flower-2",
  FolderOpen: "folder-open",
  GitCompareArrows: "git-compare-arrows",
  Github: "github",
  GripVertical: "grip-vertical",
  Grid3x3: "grid-3x3",
  Heading: "heading",
  Image: "image",
  ImageMinus: "image-minus",
  Italic: "italic",
  LayoutGrid: "layout-grid",
  Link: "link",
  Linkedin: "linkedin",
  List: "list",
  Loader2: "loader-circle",
  Mail: "mail",
  MapPin: "map-pin",
  Maximize: "maximize",
  Menu: "menu",
  MessageCircle: "message-circle",
  Mic: "mic",
  MicOff: "mic-off",
  Minus: "minus",
  Minimize: "minimize",
  Monitor: "monitor",
  Moon: "moon",
  Palette: "palette",
  Pause: "pause",
  Pencil: "pencil",
  Pipette: "pipette",
  Play: "play",
  Quote: "quote",
  Regex: "regex",
  Route: "route",
  RotateCcw: "rotate-ccw",
  Save: "save",
  Search: "search",
  Send: "send",
  Settings: "settings",
  Share2: "share-2",
  Shuffle: "shuffle",
  ShoppingBag: "shopping-bag",
  SkipForward: "skip-forward",
  Sparkles: "sparkles",
  Square: "square",
  Strikethrough: "strikethrough",
  Sun: "sun",
  Target: "target",
  Timer: "timer",
  Trash2: "trash-2",
  Undo2: "undo-2",
  Upload: "upload",
  User: "user",
  Workflow: "workflow",
  X: "x",
  XCircle: "circle-x",
  Youtube: "youtube",
  Zap: "zap",
};

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    strokeWidth?: number;
  }>(),
  {
    size: 20,
    strokeWidth: 2,
  },
);

function normalizeName(name: string): string {
  return name
    .replace(/^i-/, "")
    .replace(/-./g, (x) => x[1].toUpperCase())
    .replace(/^./, (x) => x.toUpperCase());
}

const iconComponent = computed((): Component => {
  const pascalName = normalizeName(props.name);
  const kebab = ICON_PATHS[pascalName];

  if (!kebab || kebab === "circle") {
    return Circle;
  }

  const iconFile = `${kebab}.js`;
  const loader = Object.entries(iconLoaders).find(([p]) =>
    p.endsWith(iconFile),
  )?.[1];
  if (!loader) {
    return Circle;
  }

  return defineAsyncComponent({
    loader: () => loader().then((m) => m.default),
    loadingComponent: Circle,
    errorComponent: Circle,
  });
});
</script>

<template>
  <component
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    class="inline-block flex-shrink-0"
  />
</template>
