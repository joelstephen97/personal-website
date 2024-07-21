<template>
  <UContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row">
      <div class="container space-y-10 xl:space-y-16">
        <div class="grid gap-4 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="lg:leading-tighter pb-2 text-5xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Joel Stephen
            </h1>
            <h2 class="text-5xl font-bold tracking-tighter sm:text-5xl md:text-5xl pb-2">Full-Stack Engineer</h2>
            <p class="max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
              Experienced in building scalable and performant web applications using modern technologies. Passionate
              about creating intuitive user experiences and solving complex problems.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4 flex-col space-x-4">
      <UButton color="black" class="text-xl uppercase italic" variant="solid" size="lg">Front-end Stack</UButton>
      <UButton color="black" class="text-xl uppercase italic" variant="solid" size="lg">Back-end Stack</UButton>
      <UButton color="black" class="text-xl uppercase italic" variant="solid" size="lg">Tools</UButton>
    </div>
  </UContainer>
</template>