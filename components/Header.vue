<!-- components/Header.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 bg-white dark:bg-black shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center text-black dark:text-white hover:text-red-300 no-underline">
            <span class="font-bold text-xl">Joel Stephen</span>
          </NuxtLink>
        </div>
        <ul class="hidden md:flex items-center space-x-6 list-none m-0 p-0">
          <li>
            <NuxtLink to="/" class="text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-home" class="w-5 h-5 mr-1" />
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
              About
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/project" class="text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
              Projects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
              Contact
            </NuxtLink>
          </li>
          <li>
            <UButton @click="toggleColorMode" variant="outline" class="p-2 rounded-full bg-gray-100 dark:bg-black focus:outline-none hover:bg-white">
              <div v-if="colorMode.value === 'dark'" class="flex justify-center items-center font-bold text-black dark:text-white">
                <UIcon name="i-heroicons-sun" class="w-6 h-6 mr-2 text-yellow-300" />
                Light
              </div>
              <div v-else class="flex justify-center items-center font-bold text-black dark:text-white">
                <UIcon name="i-heroicons-moon" class="w-6 h-6 mr-2 text-gray-700" />
                Dark
              </div>
            </UButton>
          </li>
        </ul>
        <div class="md:hidden flex items-center space-x-4">
          <UButton @click="toggleColorMode" variant="solid" class="p-2 rounded-full bg-gray-100 dark:bg-black focus:outline-none">
            <div v-if="colorMode.value === 'dark'" class="flex justify-center items-center font-bold text-black dark:text-white">
                <UIcon name="i-heroicons-sun" class="w-6 h-6 mr-2 text-yellow-300" />
                Light
              </div>
              <div v-else class="flex justify-center items-center font-bold text-black dark:text-white">
                <UIcon name="i-heroicons-moon" class="w-6 h-6 mr-2 text-gray-700" />
                Dark
              </div>
          </UButton>
          <UButton @click="toggleMenu" variant="solid" class="cursor-pointer bg-transparent border-none text-black dark:text-white hover:text-red-300">
            <UIcon v-if="!isMenuOpen" name="i-heroicons-bars-3" class="w-8 h-8" />
            <UIcon v-else name="i-heroicons-x-mark" class="w-8 h-8" />
          </UButton>
        </div>
      </nav>
      <div v-if="isMenuOpen" class="md:hidden flex flex-col py-4">
        <NuxtLink to="/" class="py-2 text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-home" class="w-5 h-5 mr-1" />
          Home
        </NuxtLink>
        <NuxtLink to="/about" class="py-2 text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
          About
        </NuxtLink>
        <NuxtLink to="/project" class="py-2 text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
          Projects
        </NuxtLink>
        <NuxtLink to="/contact" class="py-2 text-black dark:text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
          Contact
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const colorMode = useColorMode()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>