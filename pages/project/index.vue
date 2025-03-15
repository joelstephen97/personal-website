<template>
  <UContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row pb-10">
      <div
        class="flex flex-col flex-wrap sm:flex-row gap-4 justify-center items-center"
      >
        <div class="w-full sm:w-1/3">
          <UCard :ui="{ background: 'bg-white dark:bg-black' }">
            <template #header>
              <div
                class="flex flex-row flex-nowrap items-center justify-center text-center uppercase font-bold text-xl"
              >
                Css Experiments
              </div>
            </template>

            My Css Doodles will go here

            <template #footer>
              <NuxtLink to="/project/templates">
                <UButton class="uppercase" color="black">
                  Check it out
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-arrow-right-20-solid"
                      class="w-5 h-5"
                    />
                  </template>
                </UButton>
              </NuxtLink>
            </template>
          </UCard>
        </div>
        <div class="w-full sm:w-1/3">
          <UCard :ui="{ background: 'bg-white dark:bg-black' }">
            <template #header>
              <div
                class="flex flex-row flex-nowrap items-center justify-center text-center uppercase font-bold text-xl"
              >
                Rainbow 6 Randomizer
              </div>
            </template>
            Testing some frontend randomizer code
            <template #footer>
              <NuxtLink to="/project/rainbow-6-randomizer">
                <UButton class="uppercase" color="black">
                  Check it out
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-arrow-right-20-solid"
                      class="w-5 h-5"
                    />
                  </template>
                </UButton>
              </NuxtLink>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
