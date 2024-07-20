<!-- components/Footer.vue -->
<template>
    <footer class="relative bottom-0 left-0 right-0 bg-black text-white py-4">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center">
          <p class="text-sm">&copy; {{ currentYear }} Joel Stephen. All rights reserved.</p>
          <div class="flex space-x-4">
            <a href="https://www.linkedin.com/in/joelthomasstephen/" class="text-white hover:text-red-300">
              <UIcon name="i-mdi-linkedin" class="w-10 h-10" />
            </a>
            <a href="https://github.com/joelstephen97/" class="text-white hover:text-red-300">
              <UIcon name="i-mdi-github" class="w-10 h-10"/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const currentYear = new Date().getFullYear()
  </script>