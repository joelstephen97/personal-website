<template>
  <div class="layout-wrapper">
    <div class="flex flex-col min-h-screen">
      <AppHeader />
      <main class="flex-grow mt-20 mb-20 overflow-y-auto">
        <slot />
      </main>
      <AppFooter />
    </div>
    <Analytics />
  </div>
</template>

<script>
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
main {
  min-height: calc(100vh - 64px);
}
</style>
