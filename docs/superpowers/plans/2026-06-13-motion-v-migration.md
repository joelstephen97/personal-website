# Motion-V Full Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's CSS / View-Transitions / `v-reveal` motion system with one consistent, Apple-tier motion system powered by `motion-v` — covering page transitions, scroll-reveal, micro-interactions, the hero entrance, and the ambient background.

**Architecture:** Add `motion-v` + its Nuxt module. Centralize all easing/duration/spring tokens in `constants/motion.ts`. Drive page transitions with `<AnimatePresence>`, scroll-reveal by rewriting the existing `v-reveal` directive's internals onto motion-v's imperative `inView`+`animate` (call-sites unchanged), and micro-interactions/hero/ambient with `<Motion>`, motion values, and springs. Global `<MotionConfig reduced-motion="user">` replaces the manual reduced-motion CSS. Dead CSS is deleted only after each replacement is verified.

**Tech Stack:** Nuxt 3 (SSR off, static SPA), Vue 3, TypeScript, Tailwind 3, pnpm, `motion-v`.

---

## Verification approach (read first)

This repo has **no unit-test harness** (no vitest/jest), and animation behavior is verified visually/behaviourally, not by asserting return values. Per the approved spec, every task is verified by:

1. **`pnpm lint`** — ESLint + Prettier must pass.
2. **`pnpm dev`** running, then **Playwright MCP** to drive the page and confirm the animation actually fires (navigate, scroll, hover, emulate reduced-motion).
3. Browser console must be free of motion-v errors/warnings.

Do **not** add a test framework. Keep tight verify-then-commit loops.

**Commands:**
- Dev server: `pnpm dev` (already configured with a 12 GB Node heap for the ML deps). Leave it running in the background across tasks.
- Lint: `pnpm lint` (check) / `pnpm lintfix` (fix).
- The live dev URL is printed by `pnpm dev` (default `http://localhost:3000`).

---

## File map

| File | Responsibility | Action |
|------|----------------|--------|
| `package.json` | add `motion-v` dep | Modify |
| `nuxt.config.ts` | register `motion-v/nuxt`; disable Nuxt View Transitions | Modify |
| `constants/motion.ts` | single source of truth for eases/durations/springs/variants | Create |
| `app.vue` | global `<MotionConfig reduced-motion="user">` | Modify |
| `layouts/default.vue` | `<AnimatePresence>` page transition; motion-v ambient orbs | Modify |
| `layouts/project-detail.vue` | drop `view-transition-name`; rely on default transition | Modify |
| `plugins/reveal.ts` | rewrite `v-reveal` internals onto motion-v `inView`+`animate` | Modify |
| `composables/useCardTilt.ts` | spring tilt via motion values | Modify |
| `composables/useMagneticButton.ts` | spring magnetic via motion values | Modify |
| `components/WorkCard.vue` | `<Motion as="article">` + tilt motion values | Modify |
| `components/ui/Button.vue` | `<Motion>` elements + magnetic motion values + `while-press` | Modify |
| `components/SortableProjectCard.vue` | `<Motion as="article">` hover lift | Modify |
| `pages/index.vue` | hero stagger container + per-char heading + scroll parallax | Modify |
| `components/HeroGradientMesh.vue` | rotating gradient via motion value loop | Modify |
| `components/CursorGlow.vue` | spring-trailed pointer glow | Modify |
| `assets/css/main.css` | delete dead keyframes/classes after replacement | Modify |
| `tailwind.config.js` | delete dead `animate-*` / keyframe entries | Modify |

---

## Task 1: Install motion-v and register the Nuxt module

**Files:**
- Modify: `package.json` (dependencies)
- Modify: `nuxt.config.ts:10` (`modules` array) and `nuxt.config.ts:119` (`experimental.viewTransition`)

- [ ] **Step 1: Install motion-v**

Run:
```bash
pnpm add motion-v
```
Expected: `motion-v` added to `dependencies` in `package.json`; `pnpm-lock.yaml` updated.

- [ ] **Step 2: Register the Nuxt module**

In `nuxt.config.ts`, find the `modules: [` array (line ~10) and add `'motion-v/nuxt'` as the first entry. Example shape:
```ts
modules: [
  'motion-v/nuxt',
  // ...existing modules unchanged...
],
```

- [ ] **Step 3: Disable Nuxt's built-in View Transitions (prevents compounding with AnimatePresence)**

In `nuxt.config.ts`, in the `experimental` block, change:
```ts
viewTransition: true,
```
to:
```ts
viewTransition: false,
```

- [ ] **Step 4: Add explicit motion-v module config (auto-imports)**

In `nuxt.config.ts`, add a top-level `motionV` block (sibling of `modules`):
```ts
motionV: {
  components: true,
  utilities: true,
  directives: false,
},
```
(`directives: false` — we keep our own `v-reveal`; we are not using motion-v's `v-motion` directive.)

- [ ] **Step 5: Boot the dev server and confirm a clean start**

Run: `pnpm dev`
Expected: server starts, no module-resolution errors, homepage renders. Confirm in the browser (Playwright MCP `browser_navigate` to the dev URL, `browser_console_messages` shows no motion-v errors).

- [ ] **Step 6: Smoke-test that `<Motion>` is auto-imported**

Temporarily add to `app.vue` template, inside the root `<div>`:
```vue
<Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.4 }" style="position:fixed;bottom:4px;left:4px;font-size:10px;opacity:0" >mv-ok</Motion>
```
Reload, confirm "mv-ok" fades in with no console error, then **remove this smoke element**.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml nuxt.config.ts
git commit -m "feat(motion): install motion-v + Nuxt module, disable Nuxt view transitions"
```

---

## Task 2: Create the motion token module

**Files:**
- Create: `constants/motion.ts`

- [ ] **Step 1: Write the token module**

Create `constants/motion.ts`:
```ts
// Single source of truth for the site's motion "signature".
// Apple-tier: precise, minimal, premium. Import from here everywhere —
// never hand-write eases/durations/springs in components.

import type { Transition, Variants } from "motion-v";

// Entrances (reveal, hero): expressive-but-controlled ease-out.
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
// Transitions (page change, color/transform settle): standard material ease.
export const EASE_TRANSITION = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.35,
  slow: 0.7,
} as const;

