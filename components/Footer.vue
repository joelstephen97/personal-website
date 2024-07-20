<!-- components/Footer.vue -->
<template>
    <footer class="relative bottom-0 left-0 right-0 bg-black text-white py-4">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center">
          <p class="text-sm">&copy; {{ currentYear }} Joel Stephen. All rights reserved.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-white hover:text-red-300">
              <UIcon name="i-mdi-twitter" />
            </a>
            <a href="#" class="text-white hover:text-red-300">
              <UIcon name="i-mdi-linkedin" />
            </a>
            <a href="#" class="text-white hover:text-red-300">
              <UIcon name="i-mdi-github" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const currentYear = new Date().getFullYear()
  </script>