<!-- components/Header.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 bg-black shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center text-white hover:text-red-300 no-underline">
            <span class="font-bold text-xl">Joel Stephen</span>
          </NuxtLink>
        </div>
        <ul class="hidden md:flex space-x-6 list-none m-0 p-0">
          <li>
            <NuxtLink to="/" class="text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-home" class="w-5 h-5 mr-1" />
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
              About
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/project" class="text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
              Projects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="text-white font-bold no-underline hover:text-red-300 flex items-center">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
              Contact
            </NuxtLink>
          </li>
        </ul>
        <button @click="toggleMenu" class="md:hidden cursor-pointer bg-transparent border-none text-white hover:text-red-300">
          <UIcon v-if="!isMenuOpen" name="i-heroicons-bars-3" class="w-8 h-8" />
          <UIcon v-else name="i-heroicons-x-mark" class="w-8 h-8" />
        </button>
      </nav>
      <div v-if="isMenuOpen" class="md:hidden flex flex-col py-4">
        <NuxtLink to="/" class="py-2 text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-home" class="w-5 h-5 mr-1" />
          Home
        </NuxtLink>
        <NuxtLink to="/about" class="py-2 text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-user" class="w-5 h-5 mr-1" />
          About
        </NuxtLink>
        <NuxtLink to="/project" class="py-2 text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-1" />
          Projects
        </NuxtLink>
        <NuxtLink to="/contact" class="py-2 text-white font-bold no-underline hover:text-red-300 flex items-center">
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-1" />
          Contact
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>