export const SPRING = {
  // Gentle settle for tilt / large surfaces.
  soft: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 },
  // Crisp press/hover feedback.
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  // Magnetic pull — light and quick to return.
  magnetic: { type: "spring", stiffness: 250, damping: 18, mass: 0.5 },
} as const satisfies Record<string, Transition>;

// Page-level transition used by AnimatePresence in the default layout.
export const pageVariants = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_TRANSITION },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    y: 12,
    transition: { duration: DURATION.base, ease: EASE_TRANSITION },
  },
} satisfies Variants;

// Reusable fade-up for stagger children (hero).
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_ENTRANCE },
  },
} satisfies Variants;

// Stagger container for orchestrated entrances (hero).
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} satisfies Variants;
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm lint`
Expected: PASS (no unused-import or type errors). If `Transition`/`Variants` are not exported from `motion-v` under those names, fall back to typing the consts inline (remove the `import type` line and the `satisfies` clauses) — the runtime values are what matter.

- [ ] **Step 3: Commit**

```bash
git add constants/motion.ts
git commit -m "feat(motion): add central motion token module (eases, durations, springs, variants)"
```

---

## Task 3: Global reduced-motion via MotionConfig

**Files:**
- Modify: `app.vue`

- [ ] **Step 1: Wrap the layout in MotionConfig**

In `app.vue`, wrap `<NuxtLayout>...</NuxtLayout>` with `<MotionConfig reduced-motion="user">`:
```vue
<template>
  <div>
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <MotionConfig reduced-motion="user">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </MotionConfig>
    <SpeedInsights />
  </div>
</template>
```
(`MotionConfig` is auto-imported by the Nuxt module — no script import needed.)

- [ ] **Step 2: Verify**

Run: `pnpm dev` (if not already running) and reload. Confirm the page still renders and console is clean.
Then in Playwright MCP, emulate reduced motion and confirm later animation tasks respect it — for now just confirm no regression.

- [ ] **Step 3: Commit**

```bash
git add app.vue
git commit -m "feat(motion): global MotionConfig reduced-motion=user"
```

---

## Task 4: Page transitions via AnimatePresence

**Files:**
- Modify: `layouts/default.vue` (template `<Transition name="page">` block + script)
- Modify: `assets/css/main.css` (remove `.page-enter-*` / `.page-leave-*` and `::view-transition-*(page-content)` rules + their keyframes)

- [ ] **Step 1: Replace the Vue Transition with AnimatePresence**

In `layouts/default.vue`, replace this block:
```vue
<div class="page-content">
  <Transition name="page" mode="out-in">
    <div
      v-if="projectSlug"
      :key="`project-${projectSlug}`"
      class="project-detail-content"
    >
      <slot />
    </div>
    <div v-else key="default">
      <slot />
    </div>
  </Transition>
</div>
```
with:
```vue
<div class="page-content">
  <AnimatePresence mode="wait">
    <Motion
      :key="route.path"
      as="div"
      :variants="pageVariants"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <slot />
    </Motion>
  </AnimatePresence>
</div>
```

- [ ] **Step 2: Import the variant in the layout script**

In `layouts/default.vue` `<script setup>`, add:
```ts
import { pageVariants } from "~/constants/motion";
```
The `route` ref already exists (`const route = useRoute()`). The `projectSlug` computed is still used by the orb-gradient logic — leave it in place; only the template `<Transition>` consumer is removed.

- [ ] **Step 3: Delete dead page-transition CSS**

In `assets/css/main.css`, delete:
- the `.page-enter-active, .page-leave-active { ... }` rule
- the `.page-enter-from, .page-leave-to { ... }` rule
- the `.page-content { view-transition-name: page-content; }` rule
- `::view-transition-old(root)`, `::view-transition-new(root)`
- `::view-transition-old(page-content)`, `::view-transition-new(page-content)`
- `@keyframes view-transition-fade-blur-out` and `@keyframes view-transition-fade-blur-in`

Keep the `.page-content` element in the template (now just a plain wrapper) but it no longer needs CSS.

- [ ] **Step 4: Verify the transition fires**

With `pnpm dev` running, use Playwright MCP: navigate `/` → click a nav link to `/about` → confirm the outgoing page blurs/fades out and the incoming page blurs/fades in (`browser_snapshot` before/after, watch for the keyed remount). Repeat `/about` → `/experience`. Console clean.

- [ ] **Step 5: Verify reduced motion**

In Playwright MCP, emulate `prefers-reduced-motion: reduce` (via `browser_run_code_unsafe` calling `matchMedia` emulation or the CDP emulation), navigate again, and confirm the transition is suppressed (instant swap). MotionConfig should handle this automatically.

- [ ] **Step 6: Commit**

```bash
git add layouts/default.vue assets/css/main.css
git commit -m "feat(motion): page transitions via AnimatePresence, remove View Transition CSS"
```

---

## Task 5: Rewrite the v-reveal directive onto motion-v

**Files:**
- Modify: `plugins/reveal.ts` (replace `mounted`/`unmounted` internals)
- Modify: `assets/css/main.css` (remove `.reveal`, `.revealed`, `.reveal--scale*` rules)

**Contract to preserve exactly:** `v-reveal`, `v-reveal="{ delay: 300 }"`, `v-reveal="300"`, and `v-reveal="{ delay, scale: true }"` must all keep working. Default delay `0`. `scale` adds a subtle scale-in.

- [ ] **Step 1: Rewrite the directive body**

Replace the entire contents of `plugins/reveal.ts` with:
```ts
// v-reveal — fade/slide (and optional scale) an element in the first time it
// enters the viewport, using motion-v's imperative inView + animate.
// Call-sites are unchanged: v-reveal | v-reveal="{ delay }" | v-reveal="300".
import { animate, inView } from "motion-v";
import { EASE_ENTRANCE, DURATION } from "~/constants/motion";

