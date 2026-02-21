<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <NuxtLink to="/project" class="w-8 h-8 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] flex items-center justify-center hover:border-accent/50 transition-colors">
            <Icon name="ArrowLeft" :size="16" class="text-[rgb(var(--foreground-secondary))]" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Regex Tester</h1>
        </div>
        <DarkModeToggle />
      </div>

      <div class="glass-solid rounded-2xl p-6 mb-6">
        <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2">Pattern</label>
        <div class="flex gap-2 items-center mb-4">
          <span class="text-accent font-mono text-lg">/</span>
          <input
            v-model="pattern"
            type="text"
            class="flex-1 px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono"
            placeholder="Enter regex..."
            spellcheck="false"
          />
          <span class="text-accent font-mono text-lg">/</span>
          <div class="flex gap-1">
            <button
              v-for="f in flagOptions"
              :key="f"
              class="w-8 h-8 rounded-lg text-sm font-mono font-bold transition-colors"
              :class="flags.includes(f) ? 'bg-accent text-white' : 'bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground-muted))]'"
              @click="toggleFlag(f)"
            >
              {{ f }}
            </button>
          </div>
        </div>
        <p v-if="regexError" class="text-accent text-sm mb-4">{{ regexError }}</p>

        <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2">Test String</label>
        <div
          class="min-h-[120px] px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
        >
          <span v-for="(seg, i) in segments" :key="i" :class="seg.match ? matchColors[seg.groupIdx % matchColors.length] : ''">{{ seg.text }}</span>
          <span v-if="!segments.length" class="text-[rgb(var(--foreground-muted))]">Enter test string below...</span>
        </div>
        <textarea
          v-model="testStr"
          rows="4"
          class="w-full mt-4 px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm resize-none"
          placeholder="Type or paste your test string..."
          spellcheck="false"
        />
      </div>

      <!-- Replace section -->
      <div class="glass-solid rounded-2xl p-6 mb-6">
        <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide block mb-2">Replace With</label>
        <input
          v-model="replacePattern"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm mb-3"
          placeholder="Replacement pattern (e.g. $1@newdomain.com)"
          spellcheck="false"
        />
        <div v-if="replaceResult !== null" class="px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] font-mono text-sm whitespace-pre-wrap break-all text-[rgb(var(--foreground-secondary))]">
          {{ replaceResult }}
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-6 mb-6">
        <div class="glass-solid rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-3">Match Info</h3>
          <div class="space-y-2 text-sm text-[rgb(var(--foreground-secondary))]">
            <p>Matches: <strong class="text-accent">{{ matches.length }}</strong></p>
            <p v-if="execTime !== null">Time: <strong class="text-accent">{{ execTime.toFixed(3) }}ms</strong></p>
            <p v-if="matches.length">
              Full match: <code class="px-1.5 py-0.5 rounded bg-[rgb(var(--glass))] text-[rgb(var(--foreground))] font-mono text-xs">{{ matches[0]?.[0] }}</code>
            </p>
          </div>
        </div>
        <div class="glass-solid rounded-2xl p-6">
          <h3 class="text-sm font-semibold text-[rgb(var(--foreground))] mb-3">Capture Groups</h3>
          <div v-if="groups.length" class="space-y-1.5">
            <div v-for="(g, i) in groups" :key="i" class="flex items-center gap-2 text-sm">
              <span class="text-[rgb(var(--foreground-muted))] font-mono text-xs w-6">{{ g.name || i + 1 }}</span>
              <code class="px-1.5 py-0.5 rounded bg-[rgb(var(--glass))] text-[rgb(var(--foreground))] font-mono text-xs">{{ g.value ?? "undefined" }}</code>
            </div>
          </div>
          <p v-else class="text-sm text-[rgb(var(--foreground-muted))]">No groups</p>
        </div>
      </div>

      <!-- Cheatsheet -->
      <details class="glass-solid rounded-2xl p-6">
        <summary class="text-sm font-semibold text-[rgb(var(--foreground))] cursor-pointer select-none flex items-center gap-2">
          <Icon name="BookOpen" :size="16" /> Quick Reference
        </summary>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <div v-for="item in cheatsheet" :key="item.token" class="flex gap-2">
            <code class="text-accent font-mono font-bold whitespace-nowrap">{{ item.token }}</code>
            <span class="text-[rgb(var(--foreground-secondary))]">{{ item.desc }}</span>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: false });

