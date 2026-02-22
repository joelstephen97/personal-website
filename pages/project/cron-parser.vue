<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Cron Parser</h1>
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Expression</label>
          <button class="text-xs text-accent font-medium flex items-center gap-1 hover:opacity-80" @click="copyExpr">
            <Icon :name="copied ? 'Check' : 'Copy'" :size="12" /> {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>
        <input
          v-model="expression"
          type="text"
          class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-lg text-center tracking-widest"
          placeholder="* * * * *"
          spellcheck="false"
        />
        <div class="flex justify-between mt-2 px-2">
          <span v-for="label in fieldLabels" :key="label" class="text-[10px] text-[rgb(var(--foreground-muted))] text-center flex-1">{{ label }}</span>
        </div>

        <p v-if="error" class="text-accent text-sm mt-4">{{ error }}</p>
        <p v-else-if="description" class="text-[rgb(var(--foreground-secondary))] mt-4 text-center text-lg">
          {{ description }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-1">Timezone</label>
          <select v-model="timezone" class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-sm">
            <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
          </select>
        </div>
      </div>

      <div v-if="parsed && fieldBreakdown.length" class="glass-solid rounded-2xl p-4 mb-6">
        <h3 class="text-xs font-semibold text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-2">Field Breakdown</h3>
        <div class="space-y-1 text-sm">
          <div v-for="(f, i) in fieldBreakdown" :key="i" class="flex gap-3">
            <span class="font-mono text-accent w-24">{{ f.field }}</span>
            <span class="text-[rgb(var(--foreground-secondary))]">{{ f.explanation }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="p in presets"
          :key="p.expr"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          :class="expression === p.expr
            ? 'bg-accent text-white'
            : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-secondary))] hover:border-accent/50'"
          @click="expression = p.expr"
        >
          {{ p.label }}
        </button>
      </div>

      <div v-if="nextRuns.length" class="glass-solid rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-[rgb(var(--foreground))]">Next 10 Executions</h3>
          <span class="text-xs text-[rgb(var(--foreground-muted))]">{{ timezone }}</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="(run, i) in nextRuns"
            :key="i"
            class="flex items-center gap-3 text-sm"
          >
            <span class="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">{{ i + 1 }}</span>
            <span class="text-[rgb(var(--foreground))] font-mono flex-1">{{ run.formatted }}</span>
            <span class="text-xs text-[rgb(var(--foreground-muted))]">{{ run.relative }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Cron Parser | Joel Stephen - Portfolio",
  description: "Parse cron expressions into human-readable schedules with next runs.",
  path: "/project/cron-parser",
  breadcrumbTitle: "Cron Parser",
  projectSchema: {
    name: "Cron Parser",
    description: "Parse cron expressions into human-readable schedules with next runs.",
  },
});

import { ref, computed } from "vue";
import { useClipboard } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "default" });

const expression = ref("0 9 * * 1-5");
const fieldLabels = ["Minute", "Hour", "Day", "Month", "Weekday"];
const { copy, copied } = useClipboard({ source: expression, copiedDuring: 2000 });

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  Intl.DateTimeFormat().resolvedOptions().timeZone,
].filter((v, i, a) => a.indexOf(v) === i);

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

const presets = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Daily at 9am", expr: "0 9 * * *" },
  { label: "Weekdays 9am", expr: "0 9 * * 1-5" },
  { label: "Weekly Monday", expr: "0 0 * * 1" },
  { label: "Monthly 1st", expr: "0 0 1 * *" },
  { label: "Monthly 15th", expr: "0 0 15 * *" },
  { label: "Every 15 min", expr: "*/15 * * * *" },
  { label: "Twice daily", expr: "0 9,17 * * *" },
  { label: "First Mon", expr: "0 0 1-7 * 1" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseField(field: string, min: number, max: number): number[] | null {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    let range: string;
    let step = 1;
    if (stepMatch) { range = stepMatch[1]; step = parseInt(stepMatch[2]); }
    else range = part;

    if (range === "*") {
      for (let i = min; i <= max; i += step) values.add(i);
    } else if (range.includes("-")) {
      const [a, b] = range.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < min || b > max) return null;
      for (let i = a; i <= b; i += step) values.add(i);
    } else {
      const n = parseInt(range);
      if (isNaN(n) || n < min || n > max) return null;
      values.add(n);
    }
  }
  return [...values].sort((a, b) => a - b);
}

const parsed = computed(() => {
  const parts = expression.value.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const minutes = parseField(parts[0], 0, 59);
  const hours = parseField(parts[1], 0, 23);
  const days = parseField(parts[2], 1, 31);
  const months = parseField(parts[3], 1, 12);
  const weekdays = parseField(parts[4], 0, 7);
  if (!minutes || !hours || !days || !months || !weekdays) return null;
  const normWeekdays = weekdays.map((d) => d === 7 ? 0 : d);
  return { minutes, hours, days, months, weekdays: [...new Set(normWeekdays)].sort((a, b) => a - b) };
});

