<template>
  <PageContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row pb-10">
      <div class="container space-y-10 xl:space-y-16">
        <div class="grid gap-4 md:grid-cols-2 md:gap-16">
          <div>
            <h1
              class="lg:leading-tighter pb-2 text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl"
            >
              <TypingEffect :strings="['Joel Stephen']" :loop="false" />
            </h1>
            <h2
              class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl pb-2"
            >
              <TypingEffect
                :strings="[
                  'FULL STACK ENGINEER',
                  'UI-UX DESIGNER',
                  'QA AND TESTING',
                  'AI AND ML',
                ]"
              />
            </h2>
            <TerminalWindow>
              Experienced in building scalable and performant web
              applications using modern technologies. Passionate about
              creating intuitive UI and solving complex problems both in
              backend and frontend.
            </TerminalWindow>

            <TechStackSelector :stacks="techStacks" :on-tech-click="scrollToSkill" />
          </div>
          <!-- Timeline Section -->
          <SkillTimeline :timeline-data="timelineData" />
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { nextTick } from "vue";

const techStacks = [
  {
    name: "Front-end Stack",
    items: [
      { name: "Vue.js" },
      { name: "React" },
      { name: "Angular" },
      { name: "JavaScript" },
      { name: "jQuery" },
    ],
  },
  {
    name: "Back-end Stack",
    items: [{ name: "Python" }, { name: "PHP" }, { name: "Java" }],
  },
  {
    name: "Tools",
    items: [
      { name: "Linux" },
      { name: "Postman" },
      { name: "REST API" },
      { name: "GraphQL" },
      { name: "Docker" },
      { name: "Cypress" },
    ],
  },
];

const timelineData = [
  { skill: "Java", start: "2015-08", end: "2019-08" },
  { skill: "Python", start: "2019-01", end: "2025-12" },
  { skill: "jQuery", start: "2019-09", end: "2023-05" },
  { skill: "PHP", start: "2019-09", end: "2023-01" },
  { skill: "JavaScript", start: "2019-09", end: "2024-07" },
  { skill: "React", start: "2021-02", end: "2023-01" },
  { skill: "Angular", start: "2023-03", end: "2023-05" },
  { skill: "Vue.js", start: "2023-08", end: "2025-12" },
  { skill: "Linux", start: "2019-08", end: "2024-07" },
  { skill: "Postman", start: "2021-08", end: "2024-07" },
  { skill: "REST API", start: "2019-08", end: "2024-07" },
  { skill: "GraphQL", start: "2023-08", end: "2024-07" },
  { skill: "Docker", start: "2023-08", end: "2024-07" },
  { skill: "Cypress", start: "2023-08", end: "2024-07" },
];

const scrollToSkill = (skill: string) => {
  nextTick(() => {
    const element = document.querySelector(
      `.timeline-item[data-skill="${skill}"]`,
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight", "animate-pulse");
      setTimeout(() => element.classList.remove("highlight"), 1000);
    }
  });
};
</script>