type RevealValue = number | { delay?: number; scale?: boolean } | undefined;

interface RevealEl extends HTMLElement {
  _revealStop?: () => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    getSSRProps() {
      return {};
    },
    mounted(el: RevealEl, binding) {
      if (typeof window === "undefined") return;

      const value = binding.value as RevealValue;
      const delay = typeof value === "number" ? value : (value?.delay ?? 0);
      const scale = typeof value === "object" ? !!value?.scale : false;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Set the hidden start state inline so there is no flash before reveal.
      el.style.opacity = "0";
      el.style.transform = scale
        ? "translateY(24px) scale(0.97)"
        : "translateY(24px)";
      el.style.willChange = "opacity, transform";

      if (reduce) {
        // No motion: snap to the resting state immediately.
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
        return;
      }

      const stop = inView(
        el,
        () => {
          animate(
            el,
            scale
              ? {
                  opacity: [0, 1],
                  transform: [
                    "translateY(24px) scale(0.97)",
                    "translateY(0px) scale(1)",
                  ],
                }
              : {
                  opacity: [0, 1],
                  transform: ["translateY(24px)", "translateY(0px)"],
                },
            {
              duration: DURATION.slow,
              delay: delay / 1000,
              ease: EASE_ENTRANCE,
            },
          ).then(() => {
            el.style.willChange = "auto";
          });
          // Trigger once: stop observing after the first entry.
          el._revealStop?.();
        },
        { amount: 0.1, margin: "0px 0px -40px 0px" },
      );

      el._revealStop = stop;
    },
    unmounted(el: RevealEl) {
      el._revealStop?.();
      el._revealStop = undefined;
    },
  });
});
```

- [ ] **Step 2: If `inView`/`animate` are not exported from `motion-v`**

If Step 4 verification shows an import error for `animate`/`inView` from `motion-v`, install the core package and import from it instead:
```bash
pnpm add motion
```
then change the import line to:
```ts
import { animate, inView } from "motion";
```
Everything else stays identical. (motion-v is built on `motion`; one of the two will resolve.)

- [ ] **Step 3: Delete dead reveal CSS**

In `assets/css/main.css`, delete the `/* ── Scroll Reveal System ── */` block: `.reveal`, `.reveal.revealed`, `.reveal.reveal--scale`, `.reveal.reveal--scale.revealed`.

- [ ] **Step 4: Verify reveals fire on scroll**

With `pnpm dev` running, Playwright MCP: navigate `/about` (heavily uses `v-reveal`), scroll down through sections, confirm each section fades/slides in once as it enters and does **not** re-animate on scroll-up. Check `/experience` (uses staggered `delay: i * 120`) — items should cascade. Console clean.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload `/about`, confirm sections are immediately visible with no animation.

- [ ] **Step 6: Commit**

```bash
git add plugins/reveal.ts assets/css/main.css package.json pnpm-lock.yaml
git commit -m "feat(motion): rewrite v-reveal directive onto motion-v inView+animate"
```

---

## Task 6: Spring tilt — useCardTilt

**Files:**
- Modify: `composables/useCardTilt.ts`
- Modify: `components/WorkCard.vue` (consumer — convert root to `<Motion>`, update handlers)

- [ ] **Step 1: Rewrite the composable on motion values**

Replace `composables/useCardTilt.ts` with:
```ts
import { ref } from "vue";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

export function useCardTilt(options?: { maxTilt?: number }) {
  const maxTilt = options?.maxTilt ?? 5;
  const cardRef = ref<HTMLElement | null>(null);

  // Raw target rotations, spring-smoothed for a premium settle.
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, SPRING.soft);
  const rotateY = useSpring(rotateYRaw, SPRING.soft);

  function onMouseMove(e: MouseEvent) {
    const el = cardRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;
    rotateYRaw.set((xPercent - 0.5) * maxTilt * 2);
    rotateXRaw.set((0.5 - yPercent) * maxTilt * 2);
  }

  function onMouseLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  }

  // Bind on a <Motion> element: :style="tiltStyle"
  const tiltStyle = {
    rotateX,
    rotateY,
    transformPerspective: 800,
  };

  return { cardRef, tiltStyle, onMouseMove, onMouseLeave };
}
```

- [ ] **Step 2: Update WorkCard to a Motion element**

In `components/WorkCard.vue`, change the root `<article>` to `<Motion as="article">`, wire `cardRef` through the component's DOM node, swap `@mouseenter` for `@mousemove`, and keep `@mouseleave`:
```vue
<template>
  <Motion
    as="article"
    :ref="(el: any) => { cardRef = el?.$el ?? el; }"
    :style="tiltStyle"
    class="group glass-solid rounded-xl hover:border-accent/30 transition-colors relative p-4 sm:p-5"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!-- inner content unchanged -->
  </Motion>
