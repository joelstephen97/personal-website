<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow mt-20 mb-20 overflow-y-auto">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>
main {
  min-height: calc(100vh - 64px);
}
</style>