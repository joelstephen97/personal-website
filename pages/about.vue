<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader
      id="about-heading"
      title="About Joel"
      eyebrow="Get to know"
      subtitle="Frontend Engineer at AppliedAI. 5+ years across 4 companies. Based in Abu Dhabi — open to roles across the GCC, Southeast Asia, and the EEA."
    />

    <!-- Quick facts -->
    <section v-reveal class="mb-10" aria-label="At a glance">
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="glass-solid rounded-2xl p-5 flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
          >
            <Icon name="Briefcase" :size="20" class="text-accent" />
          </div>
          <div>
            <h2 class="font-semibold text-foreground">
              Frontend Engineer · AppliedAI
            </h2>
            <p class="text-sm text-muted">
              Since June 2025. Shipping Process Discovery, Opus Technical
              Canvas, and Opus-CX.
            </p>
          </div>
        </div>
        <div class="glass-solid rounded-2xl p-5 flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
          >
            <Icon name="MapPin" :size="20" class="text-accent" />
          </div>
          <div>
            <h2 class="font-semibold text-foreground">Based in Abu Dhabi</h2>
            <p class="text-sm text-muted">
              UAE. Open to roles across the GCC, Southeast Asia, and the EEA.
            </p>
          </div>
        </div>
        <div class="glass-solid rounded-2xl p-5 flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
          >
            <Icon name="GraduationCap" :size="20" class="text-accent" />
          </div>
          <div>
            <h2 class="font-semibold text-foreground">
              B.E. Computer Science (Hons)
            </h2>
            <p class="text-sm text-muted">
              BITS Pilani, Dubai Campus · 2015 – 2019.
            </p>
          </div>
        </div>
        <div class="glass-solid rounded-2xl p-5 flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
          >
            <Icon name="Languages" :size="20" class="text-accent" />
          </div>
          <div>
            <h2 class="font-semibold text-foreground">Languages</h2>
            <p class="text-sm text-muted">
              English (fluent), Hindi (conversational), Malayalam (native,
              conversational).
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What I do -->
    <section v-reveal class="mb-10" aria-labelledby="what-heading">
      <h2
        id="what-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Code2" :size="20" class="text-accent" />
        What I do
      </h2>
      <div class="glass-solid rounded-2xl p-6 space-y-3">
        <p class="text-foreground">
          I build the surfaces enterprise users actually operate. Today at
          AppliedAI that's Opus — three production surfaces:
        </p>
        <ul class="space-y-2 text-sm text-muted">
          <li class="flex items-start gap-2">
            <Icon
              name="Sparkle"
              :size="16"
              class="text-accent mt-0.5 flex-shrink-0"
            />
            <span
              ><strong class="text-foreground">Process Discovery</strong> — a
              real-time multiplayer canvas in React + Yjs/CRDT where customers
              co-edit deep descriptions of their processes, and the output feeds
              Opus's workflow generation.</span
            >
          </li>
          <li class="flex items-start gap-2">
            <Icon
              name="Sparkle"
              :size="16"
              class="text-accent mt-0.5 flex-shrink-0"
            />
            <span
              ><strong class="text-foreground">Opus Technical Canvas</strong> —
              a node-graph editor I spearheaded as a fork of n8n, rewritten in
              Vue + TypeScript with its own expressions integration and
              large-graph performance work.</span
            >
          </li>
          <li class="flex items-start gap-2">
            <Icon
              name="Sparkle"
              :size="16"
              class="text-accent mt-0.5 flex-shrink-0"
            />
            <span
              ><strong class="text-foreground">Opus-CX</strong> — the
              enterprise-facing surface in React + Zustand that wraps Opus's
              capabilities into something buyers can actually procure and
              operate.</span
            >
          </li>
        </ul>
        <p class="text-sm text-muted">
          Before AppliedAI, I led frontend and DevOps at Otani Trading on a PWA
          that used YOLO v5 + OpenCV to detect flower lifecycle and defects from
          grower photos — turning a subjective claim into evidence buyers could
          verify. Before that, embedded engineering on a B2B operational
          platform shipping seven major features driven by direct user feedback.
        </p>
      </div>
    </section>

    <!-- Hot take -->
    <section v-reveal class="mb-10" aria-labelledby="hot-take-heading">
      <h2
        id="hot-take-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Flame" :size="20" class="text-accent" />
        Hot take on frontend
      </h2>
      <div class="glass-solid rounded-2xl p-6">
        <blockquote class="text-foreground text-lg leading-relaxed">
          "A frontend engineer is only good if they can think like a user.
          Mechanically implementing designs without understanding the user story
          and the PRD doesn't count as frontend work."
        </blockquote>
      </div>
    </section>

    <!-- Where I want to work -->
    <section v-reveal class="mb-10" aria-labelledby="regions-heading">
      <h2
        id="regions-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Globe" :size="20" class="text-accent" />
        Where I want to work
      </h2>
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="glass-solid rounded-2xl p-5 space-y-2">
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Sun" :size="16" class="text-accent" />
            GCC
          </h3>
          <p class="text-sm text-muted">
            Already home — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman. I
            know the region, the customers, and the operating tempo. Zero
            relocation friction.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5 space-y-2">
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Palmtree" :size="16" class="text-accent" />
            Southeast Asia
          </h3>
          <p class="text-sm text-muted">
            Singapore, Malaysia, Thailand, Vietnam, Indonesia, Philippines. A
            region I love living in. Open to relocation with sponsorship.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5 space-y-2">
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Building2" :size="16" class="text-accent" />
            EEA
          </h3>
          <p class="text-sm text-muted">
            European Economic Area — open to roles across the EU plus Norway,
            Iceland, Liechtenstein, with sponsorship. Strong overlap on AI
            product engineering and clean engineering culture.
          </p>
        </div>
      </div>
      <div class="glass-solid rounded-2xl p-6 space-y-3">
        <p class="text-foreground italic">
          "I love living in South East Asia — the climate, the people, food, and
          culture appeals to me a lot. I feel at home."
        </p>
        <p class="text-sm text-muted">
          Open to Senior / Staff / Lead Frontend, Full-Stack, Forward Deployed,
          or Applied AI roles. Notice at AppliedAI is one month, earliest
          realistic start is roughly five weeks after an offer. Sponsorship
          needed outside the GCC.
        </p>
      </div>
    </section>

    <!-- Side projects -->
    <section v-reveal class="mb-10" aria-labelledby="side-heading">
      <h2
        id="side-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Rocket" :size="20" class="text-accent" />
        Side projects
      </h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="glass-solid rounded-2xl p-5 space-y-2">
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="MousePointer" :size="16" class="text-accent" />
            Cursor for Product Managers
          </h3>
          <p class="text-sm text-muted">
            Built and pitched to Y Combinator's X26 batch. Reached the top 10%
            of applications. The pitch was about giving PMs an agentic-IDE-grade
            tool for product work — not the IDE-for-code shape, the
            IDE-for-decisions shape.
          </p>
        </div>
        <div class="glass-solid rounded-2xl p-5 space-y-2">
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="UtensilsCrossed" :size="16" class="text-accent" />
            Food-discovery app
          </h3>
          <p class="text-sm text-muted">
            A conversational app that recommends food places by taste profile
            rather than location-relevance. Idea came from a trip in Malaysia,
            where Google Maps consistently missed the genuinely good spots. MVP
            done, heading to the Google Play Store. Built with Claude Code.
          </p>
        </div>
      </div>
      <div class="mt-4 text-center">
        <UiButton variant="tertiary" to="/project">
          <Icon name="FolderOpen" :size="18" />
          Browse interactive demos
        </UiButton>
      </div>
    </section>

    <!-- Engineering Manager arc -->
    <section v-reveal class="mb-10" aria-labelledby="em-heading">
      <h2
        id="em-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="TrendingUp" :size="20" class="text-accent" />
        Where I'm going
      </h2>
      <div class="glass-solid rounded-2xl p-6 space-y-3">
        <p class="text-sm text-muted">
          I used to think reaching Engineering Manager would take fifteen-plus
          years. With Claude Code accelerating my upskilling and the way I've
          been willing to push out of comfort zones, the arc now looks more like
          three or four years — optimistic but grounded in observed personal
          velocity, not aspiration.
        </p>
        <p class="text-sm text-muted">
          The teams I want to join next are ones where the gap between "the
          model works" and "the user makes a different decision because of it"
          is the entire job.
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section v-reveal class="text-center" aria-label="Get in touch">
      <div class="glass-solid rounded-2xl p-8 space-y-4">
        <h2 class="text-h3 font-semibold text-foreground">Let's talk</h2>
        <p class="text-sm text-muted max-w-2xl mx-auto">
          Building something where AI surfaces have to actually work for real
          users? I'd love to hear about it.
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
          <UiButton variant="tertiary" to="/work">
            <Icon name="Briefcase" :size="18" />
            See case studies
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "About | Joel Stephen — Frontend Engineer at AppliedAI",
  description:
    "Joel Stephen is a Frontend Engineer at AppliedAI building AI workflow surfaces (Process Discovery, Opus Technical Canvas, Opus-CX). 5+ yrs across Vue, React, TypeScript, Python. Hot take: a frontend engineer is only good if they can think like a user. Open to Senior/Staff roles in SG/MY/TH/VN.",
});
</script>
