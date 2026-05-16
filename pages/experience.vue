<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader id="experience-heading" title="Experience" eyebrow="Career">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-solid"
        :title="`${totalYears}+ years of professional experience`"
      >
        <Icon name="Briefcase" :size="18" class="text-accent" />
        <span class="text-sm font-medium text-foreground"
          >{{ totalYears }}+ yrs</span
        >
      </div>
    </PageHeader>

    <!-- Timeline -->
    <section class="space-y-6" aria-label="Career timeline">
      <div
        v-for="(job, i) in jobs"
        :key="i"
        v-reveal="{ delay: i * 120 }"
        class="relative pl-8 pb-8 border-l-2 border-border last:pb-0"
      >
        <!-- Dot -->
        <div
          :class="[
            'absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent ring-4 ring-background',
            i === 0 && 'animate-pulse',
          ]"
        />

        <!-- Card -->
        <div
          class="glass-solid rounded-2xl p-6 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200"
        >
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20 shrink-0 mt-0.5"
              >
                <Icon :name="job.icon" :size="18" class="text-white" />
              </div>
              <div>
                <h3 class="text-h3 font-semibold text-accent">
                  {{ job.title }}
                </h3>
                <p class="text-foreground font-medium">
                  {{ job.company }}
                </p>
              </div>
            </div>
            <div class="text-sm text-muted md:text-right">
              <p class="flex items-center gap-1">
                <Icon name="MapPin" :size="14" /> {{ job.location }}
              </p>
              <p class="flex items-center gap-1">
                <Icon name="Calendar" :size="14" /> {{ job.duration }}
              </p>
            </div>
          </div>

          <ul class="space-y-2 mb-4">
            <li
              v-for="task in job.tasks"
              :key="task"
              class="flex items-start gap-2 text-sm text-muted"
            >
              <Icon
                name="Check"
                :size="16"
                class="text-accent mt-0.5 flex-shrink-0"
              />
              <span>{{ task }}</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium',
                skillColor(skill),
              ]"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "Experience | Joel Stephen - Software Engineer",
  description:
    "Career timeline: Frontend Engineer at AppliedAI, Senior Software Engineer at Otani, Software Engineer at RIOT. 5+ years in Vue, React, Python, FastAPI.",
});

const totalYears = 5;

const frontendSkills = new Set(["Vue.js", "React", "Nuxt.js", "TypeScript", "AI Workflows"]);
const backendSkills = new Set(["FastAPI", "Python", "Django", "Node.js", "SQLAlchemy", "REST APIs", "LDAP"]);
const dataSkills = new Set(["GraphQL", "OpenCV", "YOLO", "DynamoDB"]);

function skillColor(skill: string): string {
  if (frontendSkills.has(skill)) return "bg-accent/10 text-accent";
  if (backendSkills.has(skill)) return "bg-blue-500/10 text-blue-500 dark:text-blue-400";
  if (dataSkills.has(skill)) return "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400";
  return "bg-amber-500/10 text-amber-500 dark:text-amber-400";
}

const jobs = [
  {
    title: "Frontend Engineer",
    company: "AppliedAI",
    icon: "Cpu",
    location: "Abu Dhabi, UAE",
    duration: "Jun 2025 - Present",
    tasks: [
      "Building production frontend on Opus, AppliedAI's AI workflow platform for enterprise customers in finance, telecom, healthcare, and AI/cloud infrastructure.",
      "Brought Process Discovery to life — a real-time multiplayer canvas (React + Yjs/CRDT) where customers co-edit deep descriptions of their processes that feed Opus's workflow generation.",
      "Spearheaded the Opus Technical Canvas, a fork of n8n rewritten as Opus's node-graph surface with a custom expressions engine (Vue + TypeScript).",
      "Shipped on Opus-CX (React + Zustand), the enterprise-facing surface wrapping Opus's capabilities into a clean, usable product.",
      "Mentored junior and mid-level engineers; partnered with CX, presales, and solutions teams; ran code review, sprint planning, and performance instrumentation.",
    ],
    skills: ["Vue.js", "React", "TypeScript", "Yjs", "AI Workflows"],
  },
  {
    title: "Senior Software Engineer",
    company: "Otani Trading FZCO",
    icon: "Flower2",
    location: "Dubai, UAE",
    duration: "Jul 2024 - Feb 2025",
    tasks: [
      "Led project direction and frontend delivery on a B2C PWA mobile app for the international flower trade.",
      "Owned UI/UX design directly in Figma with shadcn components — validated workflows visually before backend investment.",
      "Owned data-layer technology choices (URQL/GraphQL on the client, Strawberry + Python on the backend) and the full DevOps stack — hosting, CI/CD, monitoring.",
      "Trained YOLO v5 to detect flower lifecycle and physical defects; used OpenCV for object detection and tracking.",
      "Mentored junior and mid-level engineers.",
    ],
    skills: ["Nuxt.js", "Vue.js", "GraphQL", "OpenCV", "YOLO", "Figma"],
  },
  {
    title: "Software Engineer",
    company: "Otani Trading FZCO",
    icon: "Flower2",
    location: "Dubai, UAE",
    duration: "Sep 2023 - Jul 2024",
    tasks: [
      "Embedded with vendor, merchant, and admin user groups on Project FMI, a large-scale B2B platform; shipped 7 major features driven by direct user requirements.",
      "Built backend APIs in Python: FastAPI + Pydantic + Peewee for REST, and GraphQL with Strawberry + DynamoDB on Project Valit.",
      "Built UI prototypes in VueJS + RadixVue + shadcn so workflows were testable end-to-end before going to users.",
      "Wrote end-to-end tests with Pytest and Cypress to keep critical operational workflows safe.",
      "Pair-programmed in agile sprints with continuous user feedback; mentored new joiners and handled merge/versioning across the team.",
    ],
    skills: [
      "Vue.js",
      "FastAPI",
      "Python",
      "GraphQL",
      "DynamoDB",
      "Pytest",
      "Cypress",
    ],
  },
  {
    title: "Junior Software Engineer",
    company: "RIOT by Preowned Collective Portal FZ LLC",
    icon: "ShoppingBag",
    location: "Dubai, UAE",
    duration: "Sep 2019 - Feb 2023",
    tasks: [
      "Led implementation of cross-functional features on a customer-facing platform.",
      "Integrated 3 payment gateways and multiple third-party services.",
      "Migrated data from a legacy platform to a new Node.js / React.js website.",
      "Automated operational tasks using Python scripting against internal and external APIs.",
      "Set up Google Ads and Analytics; collaborated with cross-functional teams on requirements and prototyping (JIRA, Figma).",
    ],
    skills: ["Node.js", "React", "Python", "JIRA", "Figma"],
  },
  {
    title: "SDE Intern",
    company: "Alucor Limited",
    icon: "Building",
    location: "Dubai, UAE",
    duration: "Jan 2019 - Jul 2019",
    tasks: [
      "Designed and shipped a Django web application to replace a critical Excel-based workflow.",
      "Built REST APIs, integrated LDAP authentication, and improved usability with event-driven front-end behaviour.",
      "Used SQLAlchemy for the data layer and followed PEP8 / clean-code documentation.",
    ],
    skills: ["Django", "Python", "SQLAlchemy", "REST APIs", "LDAP"],
  },
];
</script>