const pattern = ref("(\\w+)@(\\w+\\.\\w+)");
const testStr = ref("Contact us at hello@example.com or support@test.org");
const flags = ref("g");
const replacePattern = ref("");
const flagOptions = ["g", "i", "m", "s", "u"];

const matchColors = [
  "bg-accent/20 text-accent-hover dark:text-accent rounded px-0.5",
  "bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded px-0.5",
  "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded px-0.5",
  "bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded px-0.5",
  "bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded px-0.5",
];

const cheatsheet = [
  { token: ".", desc: "Any character" },
  { token: "\\d", desc: "Digit [0-9]" },
  { token: "\\w", desc: "Word char" },
  { token: "\\s", desc: "Whitespace" },
  { token: "\\b", desc: "Word boundary" },
  { token: "^", desc: "Start of line" },
  { token: "$", desc: "End of line" },
  { token: "*", desc: "0 or more" },
  { token: "+", desc: "1 or more" },
  { token: "?", desc: "0 or 1" },
  { token: "{n,m}", desc: "n to m times" },
  { token: "[abc]", desc: "Character class" },
  { token: "[^abc]", desc: "Negated class" },
  { token: "(x)", desc: "Capture group" },
  { token: "(?:x)", desc: "Non-capture" },
  { token: "(?<n>x)", desc: "Named group" },
  { token: "x|y", desc: "Alternation" },
  { token: "(?=x)", desc: "Lookahead" },
  { token: "(?!x)", desc: "Neg lookahead" },
  { token: "(?<=x)", desc: "Lookbehind" },
  { token: "(?<!x)", desc: "Neg lookbehind" },
];

function toggleFlag(f: string) {
  flags.value = flags.value.includes(f) ? flags.value.replace(f, "") : flags.value + f;
}

const regex = computed(() => {
  if (!pattern.value) return null;
  try {
    return new RegExp(pattern.value, flags.value);
  } catch {
    return null;
  }
});

const regexError = computed(() => {
  if (!pattern.value) return "";
  try {
    new RegExp(pattern.value, flags.value);
    return "";
  } catch (e: any) {
    return e.message;
  }
});

const execTime = ref<number | null>(null);

const matches = computed(() => {
  if (!regex.value || !testStr.value) { execTime.value = null; return []; }
  const r = new RegExp(regex.value.source, regex.value.flags);
  const result: RegExpExecArray[] = [];
  const t0 = performance.now();
  let m: RegExpExecArray | null;
  if (r.global) {
    while ((m = r.exec(testStr.value)) !== null) {
      result.push(m);
      if (!m[0].length) r.lastIndex++;
      if (result.length > 1000) break;
    }
  } else {
    m = r.exec(testStr.value);
    if (m) result.push(m);
  }
  execTime.value = performance.now() - t0;
  return result;
});

interface GroupInfo { name: string; value: string | undefined; }
const groups = computed((): GroupInfo[] => {
  if (!matches.value.length) return [];
  const m = matches.value[0];
  const result: GroupInfo[] = [];
  const namedGroups = m.groups || {};
  const namedNames = new Set(Object.keys(namedGroups));

  for (let i = 1; i < m.length; i++) {
    let name = "";
    for (const [k, v] of Object.entries(namedGroups)) {
      if (v === m[i] && namedNames.has(k)) { name = k; namedNames.delete(k); break; }
    }
    result.push({ name, value: m[i] });
  }
  return result;
});

interface Segment { text: string; match: boolean; groupIdx: number; }
const segments = computed((): Segment[] => {
  if (!testStr.value) return [];
  if (!matches.value.length) return [{ text: testStr.value, match: false, groupIdx: 0 }];

  const result: Segment[] = [];
  let lastIdx = 0;
  for (let i = 0; i < matches.value.length; i++) {
    const m = matches.value[i];
    if (m.index > lastIdx) result.push({ text: testStr.value.slice(lastIdx, m.index), match: false, groupIdx: 0 });
    result.push({ text: m[0], match: true, groupIdx: i });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < testStr.value.length) result.push({ text: testStr.value.slice(lastIdx), match: false, groupIdx: 0 });
  return result;
});

const replaceResult = computed(() => {
  if (!regex.value || !testStr.value || !replacePattern.value) return null;
  try {
    return testStr.value.replace(regex.value, replacePattern.value);
  } catch {
    return null;
  }
});
</script>
