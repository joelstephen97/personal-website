# Motion-V Full Migration — Design

**Date:** 2026-06-13
**Repo:** personal-website (Nuxt 3 static SPA, Vue 3, TS, Tailwind 3)
**Goal:** Replace the site's current CSS / View-Transitions / `v-reveal` motion system with a single, consistent motion system powered by **motion-v** (the official Framer Motion port for Vue). Target feel: Apple-tier — precise, minimal, premium. Nothing playful.

## Decision summary

- **Library:** `motion-v` + `motion-v/nuxt` module. Framer Motion API surface (`<motion.*>`, `<AnimatePresence>`, `useScroll`, `useSpring`, `useTransform`, `useMotionValue`, `<MotionConfig>`).
- **Scope:** Full migration. Everything interactive AND ambient moves to motion-v. The old CSS keyframes / `.reveal` classes / View-Transition page CSS / `prefers-reduced-motion` manual branches are removed once replaced.
- **Shared-element card→detail:** Replaced with a polished motion-v fade/scale match transition (NOT a literal layoutId pixel-morph — see Risk R1). Accepted by user.
- **Feel signature:** one ease for entrances `[0.16, 1, 0.3, 1]`, one ease for transitions `[0.4, 0, 0.2, 1]`, a small fixed set of durations, 2–3 spring presets. Single source of truth in `constants/motion.ts`.

## Architecture

### New files
- **`constants/motion.ts`** — exported tokens: `EASE_ENTRANCE`, `EASE_TRANSITION`, `DURATION` (`{ fast, base, slow }`), `SPRING` (`{ soft, snappy, magnetic }`), and shared variant objects (`fadeUp`, `staggerContainer`, `pageVariants`). Every component imports from here. This is the precision/consistency lever.

### Modified — config & shell
- **`package.json`** — add `motion-v` dependency.
- **`nuxt.config.ts`** — register `motion-v/nuxt` in `modules`.
- **`app.vue`** — wrap `<NuxtLayout>` in `<MotionConfig :reduced-motion="'user'">` so all motion-v animations auto-respect `prefers-reduced-motion`.

### Modified — page transitions
- **`layouts/default.vue`** — replace the Vue `<Transition name="page" mode="out-in">` block with `<AnimatePresence mode="wait">` wrapping a `<motion.div :key="route.path">` using `pageVariants` (blur + fade + slide-up entrance, reverse exit). Disable Nuxt's built-in page transition so the two don't compound.
- **`layouts/project-detail.vue`** — remove `view-transition-name` shared-element wiring; rely on the default layout's AnimatePresence plus the fade/scale match (R1).

### Modified — scroll reveal
- **`plugins/reveal.ts`** (registers the `v-reveal` directive — currently `mounted` adds `.reveal` class + IntersectionObserver, `unmounted` cleans up) — rewrite internals to use motion-v's `inView` + `animate` (spring-based fade/slide) instead of IntersectionObserver + CSS class toggling. **All `v-reveal="{ delay }"` call-sites stay unchanged** — zero template churn across `about.vue`, `contact.vue`, `experience.vue`, `index.vue`, `PageHeader.vue`, etc. Preserve the `{ delay }` binding contract exactly.

### Modified — micro-interactions
- **`composables/useCardTilt.ts`** — rebuild on `useMotionValue` + `useSpring` + `useTransform` for true spring tilt.
- **`composables/useMagneticButton.ts`** — rebuild on motion values + `SPRING.magnetic`.
- **`components/SortableProjectCard.vue`, `components/WorkCard.vue`** — `whileHover` / `whileTap` using shared spring.
- **`components/ui/Button.vue`** — `whileTap` press feedback via shared spring.

### Modified — hero
- **`pages/index.vue`** — wrap hero in a `staggerContainer` variant; children (eyebrow, name, tagline, CTAs) use `fadeUp` so they cascade on one orchestrated timeline. Keep existing `typed.js` typing effect.

### Modified — ambient background (full-purity migration)
- **`layouts/default.vue` orbs** — replace `animate-orb-*` CSS classes with `<motion.div>` infinite drift (`animate` keyframes + `transition: { repeat: Infinity, ease }`).
- **`components/HeroGradientMesh.vue`** — drive the rotating gradient angle with a motion value / `animate` loop instead of the `@keyframes gradient-rotate` CSS.
- **`components/CursorGlow.vue`** — follow the pointer with `useMotionValue` + `useSpring` for a smoothed trailing glow.

### Modified — CSS cleanup (`assets/css/main.css`)
Remove, only after each is replaced and verified:
- `.page-enter-*` / `.page-leave-*` rules
- `::view-transition-*(page-content)` and related `@keyframes view-transition-*`
- `.reveal` / `.revealed` / `.reveal--scale` system
- ambient `@keyframes orb-drift-*`, `float`, `gradient-rotate` and `animate-orb-*` utilities (and matching entries in `tailwind.config.js`)
- the manual `@media (prefers-reduced-motion: reduce)` branches now handled by `<MotionConfig>`
Keep: glass/`@property`/non-motion styling untouched.

## Data flow / behavior
1. App boots → `<MotionConfig reduced-motion="user">` establishes global reduced-motion policy.
2. Route change → `AnimatePresence` runs exit on old page, mount+enter on new page via `pageVariants`.
3. On-screen sections → `v-reveal` directive triggers motion-v `inView` → spring fade/slide once.
4. Pointer/hover → motion values + springs drive tilt, magnetic, glow, hover/tap states.
5. Idle → ambient orb/mesh loops run via motion-v infinite transitions.

## Testing / verification
- `pnpm lint` clean (ESLint + Prettier).
- `pnpm dev` + Playwright MCP: navigate home→about→experience→project; confirm (a) page transition fires, (b) hero stagger lands in order, (c) scroll-reveal sections animate once, (d) card hover spring works, (e) emulate `prefers-reduced-motion: reduce` and confirm motion is suppressed.
- Visual spot-check in light + dark mode.

## Risks
- **R1 — shared-element morph.** motion-v `layoutId` shared-element transitions need one persistent component tree; Nuxt swaps the tree on route change, so a true card→detail pixel-morph isn't reliable. Mitigation: polished fade/scale match instead. Accepted by user.
- **R2 — double transitions.** Nuxt's built-in `pageTransition` could compound with AnimatePresence. Mitigation: explicitly disable Nuxt page/layout transitions in `nuxt.config.ts` / `definePageMeta`.
- **R3 — directive rewrite regressions.** `v-reveal` is used widely with `delay`/stagger; the rewrite must preserve the `{ delay }` option contract exactly so call-sites keep working.
- **R4 — ambient JS cost.** Moving infinite loops to JS adds runtime cost vs. compositor-only CSS. Mitigation: use motion-v transform/opacity animations (compositor-friendly), keep loop counts identical to today.
- **R5 — SSR/hydration.** SSR is disabled (static SPA), so motion-v runs client-side only — low risk. Keep `CursorGlow` etc. under `<ClientOnly>` as today.

## Out of scope
- No new sections/pages or content changes.
- No redesign of layout/spacing — motion only.
- No change to the AI chat, PWA, or project-demo logic.
