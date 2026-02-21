<template>
  <div class="min-h-screen bg-background transition-colors duration-300">
    <!-- Subtle gradient background -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/[0.03] to-transparent rounded-full blur-3xl"
      />
    </div>

    <AppHeader />
    <main class="pt-16 pb-20 min-h-screen">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
