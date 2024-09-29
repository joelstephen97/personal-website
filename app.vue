<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <Analytics />
    <UNotifications />
  </div>
</template>


<script setup lang="js">
import { Analytics } from '@vercel/analytics/react';
</script>