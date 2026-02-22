<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">
          Color Palette
        </h1>
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label
              class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2"
              >Base Color</label
            >
            <div class="flex items-center gap-3">
              <input
                v-model="hex"
                type="color"
                class="w-12 h-12 rounded-xl border-0 cursor-pointer"
              />
              <input
                v-model="hex"
                type="text"
                class="w-28 px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm"
                spellcheck="false"
              />
            </div>
          </div>
          <div>
            <label
              class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2"
              >Harmony</label
            >
            <select v-model="harmony">
              <option v-for="h in harmonies" :key="h.key" :value="h.key">
                {{ h.label }}
              </option>
            </select>
          </div>
          <button
            class="px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 hover:border-accent/50 transition-colors"
            @click="randomColor"
          >
            <Icon name="Shuffle" :size="16" /> Random
          </button>
          <button
            v-if="hasEyeDropper"
            class="px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-semibold flex items-center gap-2 hover:border-accent/50 transition-colors"
            @click="pickFromScreen"
          >
            <Icon name="Pipette" :size="16" /> Pick
          </button>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-4">
          Generated Palette
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div
            v-for="(color, i) in palette"
            :key="i"
            class="group cursor-pointer"
            @click="copyColor(color.hex)"
          >
            <div
              class="h-24 rounded-xl mb-2 shadow-sm transition-transform group-hover:scale-105"
              :style="{ backgroundColor: color.hex }"
            />
            <p
              class="text-xs font-mono text-[rgb(var(--foreground))] text-center"
            >
              {{ color.hex }}
            </p>
            <p
              class="text-[10px] text-[rgb(var(--foreground-muted))] text-center"
            >
              {{ color.rgb }}
            </p>
            <p
              class="text-[10px] text-[rgb(var(--foreground-muted))] text-center"
            >
              {{ color.hslLabel }}
            </p>
          </div>
        </div>
        <p v-if="copiedColor" class="text-xs text-accent text-center mt-3">
          Copied {{ copiedColor }}
        </p>
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-4">
          Tints &amp; Shades
        </h3>
        <div class="flex gap-1 rounded-xl overflow-hidden">
          <div
            v-for="(c, i) in tintsAndShades"
            :key="i"
            class="flex-1 h-16 cursor-pointer hover:scale-y-110 transition-transform relative group"
            :style="{ backgroundColor: c }"
            @click="copyColor(c)"
          >
            <span
              class="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
              :style="{ color: i < 5 ? 'white' : 'black' }"
              >{{ c }}</span
            >
          </div>
        </div>
      </div>

      <div class="glass-solid rounded-2xl p-4 mb-6">
        <h3
          class="text-xs font-semibold text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-2"
        >
          Suggested Text Color
        </h3>
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold"
            :style="{ backgroundColor: hex, color: suggestedTextColor }"
          >
            Aa
          </div>
          <p class="text-sm text-[rgb(var(--foreground-secondary))]">
            Use <strong>{{ suggestedTextColor }}</strong> text on this
            background for best contrast.
          </p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-6 mb-6">
        <div class="glass-solid rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-3">
            Contrast on White
          </h3>
          <div class="flex items-center gap-3">
            <div
              class="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-lg font-bold"
              :style="{ color: hex }"
            >
              Aa
            </div>
            <div>
              <p class="text-2xl font-bold text-[rgb(var(--foreground))]">
                {{ contrastWhite.toFixed(2) }}:1
              </p>
              <p
                class="text-xs"
                :class="
                  contrastWhite >= 4.5 ? 'text-emerald-500' : 'text-accent'
                "
              >
                {{
                  contrastWhite >= 7
                    ? "AAA"
                    : contrastWhite >= 4.5
                      ? "AA"
                      : contrastWhite >= 3
                        ? "AA Large"
                        : "Fail"
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="glass-solid rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-3">
            Contrast on Black
          </h3>
          <div class="flex items-center gap-3">
            <div
              class="w-16 h-16 rounded-xl bg-black flex items-center justify-center text-lg font-bold"
              :style="{ color: hex }"
            >
              Aa
            </div>
            <div>
              <p class="text-2xl font-bold text-[rgb(var(--foreground))]">
                {{ contrastBlack.toFixed(2) }}:1
              </p>
              <p
                class="text-xs"
                :class="
                  contrastBlack >= 4.5 ? 'text-emerald-500' : 'text-accent'
                "
              >
                {{
                  contrastBlack >= 7
                    ? "AAA"
                    : contrastBlack >= 4.5
                      ? "AA"
                      : contrastBlack >= 3
                        ? "AA Large"
                        : "Fail"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Export -->
      <details class="glass-solid rounded-2xl p-6">
        <summary
          class="text-sm font-semibold text-[rgb(var(--foreground))] cursor-pointer select-none flex items-center gap-2"
        >
          <Icon name="Code" :size="16" /> Export
        </summary>
        <div class="mt-4 space-y-4">
          <div>
            <p class="text-xs text-[rgb(var(--foreground-muted))] mb-1">
              Format
            </p>
            <select
              v-model="exportFormat"
              class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-sm mb-2"
            >
              <option value="css">CSS Variables</option>
              <option value="tailwind">Tailwind</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div>
            <pre
              class="text-xs font-mono bg-[rgb(var(--glass))] rounded-lg p-3 border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] overflow-auto"
              >{{ exportContent }}</pre
            >
          </div>
          <button
            class="text-xs text-accent font-medium flex items-center gap-1 hover:opacity-80"
            @click="copyColor(exportContent)"
          >
            <Icon name="Copy" :size="12" /> Copy
          </button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useClipboard, refAutoReset } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "Color Palette | Joel Stephen - Portfolio",
  description:
    "Generate harmonious palettes with color theory and contrast checking.",
  path: "/project/color-palette",
  breadcrumbTitle: "Color Palette",
  projectSchema: {
    name: "Color Palette",
    description:
      "Generate harmonious palettes with color theory and contrast checking.",
  },
});

definePageMeta({ layout: "project-detail" });

const hex = ref("#007AFF");
const harmony = ref("complementary");
const { copy } = useClipboard({ copiedDuring: 2000 });
const copiedColor = refAutoReset("", 2000);

const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

const harmonies = [
  { key: "complementary", label: "Complementary" },
  { key: "analogous", label: "Analogous" },
  { key: "triadic", label: "Triadic" },
  { key: "split", label: "Split-Complementary" },
  { key: "tetradic", label: "Tetradic" },
  { key: "monochromatic", label: "Monochromatic" },
];

function hexToRgb(h: string): [number, number, number] {
  const v = h.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function relativeLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(l1: number, l2: number): number {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const baseHsl = computed(() => {
  const [r, g, b] = hexToRgb(hex.value);
  return rgbToHsl(r, g, b);
});

interface PaletteColor {
  hex: string;
  label: string;
  rgb: string;
  hslLabel: string;
}
function makeColor(
  h: number,
  s: number,
  l: number,
  label: string,
): PaletteColor {
  const hx = hslToHex(h, s, l);
  const [r, g, b] = hexToRgb(hx);
  return {
    hex: hx,
    label,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hslLabel: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`,
  };
}

const palette = computed(() => {
  const [h, s, l] = baseHsl.value;
  switch (harmony.value) {
    case "complementary":
      return [
        makeColor(h, s, l, "Base"),
        makeColor(h + 180, s, l, "Complement"),
      ];
    case "analogous":
      return [
        makeColor(h - 30, s, l, "-30°"),
        makeColor(h, s, l, "Base"),
        makeColor(h + 30, s, l, "+30°"),
      ];
    case "triadic":
      return [
        makeColor(h, s, l, "Base"),
        makeColor(h + 120, s, l, "+120°"),
        makeColor(h + 240, s, l, "+240°"),
      ];
    case "split":
      return [
        makeColor(h, s, l, "Base"),
        makeColor(h + 150, s, l, "+150°"),
        makeColor(h + 210, s, l, "+210°"),
      ];
    case "tetradic":
      return [
        makeColor(h, s, l, "Base"),
        makeColor(h + 90, s, l, "+90°"),
        makeColor(h + 180, s, l, "+180°"),
        makeColor(h + 270, s, l, "+270°"),
      ];
    case "monochromatic":
      return [20, 35, 50, 65, 80].map((lv) => makeColor(h, s, lv, `${lv}%`));
    default:
      return [makeColor(h, s, l, "Base")];
  }
});

const tintsAndShades = computed(() => {
  const [h, s] = baseHsl.value;
  return Array.from({ length: 11 }, (_, i) => hslToHex(h, s, i * 10));
});

const contrastWhite = computed(() =>
  contrastRatio(relativeLuminance(...hexToRgb(hex.value)), 1),
);
const contrastBlack = computed(() =>
  contrastRatio(relativeLuminance(...hexToRgb(hex.value)), 0),
);

const suggestedTextColor = computed(() => {
  const l = relativeLuminance(...hexToRgb(hex.value));
  return contrastRatio(l, 0) > contrastRatio(l, 1) ? "white" : "black";
});

const exportFormat = ref<"css" | "tailwind" | "json">("css");

const exportContent = computed(() => {
  const colors = palette.value.map((c) => c.hex);
  if (exportFormat.value === "tailwind") {
    return `colors: {\n  ${colors.map((c, i) => `'${i + 1}': '${c}'`).join(",\n  ")},\n}`;
  }
  if (exportFormat.value === "json") {
    return JSON.stringify({ palette: colors }, null, 2);
  }
  return palette.value.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n");
});

function randomColor() {
  hex.value =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
}

async function pickFromScreen() {
  try {
    const EyeDropper = (
      window as Window & {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
      }
    ).EyeDropper;
    const dropper = new EyeDropper!();
    const result = await dropper.open();
    hex.value = result.sRGBHex;
  } catch {
    /* user cancelled */
  }
}

async function copyColor(c: string) {
  await copy(c);
  copiedColor.value = c;
}
</script>
