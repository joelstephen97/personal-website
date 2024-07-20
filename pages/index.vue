<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Joel Stephen | Full Stack Engineer</h1>
      </template>
      <div class="flex flex-wrap gap-4 mb-4">
        <UTooltip text="PHP">
          <UIcon name="i-logos-php" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="Python">
          <UIcon name="i-logos-python" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="JavaScript">
          <UIcon name="i-logos-javascript" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="HTML5">
          <UIcon name="i-logos-html-5" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="CSS3">
          <UIcon name="i-logos-css-3" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="React">
          <UIcon name="i-logos-react" class="w-10 h-10" />
        </UTooltip>
        <UTooltip text="Vue.js">
          <UIcon name="i-logos-vue" class="w-10 h-10" />
        </UTooltip>
      </div>
      <p class="mb-4">
        Skilled in maintaining live websites, implementing UI changes, and integrating APIs.
        Proficient in MySQL, data analysis, and e-commerce website management.
      </p>
      <p class="mb-4">
        Seeking opportunities to leverage skills in a dynamic tech environment.
      </p>
      <UButton class="font-bold bg-red-500 p-2 dark:bg-red-500 text-white dark:text-white hover:bg-red-700" to="/CV.pdf" download>Download CV</UButton>
    </UCard>
  </UContainer>
</template>