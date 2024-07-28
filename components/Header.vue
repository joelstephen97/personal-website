<!-- components/Header.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 bg-white dark:bg-black shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <NuxtLink to="/"  class="flex items-center text-black dark:text-white no-underline">
            <UAvatar src="https://avatars.githubusercontent.com/u/40371897" alt="Avatar"></UAvatar>
            <span class="pl-4 font-bold text-xl">Joel Stephen</span>
          </NuxtLink>
        </div>
        <ul class="hidden md:flex items-center space-x-8 list-none m-0 p-0">
          <li>
            <NuxtLink
              to="/"
              :class="{
                'text-red-600 font-extrabold': route.path === '/',
                'text-black dark:text-white font-bold': route.path !== '/'
              }"
              class="no-underline hover:font-extrabold flex items-center"
            >
              <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
              About Me
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/experience"
              :class="{
                'text-red-600 font-extrabold': route.path === '/experience',
                'text-black dark:text-white font-bold': route.path !== '/experience'
              }"
              class="no-underline hover:font-extrabold flex items-center"
            >
              <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
              Experience
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              :class="{
                'text-red-600 font-extrabold': route.path === '/contact',
                'text-black dark:text-white font-bold': route.path !== '/contact'
              }"
              class="no-underline hover:font-extrabold flex items-center"
            >
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
              Contact
            </NuxtLink>
          </li>
          <li>
            <UButton @click="toggleColorMode" variant="outline" class="p-3 rounded-full bg-gray-100 dark:bg-black focus:outline-none hover:bg-white">
              <div v-if="colorMode.value === 'dark'" class="flex justify-center items-center font-bold text-black dark:text-white hover:font-extrabold">
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
            <div v-if="colorMode.value === 'dark'" class="flex justify-center items-center font-bold text-black dark:text-white border-black">
                <UIcon name="i-heroicons-sun" class="w-6 h-6 mr-2 text-yellow-500" />
                Light
              </div>
              <div v-else class="flex justify-center items-center font-bold text-black dark:text-white">
                <UIcon name="i-heroicons-moon" class="w-6 h-6 mr-2 text-gray-700" />
                Dark
              </div>
          </UButton>
          <UButton @click="toggleMenu" variant="solid" class="cursor-pointer bg-transparent border-none text-black dark:text-white hover:animate-wiggle">
            <UIcon v-if="!isMenuOpen" name="i-heroicons-bars-3" class="w-8 h-8" />
            <UIcon v-else name="i-heroicons-x-mark" class="w-8 h-8" />
          </UButton>
        </div>
      </nav>
      <div v-if="isMenuOpen" class="md:hidden flex flex-col py-4">
        <NuxtLink
          to="/"
          :class="{
            'text-red-500 font-extrabold': route.path === '/',
            'text-black dark:text-white font-bold': route.path !== '/'
          }"
          class="py-2 no-underline hover:animate-wiggle flex items-center"
        >
          <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
          About
        </NuxtLink>
        <NuxtLink
          to="/project"
          :class="{
            'text-red-500 font-extrabold': route.path === '/project',
            'text-black dark:text-white font-bold': route.path !== '/project'
          }"
          class="py-2 no-underline hover:animate-wiggle flex items-center"
        >
          <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
          Projects
        </NuxtLink>
        <NuxtLink
          to="/contact"
          :class="{
            'text-red-500 font-extrabold': route.path === '/contact',
            'text-black dark:text-white font-bold': route.path !== '/contact'
          }"
          class="py-2 no-underline hover:animate-wiggle flex items-center"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
          Contact
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const colorMode = useColorMode()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