</template>
```
In the `<script setup>`, update the destructure:
```ts
const { cardRef, tiltStyle, onMouseMove, onMouseLeave } = useCardTilt();
```

- [ ] **Step 3: Verify tilt**

With `pnpm dev` running, Playwright MCP: navigate `/work`, hover and move the pointer across a `WorkCard`, confirm it tilts toward the cursor with a smooth spring and settles flat on leave. Console clean.

- [ ] **Step 4: Verify reduced motion**

Emulate reduced motion; `useSpring` respects MotionConfig — confirm the tilt is damped/disabled and the card stays flat (no error). If tilt still applies under reduced motion (imperative motion values can bypass MotionConfig), guard `onMouseMove` with an early return when `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. Add that guard if needed.

- [ ] **Step 5: Commit**

```bash
git add composables/useCardTilt.ts components/WorkCard.vue
git commit -m "feat(motion): spring-based card tilt via motion values"
```

---

## Task 7: Spring magnetic — useMagneticButton + Button.vue

**Files:**
- Modify: `composables/useMagneticButton.ts`
- Modify: `components/ui/Button.vue` (convert rendered elements to `<Motion>`, bind motion-value style, add `while-press`)

- [ ] **Step 1: Rewrite the composable on motion values**

Replace `composables/useMagneticButton.ts` with:
```ts
import { ref } from "vue";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

export function useMagneticButton(options?: { strength?: number }) {
  const strength = options?.strength ?? 0.3;
  const buttonRef = ref<HTMLElement | null>(null);

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, SPRING.magnetic);
  const y = useSpring(yRaw, SPRING.magnetic);

  function onMouseMove(e: MouseEvent) {
    const el = buttonRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    xRaw.set((e.clientX - centerX) * strength);
    yRaw.set((e.clientY - centerY) * strength);
  }

  function onMouseLeave() {
    xRaw.set(0);
    yRaw.set(0);
  }

  // Bind on a <Motion> element: :style="magneticStyle"
  const magneticStyle = { x, y };

  return { buttonRef, magneticStyle, onMouseMove, onMouseLeave };
}
```

- [ ] **Step 2: Convert Button.vue rendered elements to Motion**

In `components/ui/Button.vue`, change each rendered root (`NuxtLink`, `a`, `button`) to a `<Motion>` element via the `as` prop, bind the magnetic motion-value style, add a subtle press feedback, and swap `@mouseenter` → `@mousemove`. Update the script destructure to the new API.

Script change:
```ts
const { buttonRef, magneticStyle, onMouseMove, onMouseLeave } =
  useMagneticButton();
```

Template — the NuxtLink branch becomes (apply the same pattern to the `<a>` and `<button>` branches, keeping their existing attributes/handlers):
```vue
<Motion
  v-if="to"
  as="NuxtLink"
  :ref="useMagnetic ? (el: any) => { buttonRef = el?.$el ?? el; } : undefined"
  :to="to"
  :class="[baseClasses, variantClasses[variant], $attrs.class]"
  :style="useMagnetic ? magneticStyle : undefined"
  :while-press="{ scale: 0.97 }"
  :transition="SPRING.snappy"
  @mousemove="useMagnetic ? onMouseMove($event) : undefined"
  @mouseleave="useMagnetic ? onMouseLeave() : undefined"
>
  <slot />
</Motion>
```
Add `import { SPRING } from "~/constants/motion";` to the script.

> Note on `as="NuxtLink"`: if `<Motion as="NuxtLink">` does not resolve the Nuxt component (it renders a literal `<nuxtlink>` element), fall back to wrapping instead: render a plain `<NuxtLink>` whose root is a `<Motion as="span" style="display:contents">`-free approach is messy — simpler fallback is to keep `<NuxtLink>`/`<a>`/`<button>` as-is and wrap the magnetic+press motion on an inner `<Motion as="span" style="display:inline-flex">` that holds the slot. Choose the wrapper fallback only if `as="NuxtLink"` misrenders. Verify in Step 3.

- [ ] **Step 3: Verify magnetic + press**

With `pnpm dev` running, Playwright MCP: navigate `/` (hero has primary buttons), move the pointer near a primary `Button`, confirm it pulls toward the cursor and springs back on leave; press-and-hold confirms a subtle scale-down. Confirm the link still navigates. Console clean. If buttons misrender (literal `nuxtlink` tag), apply the wrapper fallback from Step 2 and re-verify.

- [ ] **Step 4: Verify reduced motion**

Emulate reduced motion; confirm magnetic/press are suppressed. Add a `matchMedia` early-return guard in `onMouseMove` if the imperative values bypass MotionConfig.

- [ ] **Step 5: Commit**

```bash
git add composables/useMagneticButton.ts components/ui/Button.vue
git commit -m "feat(motion): spring magnetic buttons + press feedback via motion values"
```

---

## Task 8: Project card hover lift — SortableProjectCard

**Files:**
- Modify: `components/SortableProjectCard.vue` (root `<article>` → `<Motion as="article">` with hover lift)

- [ ] **Step 1: Convert the root to Motion with a hover lift**

In `components/SortableProjectCard.vue`, change the root `<article>` to `<Motion as="article">`, route `elementRef` through the DOM node, and add a subtle spring hover lift. The existing `:style` array and `:class` are preserved; add `while-hover` and `transition`:
```vue
<Motion
  as="article"
  :ref="(el: any) => { elementRef = el?.$el ?? el; }"
  :while-hover="{ y: -2 }"
  :transition="SPRING.soft"
  :style="[
    activeTransitionSlug === project.slug && { viewTransitionName: 'project-detail' },
    isDragging && { opacity: 0.5, zIndex: 50 },
  ]"
  :class="[
    'group glass-solid rounded-xl hover:border-accent/30 transition-colors relative border-l-[3px]',
    expanded ? 'col-span-full p-5' : 'p-3.5 min-h-[72px]',
    categoryBorderColor,
    project.featured && !expanded && 'ring-1 ring-accent/20',
  ]"
>
  <!-- inner content unchanged -->
</Motion>
```
In `<script setup>`, add:
```ts
import { SPRING } from "~/constants/motion";
```
`elementRef` is still declared with `const elementRef = ref<HTMLElement | null>(null);` and still passed to `useSortable({ element: elementRef, ... })` — only the template `ref` binding changes to read `$el`.

