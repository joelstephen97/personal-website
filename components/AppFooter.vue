<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-black text-white py-4 w-full">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center">
        <p class="text-md">
          &copy; {{ currentYear }} Joel Stephen. All rights reserved.
        </p>
        <div class="flex md:space-x-8 space-x-1">
          <a
            href="https://www.linkedin.com/in/joelthomasstephen/"
            class="text-white hover:animate-wiggle"
          >
            <UIcon name="i-mdi-linkedin" class="w-8 h-8" />
          </a>
          <a
            href="https://github.com/joelstephen97/"
            class="text-white hover:animate-wiggle"
          >
            <UIcon name="i-mdi-github" class="w-8 h-8" />
          </a>
          <a
            href="https://www.youtube.com/@he11b1azer6"
            class="text-white hover:animate-wiggle"
          >
            <UIcon name="i-mdi-youtube" class="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
