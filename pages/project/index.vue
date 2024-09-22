<template>
    <UContainer>
        <div class="w-full pt-12 md:pt-24 lg:pt-32 flex-row pb-10">
            <div class="flex flex-col flex-wrap sm:flex-row gap-4 justify-center items-center">
                <div class="w-full sm:w-1/3">
                    <UCard>
                        <template #header>
                            Css Experiements
                        </template>

                            My Css Doodles will go here

                        <template #footer>
                            <NuxtLink to="/project/templates">
                                <UButton class="uppercase">Check it out</UButton>            
                            </NuxtLink>
                        </template>
                    </UCard>
                </div>
            </div>
        </div>
    </UContainer>
</template>