- [ ] **Step 2: Verify hover + drag still work**

With `pnpm dev` running, Playwright MCP: navigate `/project`, hover a card → confirm a subtle lift; confirm the existing border/expand behavior is intact; drag a card by its grip handle → confirm `@dnd-kit` reorder still works (the `elementRef` DOM node must resolve via `$el`). Console clean.

- [ ] **Step 3: Verify the `viewTransitionName` style is harmless**

We disabled Nuxt view transitions (Task 1) and will replace the shared-element morph in Task 12. The `viewTransitionName: 'project-detail'` style on this card is now inert but harmless — leave it for Task 12 to remove cleanly.

- [ ] **Step 4: Commit**

```bash
git add components/SortableProjectCard.vue
git commit -m "feat(motion): spring hover lift on project cards"
```

---

## Task 9: Hero entrance — staggered orchestration (index.vue)

**Files:**
- Modify: `pages/index.vue` (hero left column: stagger container + per-char heading + motion-v scroll parallax)

- [ ] **Step 1: Wrap the hero left column in a stagger container**

In `pages/index.vue`, the LEFT identity/CTA column currently uses independent `v-reveal="{ delay }"` on the eyebrow, tagline, and badges. Replace those with a single motion-v stagger container so they cascade on one timeline. Convert the wrapping `<div class="text-center lg:text-left">` to:
```vue
<Motion
  as="div"
  class="text-center lg:text-left"
  :variants="staggerContainer"
  initial="hidden"
  animate="show"
>
  <Motion as="p" :variants="fadeUp" class="text-xs font-medium text-accent tracking-wide uppercase mb-2">
    Frontend Engineer · AppliedAI
  </Motion>

  <!-- heading: see Step 2 -->

  <Motion as="p" :variants="fadeUp" class="text-base text-muted max-w-md mx-auto lg:mx-0 mb-4">
    I build AI workflow surfaces that real users operate.
  </Motion>

  <!-- badges row: wrap each previously-v-reveal badge as <Motion ... :variants="fadeUp"> -->
</Motion>
```
Remove the `v-reveal="{ delay: ... }"` bindings from these migrated elements (their timing now comes from the stagger). For the badge row, change the outer `<div class="flex flex-wrap ...">` children (the "Open · GCC · SEA · EEA" anchor and the "5+ yrs" div) from `v-reveal="{ delay }"` to `<Motion as="a"/<Motion as="div"` with `:variants="fadeUp"`, preserving all existing classes/attributes.

- [ ] **Step 2: Convert the per-character heading to a motion-v stagger**

Replace the heading's CSS `char-reveal` spans with motion-v children. The `<h1 id="hero-heading" ...>` becomes:
```vue
<Motion
  as="h1"
  id="hero-heading"
  class="text-h2 font-bold text-foreground mb-2"
  :style="heroParallaxStyle"
  :variants="staggerContainer"
  initial="hidden"
  animate="show"
  aria-label="Joel Stephen"
>
  <Motion
    v-for="(char, i) in titleChars"
    :key="i"
    as="span"
    :variants="charVariant"
    aria-hidden="true"
    style="display:inline-block; white-space:pre"
  >{{ char === " " ? " " : char }}</Motion>
</Motion>
```
Add to `pages/index.vue` `<script setup>`:
```ts
import {
  staggerContainer,
  fadeUp,
  EASE_ENTRANCE,
  DURATION,
} from "~/constants/motion";

const charVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_ENTRANCE },
  },
};
```
The existing `titleChars`/`charIndex` stay (you can drop `charIndex` if no longer referenced — verify with lint). `aria-label` on the heading + `aria-hidden` on the spans preserves the accessible name.

- [ ] **Step 3: Migrate the hero parallax to motion-v scroll**

Replace the `useWindowScroll`-based `heroParallaxStyle` computed (lines ~382-388) with motion-v scroll-linked values:
```ts
import { useScroll, useTransform } from "motion-v";

const { scrollY } = useScroll();
const heroY = useTransform(scrollY, (v) => -(v * 0.08));
const heroParallaxStyle = { y: heroY };
```
Remove the now-unused `useWindowScroll` import and the old `const { y: scrollY } = useWindowScroll();` line **only if** `scrollY` is not used elsewhere in the file (grep first; if it is, keep it and name the motion scroll value differently, e.g. `mvScrollY`). If a second parallax style (`* 0.04`) exists, migrate it the same way.

- [ ] **Step 4: Remove the now-dead `char-reveal` CSS (deferred)**

`char-reveal` is also used by `PageHeader.vue`. Do **not** delete the `char-reveal` CSS yet — it is removed in Task 11 after `PageHeader` is verified. Leave it for now.

- [ ] **Step 5: Verify the hero**

With `pnpm dev` running, Playwright MCP: load `/`, confirm the eyebrow → name (per-char) → tagline → badges cascade in once on load with the premium ease; scroll down and confirm the heading drifts up (parallax). Confirm screen-reader name is "Joel Stephen" (the `aria-label`). Console clean.

- [ ] **Step 6: Verify reduced motion**

Emulate reduced motion; confirm the hero appears with no stagger/parallax motion (content immediately visible).

- [ ] **Step 7: Commit**

```bash
git add pages/index.vue
git commit -m "feat(motion): orchestrated hero stagger + per-char heading + scroll parallax"
```

---

## Task 10: PageHeader stagger + retire char-reveal CSS

