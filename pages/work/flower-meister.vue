<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader
      id="flower-heading"
      title="Flower Meister — Otani Trading"
      eyebrow="Case study · Senior Software Engineer"
      subtitle="A B2C-ish PWA that turned grower photographs into proof of flower-variant quality, using YOLO v5 + OpenCV to detect lifecycle, leaves falling, and physical defects. The kind of computer vision that unlocks real-world purchase decisions."
    >
      <div class="flex flex-wrap items-center justify-center gap-2 mt-2">
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-solid text-xs"
        >
          <Icon name="Calendar" :size="14" class="text-accent" />
          Jul 2024 — Feb 2025
        </span>
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-solid text-xs"
        >
          <Icon name="MapPin" :size="14" class="text-accent" />
          Dubai, UAE
        </span>
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
          Led project direction and frontend delivery on a B2C-ish PWA for the
          international flower trade. Buyers had no objective way to verify that
          a grower's flower variant was actually the one worth buying. The app
          let users photograph a flower in a vase, then used image analysis to
          surface the flower's lifecycle and defect state.
        </p>
        <p class="text-sm text-muted">
          Growers could prove variant quality with images-as-evidence, which
          enabled bulk purchase deals worth millions, shipped internationally in
          crates. I owned the stack from frontend through data layer to DevOps —
          hosting, CI/CD, and monitoring were all calls I made.
        </p>
      </div>
    </section>

    <!-- The problem -->
    <section v-reveal class="mb-10" aria-labelledby="problem-heading">
      <h2
        id="problem-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="HelpCircle" :size="20" class="text-accent" />
        The business problem
      </h2>
      <div class="glass-solid rounded-2xl p-6 space-y-3">
        <p class="text-sm text-muted">
          International flower buyers commit to bulk purchases on the strength
          of a grower's claim about variant quality. The problem: the claim was
          almost always subjective — a grower's word, plus a photo or two. There
          was no consistent, objective way to evaluate whether the flower in the
          photo would actually arrive in the crate looking the way it should.
        </p>
        <p class="text-sm text-muted">
          The right product wasn't another marketplace. It was a verification
          loop. Take a photo. See where the flower is in its lifecycle. See
          whether the leaves are falling. See the cracks. Make a decision on
          evidence.
        </p>
      </div>
    </section>

    <!-- The solution -->
    <section v-reveal class="mb-10" aria-labelledby="solution-heading">
      <h2
        id="solution-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="CheckCircle2" :size="20" class="text-accent" />
        What I shipped
      </h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div
          v-reveal="{ delay: 80 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Flower2" :size="16" class="text-accent" />
            Lifecycle detection
          </h3>
          <p class="text-sm text-muted">
            Trained YOLO v5 to detect flowers dying, leaves falling, and flower
            / vase health. The primary signal the buyer cared about.
          </p>
        </div>
        <div
          v-reveal="{ delay: 120 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="AlertTriangle" :size="16" class="text-accent" />
            Defect detection
          </h3>
          <p class="text-sm text-muted">
            Trained additional models for cracks and other physical defects, so
            the buyer could see structural issues, not just bloom state.
          </p>
        </div>
        <div
          v-reveal="{ delay: 160 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Smartphone" :size="16" class="text-accent" />
            PWA frontend
          </h3>
          <p class="text-sm text-muted">
            Mobile-first PWA in Vue 3 with shadcn / RadixVue components. UI/UX
            driven directly in Figma so workflows could be validated visually
            before backend investment.
          </p>
        </div>
        <div
          v-reveal="{ delay: 200 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Server" :size="16" class="text-accent" />
            Data layer
          </h3>
          <p class="text-sm text-muted">
            URQL/GraphQL on the client, Strawberry + Python on the backend.
            Picked Strawberry because its docs felt like the cleanest fit at the
            time — small calls like this end up mattering as the project grows.
          </p>
        </div>
        <div
          v-reveal="{ delay: 240 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Cog" :size="16" class="text-accent" />
            DevOps ownership
          </h3>
          <p class="text-sm text-muted">
            Chose the hosting, set up the CI/CD pipeline, and stood up the
            monitoring and observability layer. All three were my calls and I
            ran them in production.
          </p>
        </div>
        <div
          v-reveal="{ delay: 280 }"
          class="glass-solid rounded-2xl p-5 space-y-2"
        >
          <h3 class="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Users" :size="16" class="text-accent" />
            Team
          </h3>
          <p class="text-sm text-muted">
            Trained and mentored junior and mid-level engineers so the team
            could continue shipping and operating the product independently.
          </p>
        </div>
      </div>
    </section>

    <!-- Outcome -->
    <section v-reveal class="mb-10" aria-labelledby="outcome-heading">
      <h2
        id="outcome-heading"
        class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
      >
        <Icon name="Trophy" :size="20" class="text-accent" />
        Outcome
      </h2>
      <div class="glass-solid rounded-2xl p-6">
        <p class="text-sm text-muted">
          Growers could prove variant quality with images-as-evidence, which
          enabled bulk purchase deals worth millions, shipped internationally in
          crates. The product turned what used to be a trust gamble into
          something closer to a verifiable claim.
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section v-reveal class="text-center" aria-label="Next">
      <div class="glass-solid rounded-2xl p-8 space-y-4">
        <h2 class="text-h3 font-semibold text-foreground">More like this?</h2>
        <p class="text-sm text-muted max-w-2xl mx-auto">
          Computer-vision-meets-real-decisions is the kind of work I keep
          gravitating to. If your team is shipping a product where the model
          output actually changes what someone buys, builds, or decides — I want
          to hear about it.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <UiButton variant="primary" href="/joel-stephen-resume.pdf">
            <Icon name="Download" :size="18" />
            Download Resume
          </UiButton>
          <UiButton variant="secondary" to="/work/opus">
            <Icon name="ArrowRight" :size="18" />
            Current role at AppliedAI
          </UiButton>
          <UiButton variant="tertiary" to="/contact">
            <Icon name="Mail" :size="18" />
            Get in touch
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
  title: "Flower Meister at Otani Trading — Case Study | Joel Stephen",
  description:
    "Led frontend and DevOps on a B2C PWA for the international flower trade. Trained YOLO v5 + OpenCV to detect flower lifecycle and defects — turned a subjective grower claim into image-based evidence that unlocked bulk purchase deals worth millions.",
  breadcrumbTitle: "Flower Meister — Otani Trading",
});

const config = useRuntimeConfig();
const SITE_URL =
  (config.public as { siteUrl?: string }).siteUrl ??
  "https://joelstephen.vercel.app";
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Flower Meister at Otani Trading — Case Study",
  description:
    "How I shipped a PWA for the international flower trade with YOLO v5 + OpenCV computer vision for lifecycle and defect detection.",
  author: { "@type": "Person", name: "Joel Stephen", url: SITE_URL },
  datePublished: "2026-05-16",
  image: `${SITE_URL}/og-image.png`,
  url: `${SITE_URL}/work/flower-meister`,
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
      name: "Flower Meister — Otani Trading",
      item: `${SITE_URL}/work/flower-meister`,
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
