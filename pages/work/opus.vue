<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader
      id="opus-heading"
      title="Opus — AppliedAI"
      eyebrow="Case study · Current role"
      subtitle="Three production surfaces on AppliedAI's AI workflow platform — a multiplayer canvas, a node-graph editor forked from n8n, and an enterprise-facing wrapper. Real customers, real outcomes, real handoff between humans and models."
    >
      <div class="flex flex-wrap items-center justify-center gap-2 mt-2">
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-solid text-xs"
        >
          <Icon name="Calendar" :size="14" class="text-accent" />
          Jun 2025 — Present
        </span>
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-solid text-xs"
        >
          <Icon name="MapPin" :size="14" class="text-accent" />
          Abu Dhabi, UAE
        </span>
        <a
          href="https://applied.ai"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium hover:bg-accent/15 transition-colors"
        >
          <Icon name="ExternalLink" :size="14" />
          AppliedAI
        </a>
      </div>
    </PageHeader>

    <!-- TL;DR -->
    <section v-reveal class="mb-10" aria-labelledby="tldr-heading">
      <h2
        id="tldr-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Sparkles" :size="20" class="text-accent" />
        TL;DR
      </h2>
      <div class="glass-solid rounded-2xl p-6 space-y-3">
        <p class="text-foreground">
          Frontend Engineer on the Opus team since June 2025. Opus is
          AppliedAI's AI workflow platform — enterprise customers in finance,
          telecom, healthcare, and AI / cloud infrastructure use it to design
          and operate workflows on top of LLMs and ML runtimes.
        </p>
        <p class="text-sm text-muted">
          I work across three production surfaces: Process Discovery (a
          real-time multiplayer canvas, React + Yjs/CRDT, FastAPI behind it,
          Anthropic and OpenAI models inside), the Opus Technical Canvas (a fork
          of n8n rewritten as Opus's node-graph editor in Vue + TypeScript), and
          Opus-CX (the enterprise-facing surface in React + Zustand). On the
          team side, I coach junior and mid-level frontend engineers, and
          partner with internal CX, presales, and solutions teams to feed real
          customer pain points back into UI work.
        </p>
      </div>
    </section>

    <!-- Surfaces -->
    <section v-reveal class="mb-10" aria-labelledby="surfaces-heading">
      <h2
        id="surfaces-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Layers" :size="20" class="text-accent" />
        Three production surfaces
      </h2>

      <div class="space-y-4">
        <!-- Process Discovery -->
        <article
          v-reveal="{ delay: 80 }"
          class="glass-solid rounded-2xl p-6 hover:border-accent/30 transition-colors"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3"
          >
            <div>
              <h3 class="text-h3 font-semibold text-accent">
                Process Discovery
              </h3>
              <p class="text-sm text-muted">
                Multiplayer canvas · AI-driven chat · feeds workflow generation
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >React</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >Yjs / CRDT</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-medium"
                >FastAPI</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs font-medium"
                >Anthropic</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs font-medium"
                >OpenAI</span
              >
            </div>
          </div>
          <p class="text-sm text-muted mb-3">
            An AI-driven chat-plus-canvas experience that helps a company
            discover and document its own processes. Multiple users on the
            customer side co-edit a deep description of how their business
            actually runs, while the model surfaces gaps, asks clarifying
            questions, and stitches the discoveries into a structured map.
          </p>
          <p class="text-sm text-muted mb-3">
            The output isn't decorative — it feeds Opus's workflow generation
            directly, so the resulting workflow is specific to the customer's
            real operational shape, not a template.
          </p>
          <ul class="space-y-1.5 text-sm text-muted">
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Brought the product to life from early prototype to production
                surface.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Real-time multiplayer with versioning — multiple customer users
                co-editing without conflicts.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Heavily Figma-inspired UX so customers feel they are designing
                their own process, not filling a form.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Custom situation-based AI pipelines on the backend so the model
                behaves differently depending on what the user is doing on the
                canvas.</span
              >
            </li>
          </ul>
        </article>

        <!-- Opus Technical Canvas -->
        <article
          v-reveal="{ delay: 120 }"
          class="glass-solid rounded-2xl p-6 hover:border-accent/30 transition-colors"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3"
          >
            <div>
              <h3 class="text-h3 font-semibold text-accent">
                Opus Technical Canvas
              </h3>
              <p class="text-sm text-muted">
                Node-graph workflow editor · forked from n8n
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >Vue</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >TypeScript</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xs font-medium"
                >Node-graph</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xs font-medium"
                >Expressions engine</span
              >
            </div>
          </div>
          <p class="text-sm text-muted mb-3">
            Forked n8n and rewrote it as Opus's technical canvas surface — the
            place where solution engineers and technical users compose the
            workflows discovered upstream into runnable graphs.
          </p>
          <p class="text-sm text-muted mb-3">
            n8n gave us a battle-tested node-graph foundation. The fork let us
            keep what worked (executor loop, expressions, port semantics) and
            replace what didn't fit Opus's model layer.
          </p>
          <ul class="space-y-1.5 text-sm text-muted">
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span>Spearheaded the fork end-to-end.</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Owned large-graph rendering, virtualised lists, and canvas
                performance so the surface stays usable as workflows grow.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span
                >Owned undo/redo correctness and the expressions engine
                integration — the bits that break first under real use.</span
              >
            </li>
          </ul>
        </article>

        <!-- Opus-CX -->
        <article
          v-reveal="{ delay: 160 }"
          class="glass-solid rounded-2xl p-6 hover:border-accent/30 transition-colors"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3"
          >
            <div>
              <h3 class="text-h3 font-semibold text-accent">Opus-CX</h3>
              <p class="text-sm text-muted">
                Enterprise-facing surface · clean wrapper over Opus capabilities
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >React</span
              >
              <span
                class="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                >Zustand</span
              >
            </div>
          </div>
          <p class="text-sm text-muted">
            Opus-CX is the enterprise-facing software that wraps Opus's
            capabilities into a clean, usable product — the surface that has to
            survive enterprise procurement, security review, and the way real
            buyers actually operate software at scale. I ship features here
            alongside the technical surfaces above.
          </p>
        </article>
      </div>
    </section>

    <!-- Cross-cutting -->
    <section v-reveal class="mb-10" aria-labelledby="cross-heading">
      <h2
        id="cross-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Users" :size="20" class="text-accent" />
        Beyond the surfaces
      </h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="glass-solid rounded-2xl p-5">
          <h3
            class="font-semibold text-foreground mb-2 flex items-center gap-2"
          >
            <Icon name="Headphones" :size="16" class="text-accent" />
            Customer feedback loop
          </h3>
          <p class="text-sm text-muted">
            Continually partner with the internal CX, presales, and solutions
            teams to learn customer pain points and bake them into UI work
            alongside design and product. The fastest way to find the next
            useful thing to build is to listen to the people who already talk to
            customers every day.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5">
          <h3
            class="font-semibold text-foreground mb-2 flex items-center gap-2"
          >
            <Icon name="MousePointerClick" :size="16" class="text-accent" />
            Design pushback as a craft
          </h3>
          <p class="text-sm text-muted">
            Push back on visual or decorative choices that don't carry UX
            weight. I use Claude Code to mock alternative UIs as a debate tool
            when arguing for the simpler or clearer option — show, don't tell.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5">
          <h3
            class="font-semibold text-foreground mb-2 flex items-center gap-2"
          >
            <Icon name="LineChart" :size="16" class="text-accent" />
            Always-on instrumentation
          </h3>
          <p class="text-sm text-muted">
            Performance, latency, UX metrics, pain points, click-throughs,
            fall-offs — measured as ongoing instrumentation, not one-off audits.
            The platform is only as good as what the next interaction actually
            feels like.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5">
          <h3
            class="font-semibold text-foreground mb-2 flex items-center gap-2"
          >
            <Icon name="UserCheck" :size="16" class="text-accent" />
            Mentorship and culture
          </h3>
          <p class="text-sm text-muted">
            Coach the frontend team in AI-tooling adoption and build a culture
            where reusable patterns become shared skills. Mentor junior and
            mid-level engineers. The frontend function has stayed fully staffed
            and productive for roughly a year while other functions rotated more
            — the team I'm part of is the outcome I'm proudest of.
          </p>
        </div>
      </div>
    </section>

    <!-- Stack -->
    <section v-reveal class="mb-10" aria-labelledby="stack-heading">
      <h2
        id="stack-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Code2" :size="20" class="text-accent" />
        Stack I touched on Opus
      </h2>
      <div class="glass-solid rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-2">Frontend</h3>
          <p class="text-sm text-muted">
            React, Vue 3, TypeScript, Zustand, large-graph canvas rendering,
            virtualised lists, Yjs (CRDT), WebSocket, SSE, expressions engine
            integration.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-2">Backend</h3>
          <p class="text-sm text-muted">
            FastAPI (Python) for the API and orchestration layer underneath the
            canvas, custom situation-based AI pipelines coordinating Anthropic
            and OpenAI models.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-2">Models</h3>
          <p class="text-sm text-muted">
            Anthropic API, OpenAI API, prompt engineering across multi-step tool
            flows, RAG-style retrieval over customer data when the workflow
            demands it.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-2">Process</h3>
          <p class="text-sm text-muted">
            Code review, sprint planning, continuous instrumentation, design
            collaboration in Figma. Pair-programming with mid-level and junior
            engineers on the harder bits.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section v-reveal class="text-center" aria-label="Next">
      <div class="glass-solid rounded-2xl p-8 space-y-4">
        <h2 class="text-h3 font-semibold text-foreground">
          Open to Senior / Staff roles · GCC · SEA · EEA
        </h2>
        <p class="text-sm text-muted max-w-2xl mx-auto">
          The work I want to do next looks a lot like the work above — building
          AI-driven product surfaces that real users operate, with a tight
          customer feedback loop. Open across the Gulf (GCC), Southeast Asia,
          and the European Economic Area.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <UiButton variant="primary" href="/joel-stephen-resume.pdf">
            <Icon name="Download" :size="18" />
            Download Resume
          </UiButton>
          <UiButton variant="secondary" to="/contact">
            <Icon name="Mail" :size="18" />
            Get in touch
          </UiButton>
          <UiButton variant="tertiary" to="/experience">
            <Icon name="GitBranch" :size="18" />
            Career timeline
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "project-detail" });

useSeo({
  title: "Opus at AppliedAI — Case Study | Joel Stephen",
  description:
    "How I built Process Discovery (React + Yjs/CRDT multiplayer canvas), spearheaded the Opus Technical Canvas (n8n fork in Vue + TypeScript), and shipped on Opus-CX (React + Zustand) — three production surfaces on AppliedAI's AI workflow platform.",
  breadcrumbTitle: "Opus — AppliedAI",
});

const config = useRuntimeConfig();
const SITE_URL =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Opus at AppliedAI — Case Study",
  description:
    "Three production surfaces (Process Discovery, Opus Technical Canvas, Opus-CX) on AppliedAI's AI workflow platform.",
  author: { "@type": "Person", name: "Joel Stephen", url: SITE_URL },
  datePublished: "2026-05-16",
  image: `${SITE_URL}/og-image.png`,
  url: `${SITE_URL}/work/opus`,
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Work",
      item: `${SITE_URL}/work`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Opus at AppliedAI",
      item: `${SITE_URL}/work/opus`,
    },
  ],
};
useHead({
  script: [
    { type: "application/ld+json", innerHTML: JSON.stringify(articleSchema) },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(breadcrumbSchema),
    },
  ],
});
</script>