**Files:**
- Modify: `components/PageHeader.vue` (per-char heading → motion-v; eyebrow/subtitle keep `v-reveal`)
- Modify: `assets/css/main.css` (remove `char-reveal` keyframes/classes)
- Modify: `tailwind.config.js` if it defines the `char-reveal` keyframe/animation

- [ ] **Step 1: Convert the animated heading branch**

In `components/PageHeader.vue`, replace the `v-if="animate"` heading (the `char-reveal` spans) with the same motion-v per-char pattern used in the hero:
```vue
<Motion
  v-if="animate"
  as="h1"
  :id="id"
  class="text-h2 font-bold text-foreground mb-1"
  :variants="staggerContainer"
  initial="hidden"
  animate="show"
  :aria-label="title"
>
  <Motion
    v-for="(char, i) in titleChars"
    :key="i"
    as="span"
    :variants="charVariant"
    aria-hidden="true"
    style="display:inline-block; white-space:pre"
  >{{ char === " " ? " " : char }}</Motion>
</Motion>
```
Add to `<script setup>`:
```ts
import { staggerContainer, EASE_ENTRANCE, DURATION } from "~/constants/motion";

const charVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_ENTRANCE },
  },
};
```
The `v-else` plain-title `<h1 v-reveal="{ delay: 50 }">`, the eyebrow, and the subtitle keep their `v-reveal` (already migrated in Task 5). Drop `charIndex` if now unused (lint will flag it).

- [ ] **Step 2: Delete char-reveal CSS**

Now that no template uses `char-reveal`, remove from `assets/css/main.css` the `.char-reveal` rule and its `@keyframes` (e.g. a `char-in`/`char-reveal` keyframe). If `tailwind.config.js` defines a matching keyframe/animation entry, remove it too. Grep first: `grep -rn "char-reveal" .` should return zero matches after this step.

- [ ] **Step 3: Verify**

With `pnpm dev` running, Playwright MCP: navigate to a page that uses `<PageHeader :animate="true">` (grep for `animate` usage; e.g. a project/about header), confirm the heading staggers in per character, eyebrow/subtitle reveal correctly, and no console error. Then visit a page using the plain (`animate=false`) header and confirm it reveals normally.

- [ ] **Step 4: Commit**

```bash
git add components/PageHeader.vue assets/css/main.css tailwind.config.js
git commit -m "feat(motion): PageHeader per-char stagger, remove char-reveal CSS"
```

---

## Task 11: Ambient orbs → motion-v (default.vue)

**Files:**
- Modify: `layouts/default.vue` (the three `animate-orb-*` divs → `<Motion>` infinite drift)
- Modify: `assets/css/main.css` (remove `@keyframes orb-drift-*`)
- Modify: `tailwind.config.js` (remove `animate-orb-1/2/3` + keyframe defs)

- [ ] **Step 1: Replace orb CSS animations with motion-v loops**

In `layouts/default.vue`, the ambient block has three orb divs using `animate-orb-1`, `animate-orb-2`, `animate-orb-3`. Convert each to `<Motion>` with an infinite drift. Keep the existing positional/size/gradient classes; remove the `animate-orb-*` class and add motion props. Example for orb 1:
```vue
<Motion
  as="div"
  :class="[
    'absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-700',
    orbGradient1,
  ]"
  :animate="{ x: [0, 30, 0], y: [0, -20, 0] }"
  :transition="{ duration: 18, repeat: Infinity, ease: 'easeInOut' }"
/>
```
Orb 2 (`w-[400px]`, `orbGradient2`): `:animate="{ x: [0, -24, 0], y: [0, 24, 0] }"`, `:transition="{ duration: 25, repeat: Infinity, ease: 'easeInOut' }"`.
Orb 3 (`w-[350px]`, static gradient): `:animate="{ x: [0, 20, 0], y: [0, 16, 0] }"`, `:transition="{ duration: 32, repeat: Infinity, ease: 'easeInOut' }"`.
Match the translation magnitudes to the current keyframes if they differ (read `@keyframes orb-drift-1/2/3` in `main.css` and mirror the px deltas).

- [ ] **Step 2: Delete dead orb CSS + Tailwind entries**

Remove from `assets/css/main.css`: `@keyframes orb-drift-1`, `orb-drift-2`, `orb-drift-3` (and any `@keyframes float`/`float-slow` if those become unused — check; the hero floating glass divs in `index.vue` still use `animate-float`/`animate-float-slow`, so keep `float` unless you also migrate those in Step 4).
Remove from `tailwind.config.js` the `animate-orb-1/2/3` animation entries and their keyframe definitions.

- [ ] **Step 3: Verify**

With `pnpm dev` running, Playwright MCP: load any page, observe the background orbs drift slowly and continuously; confirm theme-based gradient color still switches per route (`orbGradient1/2` computeds untouched). Console clean. Under reduced motion, confirm orbs hold still (MotionConfig should pause the loop).

- [ ] **Step 4 (optional, same commit): migrate hero floating glass**

If you want full purity, convert the two `animate-float` / `animate-float-slow` decorative glass divs in `pages/index.vue` to `<Motion>` infinite loops (`:animate="{ y: [0, -16, 0], rotate: [0, 2, 0] }"`, `:transition="{ duration: 6, repeat: Infinity, ease: 'easeInOut' }"`; the slow one with `duration: 9` and a negative phase via a small `delay`). Then remove `@keyframes float` and the `animate-float*` Tailwind entries. If you skip this, leave `float` CSS intact.

- [ ] **Step 5: Commit**

```bash
git add layouts/default.vue assets/css/main.css tailwind.config.js pages/index.vue
git commit -m "feat(motion): ambient orbs (and hero floats) via motion-v loops"
```

---

## Task 12: Ambient gradient mesh + cursor glow → motion-v