const error = computed(() => {
  if (!expression.value.trim()) return "";
  if (!parsed.value) return "Invalid cron expression";
  return "";
});

const fieldBreakdown = computed(() => {
  if (!parsed.value) return [];
  const parts = expression.value.trim().split(/\s+/);
  const { minutes, hours, days, months, weekdays } = parsed.value;
  const labels = ["Minute", "Hour", "Day", "Month", "Weekday"];
  const data = [minutes, hours, days, months, weekdays];
  return parts.map((p, i) => {
    let exp = "";
    if (p === "*") exp = "every " + labels[i].toLowerCase();
    else if (p.includes("/")) exp = `every ${p.split("/")[1]} ${labels[i].toLowerCase()}s`;
    else if (p.includes("-")) exp = `${labels[i]}s ${p}`;
    else if (p.includes(",")) exp = `${labels[i]}s ${p}`;
    else exp = `at ${labels[i].toLowerCase()} ${p}`;
    return { field: parts[i], explanation: exp };
  });
});

function pad(n: number): string { return n.toString().padStart(2, "0"); }

const description = computed(() => {
  if (!parsed.value) return "";
  const { minutes, hours, days, months, weekdays } = parsed.value;
  const parts: string[] = [];

  const isAllMinutes = minutes.length === 60;
  const isAllHours = hours.length === 24;
  const isAllDays = days.length === 31;
  const isAllMonths = months.length === 12;
  const isAllWeekdays = weekdays.length === 7;

  if (isAllMinutes && isAllHours) {
    parts.push("Every minute");
  } else if (isAllMinutes) {
    parts.push(`Every minute past ${hours.map(h => pad(h) + ":00").join(", ")}`);
  } else if (minutes.length === 1 && hours.length === 1) {
    parts.push(`At ${pad(hours[0])}:${pad(minutes[0])}`);
  } else if (minutes.length === 1 && isAllHours) {
    parts.push(`At minute ${minutes[0]} of every hour`);
  } else {
    const step = minutes.length > 1 ? minutes[1] - minutes[0] : 0;
    const isStep = step > 0 && minutes.every((v, i) => v === i * step);
    if (isStep && isAllHours) {
      parts.push(`Every ${step} minutes`);
    } else if (isStep) {
      parts.push(`Every ${step} minutes past ${hours.map(h => pad(h) + ":00").join(", ")}`);
    } else {
      parts.push(`At minute ${minutes.join(", ")} past ${hours.map(h => pad(h) + ":00").join(", ")}`);
    }
  }

  if (!isAllDays) parts.push(`on day ${days.join(", ")} of the month`);
  if (!isAllMonths) {
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    parts.push(`in ${months.map(m => monthNames[m]).join(", ")}`);
  }
  if (!isAllWeekdays) {
    if (weekdays.length === 5 && !weekdays.includes(0) && !weekdays.includes(6)) {
      parts.push("on weekdays");
    } else if (weekdays.length === 2 && weekdays.includes(0) && weekdays.includes(6)) {
      parts.push("on weekends");
    } else {
      parts.push(`on ${weekdays.map(d => DAYS[d]).join(", ")}`);
    }
  }

  return parts.join(", ");
});

function relativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `in ${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `in ${diffHr}h ${diffMin % 60}m`;
  const diffDays = Math.floor(diffHr / 24);
  return `in ${diffDays}d ${diffHr % 24}h`;
}

const nextRuns = computed(() => {
  if (!parsed.value) return [];
  const { minutes, hours, days, months, weekdays } = parsed.value;
  const results: { formatted: string; relative: string }[] = [];
  const now = new Date();
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  let safety = 0;
  while (results.length < 10 && safety < 525960) {
    safety++;
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const w = cursor.getDay();
    const h = cursor.getHours();
    const min = cursor.getMinutes();

    if (!months.includes(m)) { cursor.setMonth(cursor.getMonth() + 1, 1); cursor.setHours(0, 0, 0, 0); continue; }
    if (!days.includes(d) || !weekdays.includes(w)) { cursor.setDate(cursor.getDate() + 1); cursor.setHours(0, 0, 0, 0); continue; }
    if (!hours.includes(h)) { cursor.setHours(cursor.getHours() + 1, 0, 0, 0); continue; }
    if (!minutes.includes(min)) { cursor.setMinutes(cursor.getMinutes() + 1); continue; }

    const snapshot = new Date(cursor);
    results.push({
      formatted: snapshot.toLocaleString("en-US", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
        timeZone: timezone.value,
      }),
      relative: relativeTime(snapshot),
    });
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return results;
});

async function copyExpr() {
  await copy();
}
</script>
