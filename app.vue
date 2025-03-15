<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <SpeedInsights />
  </div>
</template>

<script setup lang="js">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>