**Files:**
- Modify: `components/HeroGradientMesh.vue`
- Modify: `components/CursorGlow.vue`
- Modify: `assets/css/main.css` (remove `@keyframes gradient-rotate`, `@property --gradient-angle` if now unused)

- [ ] **Step 1: Drive the gradient angle with a motion value**

Rewrite `components/HeroGradientMesh.vue` so the conic-gradient angle is animated by a motion value instead of the CSS `gradient-rotate` keyframe. Use one `useMotionValue` per layer animated via `animate` on mount, composed into the gradient with `useMotionTemplate`, bound to each layer's `:style.background`. Keep the three layers' opacities and rough timings (18s / 25s reverse / 32s). Sketch:
```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { animate, useMotionValue, useMotionTemplate } from "motion-v";

const angle1 = useMotionValue(0);
const angle2 = useMotionValue(360);
const angle3 = useMotionValue(0);

const bg1 = useMotionTemplate`conic-gradient(from ${angle1}deg at 50% 45%, transparent 0%, rgb(var(--accent)) 12%, transparent 25%, rgb(var(--accent-hover)) 37%, transparent 50%, rgb(var(--accent)) 62%, transparent 75%, rgb(var(--accent-hover)) 87%, transparent 100%)`;
const bg2 = useMotionTemplate`conic-gradient(from ${angle2}deg at 55% 50%, transparent 0%, rgb(var(--accent-hover)) 15%, transparent 30%, rgb(var(--accent)) 45%, transparent 60%, rgb(var(--accent-hover)) 75%, transparent 90%)`;
const bg3 = useMotionTemplate`radial-gradient(ellipse 600px 400px at 40% 50%, rgb(var(--accent) / 0.2) 0%, transparent 70%)`;

onMounted(() => {
  animate(angle1, 360, { duration: 18, repeat: Infinity, ease: "linear" });
  animate(angle2, 0, { duration: 25, repeat: Infinity, ease: "linear" });
  animate(angle3, 360, { duration: 32, repeat: Infinity, ease: "linear" });
});
</script>

<template>
  <div class="hero-gradient-mesh" aria-hidden="true">
    <Motion as="div" class="hero-gradient-mesh__layer" :style="{ background: bg1, opacity: 0.1 }" />
    <Motion as="div" class="hero-gradient-mesh__layer" :style="{ background: bg2, opacity: 0.07 }" />
    <Motion as="div" class="hero-gradient-mesh__layer" :style="{ background: bg3, opacity: 0.03 }" />
  </div>
</template>

<style scoped>
.hero-gradient-mesh {
  position: absolute;
  inset: -10px 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.hero-gradient-mesh__layer {
  position: absolute;
  inset: -50%;
}
</style>
```
(bg3 doesn't rotate visually via angle; `angle3` is animated only to keep parity — you may drop `angle3`/the bg3 animation and leave layer 3 static, since the original layer-3 used `gradient-rotate` on a radial gradient with no angle effect anyway.)

- [ ] **Step 2: Spring-trail the cursor glow**

Rewrite `components/CursorGlow.vue` to follow the pointer through `useSpring`-smoothed motion values:
```vue
<template>
  <Motion
    v-if="isHoverDevice"
    as="div"
    class="fixed pointer-events-none -z-5 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl"
    :style="{ x: glowX, y: glowY, background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useMotionValue, useSpring } from "motion-v";
import { SPRING } from "~/constants/motion";

const isHoverDevice = useMediaQuery("(hover: hover)");
const targetX = useMotionValue(0);
const targetY = useMotionValue(0);
const glowX = useSpring(targetX, SPRING.soft);
const glowY = useSpring(targetY, SPRING.soft);

function onMove(e: MouseEvent) {
  targetX.set(e.clientX - 250);
  targetY.set(e.clientY - 250);
}
onMounted(() => window.addEventListener("mousemove", onMove, { passive: true }));
onUnmounted(() => window.removeEventListener("mousemove", onMove));
</script>
```
(`CursorGlow` is already mounted under `<ClientOnly>` in the layout, so `window` is safe in `onMounted`.)

- [ ] **Step 3: Delete dead CSS**

In `assets/css/main.css`, remove `@keyframes gradient-rotate`. Remove `@property --gradient-angle` and `@property --border-angle` only if grep shows they are now unused (`grep -rn "gradient-angle\|border-angle" .`). Keep any still referenced.

- [ ] **Step 4: Verify**

With `pnpm dev` running, Playwright MCP: load `/`, confirm the hero gradient mesh still rotates smoothly and the cursor glow trails the pointer with a soft spring lag. Console clean. Under reduced motion, confirm the glow follows without distracting motion and the mesh holds (or rotates minimally) — acceptable either way as it's decorative and `aria-hidden`.

- [ ] **Step 5: Commit**

```bash
git add components/HeroGradientMesh.vue components/CursorGlow.vue assets/css/main.css
git commit -m "feat(motion): gradient mesh + cursor glow via motion values"
```

---

## Task 13: Card→detail fade/scale match + retire shared-element wiring

**Files:**
- Modify: `layouts/project-detail.vue` (remove `view-transition-name` shared-element wiring)
- Modify: `components/SortableProjectCard.vue` (remove inert `viewTransitionName` style + unused transition slug if fully dead)
- Modify: `composables/useProjectTransition.ts` (simplify/remove if no longer used)
- Modify: `assets/css/main.css` (remove `::view-transition-*(project-detail)` rules + `.project-detail-content` if dead)

**Behavior:** Navigating a card → its detail page now uses the global AnimatePresence page transition (blur/fade/slide). We make the detail page's first paint a deliberate fade+scale-up so it reads as an intentional "expand", per the accepted R1 tradeoff (no literal pixel-morph).

- [ ] **Step 1: Add a fade/scale entrance to the detail layout**

In `layouts/project-detail.vue`, wrap the detail content slot in a `<Motion>` entrance:
```vue
<Motion
  as="div"
  :initial="{ opacity: 0, scale: 0.98 }"
  :animate="{ opacity: 1, scale: 1 }"
  :transition="{ duration: DURATION.base, ease: EASE_TRANSITION }"
>
  <slot />
</Motion>
```
Add `import { DURATION, EASE_TRANSITION } from "~/constants/motion";`. Remove any `view-transition-name: project-detail` binding/`:style` from this layout.

- [ ] **Step 2: Remove inert shared-element code**

In `components/SortableProjectCard.vue`, remove the `activeTransitionSlug === project.slug && { viewTransitionName: 'project-detail' }` entry from the root `:style` array (keep the `isDragging` entry). If `activeTransitionSlug` / `setActiveTransitionSlug` are now unused there, remove the import and the `setActiveTransitionSlug(...)` call in `handleProjectClick` (keep the `sessionStorage` scroll-save and `navigateTo`). Grep `useProjectTransition` usage across the repo: if no consumers remain, delete `composables/useProjectTransition.ts`; if some remain, leave it.

- [ ] **Step 3: Delete dead view-transition CSS**

In `assets/css/main.css`, remove `::view-transition-old(project-detail)`, `::view-transition-new(project-detail)`, and `.project-detail-content` if it is no longer referenced (grep first).

- [ ] **Step 4: Verify**

With `pnpm dev` running, Playwright MCP: navigate `/project`, click a card → confirm it routes to the detail page with a clean fade/scale-up entrance (and the global page transition), back-nav returns to the list with the saved scroll position. Console clean.

- [ ] **Step 5: Commit**

```bash
git add layouts/project-detail.vue components/SortableProjectCard.vue composables/useProjectTransition.ts assets/css/main.css
git commit -m "feat(motion): card->detail fade/scale entrance, retire View Transition shared-element"
```

---

## Task 14: Final cleanup, full verification, and reduced-motion audit

**Files:**
- Modify: `assets/css/main.css`, `tailwind.config.js` (sweep any remaining dead motion CSS)

- [ ] **Step 1: Dead-code sweep**

Run these greps and remove anything with zero remaining references:
```bash
grep -rn "view-transition\|page-enter\|page-leave\|\.reveal\b\|char-reveal\|orb-drift\|gradient-rotate" assets/css/main.css tailwind.config.js
grep -rn "animate-orb\|animate-float" pages components layouts
```
Remove orphaned `@keyframes`, `@property`, and Tailwind `animation`/`keyframes` entries that no longer have a consumer. Keep anything still referenced.

- [ ] **Step 2: Lint clean**

Run: `pnpm lintfix && pnpm lint`
Expected: no errors. Fix any unused imports/vars surfaced by the migration (e.g. dropped `charIndex`, `useWindowScroll`, `useMouseInElement`).

- [ ] **Step 3: Full behavioral pass (Playwright MCP)**

With `pnpm dev` running, walk the whole site and confirm each system:
- `/` — hero staggers in; per-char heading; parallax on scroll; magnetic primary buttons; orbs + mesh + cursor glow animate.
- `/about` — section reveals on scroll, once each.
- `/experience` — staggered list reveals.
- `/work` — card tilt on hover.
- `/project` — card hover lift; click → detail fade/scale; back nav restores scroll.
- Route changes everywhere — AnimatePresence blur/fade/slide.
Console must be clean on every page (`browser_console_messages`).

- [ ] **Step 4: Reduced-motion audit**

Emulate `prefers-reduced-motion: reduce` and repeat the walk. Confirm: page transitions instant, reveals show content immediately, hero appears statically, tilt/magnetic suppressed, ambient loops hold or are minimal. Add `matchMedia` guards to any imperative motion-value handler (tilt/magnetic/glow/orbs/mesh) that still animates under reduced motion.

- [ ] **Step 5: Production build sanity (heavy — allow time)**

Run: `pnpm build`
Expected: build succeeds (note: large ML deps make this slow/memory-heavy; the `dev` script's 12 GB heap hint applies — if the build OOMs, run with `NODE_OPTIONS=--max-old-space-size=12288 pnpm build`). Confirm no motion-v SSR/prerender errors during static generation.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore(motion): final dead-CSS sweep + reduced-motion guards"
```

---

## Self-review notes (coverage check)

- **Library + Nuxt setup** → Task 1. **Tokens** → Task 2. **MotionConfig reduced-motion** → Task 3.
- **Page transitions** (replace View Transitions + Vue Transition) → Task 4.
- **Scroll-reveal** (rewrite `v-reveal`, call-sites unchanged) → Task 5.
- **Micro-interactions**: tilt → Task 6; magnetic + press → Task 7; card hover → Task 8.
- **Hero** stagger/per-char/parallax → Task 9; **PageHeader** per-char → Task 10.
- **Ambient** orbs → Task 11; mesh + cursor glow → Task 12.
- **Card→detail** fade/scale (R1 tradeoff) → Task 13.
- **CSS cleanup + reduced-motion audit + build** → Task 14 (incremental deletes happen in each task; Task 14 sweeps leftovers).
- **Risk R2 (double transitions)** handled in Task 1 Step 3. **R3 (`v-reveal` contract)** preserved in Task 5. **R5 (SSR)** — SSR off; `window`/imperative motion guarded under `onMounted`/`ClientOnly`.

**Known fallbacks documented inline:** `motion-v` vs `motion` import for imperative `animate`/`inView` (Task 5 Step 2); `<Motion as="NuxtLink">` wrapper fallback (Task 7 Step 2); `Transition`/`Variants` type import fallback (Task 2 Step 2).
