# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Joel Stephen's personal portfolio website — a Nuxt 3 SPA with interactive project demos (aim trainer, pathfinding visualizer, background remover, image captioning, etc.) and an AI chat agent powered by Groq.

**Live site:** https://joelstephen.vercel.app

## Commands

```bash
pnpm dev          # Start dev server (12GB Node memory limit for ML deps)
pnpm build        # Production build
pnpm generate     # Static pre-rendering (all 22 routes)
pnpm lint         # ESLint + Prettier check
pnpm lintfix      # ESLint fix + Prettier format
```

## Architecture

**Stack:** Nuxt 3 (SSR disabled, static SPA), Vue 3, TypeScript, Tailwind CSS 3, pnpm, deployed on Vercel.

### Design System — "Tahoe Liquid Glass"

CSS variables defined in `assets/css/main.css` (`:root` for light, `.dark` for dark) are registered as Tailwind colors in `tailwind.config.js`. **Always use semantic Tailwind classes** (`bg-glass`, `text-foreground`, `border-border`, etc.) — never `bg-[rgb(var(--...))]`.

CSS component classes (`.glass`, `.glass-solid`, `.btn-primary`, `.btn-secondary`, `.form-input`) are defined in `@layer components` in main.css.

### Key Shared Components

- **`PageHeader.vue`** — eyebrow label + h1 + optional subtitle + slot. Use on every page.
- **`ui/Button.vue`** — variants: `primary`, `secondary`, `tertiary`. Supports `to` (NuxtLink), `href` (external), or plain button.
- **`ui/Icon.vue`** — lucide icon wrapper. **Must be explicitly imported** (`import Icon from "~/components/ui/Icon.vue"`) — it is NOT auto-imported because its name collides with Nuxt's reserved component names.

### Key Composables

- **`useSeo()`** — meta tags, OG, Twitter Card, schema.org. Use on every page.
- **`useJoelAgent()`** — AI chat state, localStorage persistence, typing animation, personality selection.
- **`useTransformersClient()`** — wrapper for `@huggingface/transformers`. **Must use this instead of direct imports** (enforced by ESLint rule `no-restricted-imports`).

### Layouts

- **`default.vue`** — header, main content area with page transitions, footer. Lazy-loads `JoelAgentChat` and `PwaInstallPrompt` via `requestIdleCallback`.
- **`project-detail.vue`** — wraps default layout, adds `view-transition-name` for shared-element transitions.

### Server API

`POST /api/chat` — Groq-powered chat endpoint with personality system (yoda/tony/house), jailbreak guardrails, and input sanitization. Requires `GROQ_API_KEY` env var.

### Page Transitions

Cinematic blur + fade + slide-up transitions using the View Transitions API. Named transitions: `page-content`, `project-detail`. Respects `prefers-reduced-motion`.

### Security

Trusted Types API via DOMPurify plugin (`plugins/01.trusted-types.client.ts`). CSP headers configured in nuxt.config.ts. Server-side input sanitization on chat endpoint.

## Environment Variables

```
GROQ_API_KEY=...                    # Required for chat (Groq free tier available)
NUXT_PUBLIC_SITE_URL=...            # Default: https://joelstephen.vercel.app
```
