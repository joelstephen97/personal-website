<template>
  <UButton
    :color="buttonColor"
    class="p-2 rounded-full drop-shadow-sm"
    @click="toggleColorMode"
  >
    <div class="flex justify-center items-center font-bold">
      <UIcon
        :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        class="w-6 h-6 mr-2"
        :class="colorMode.value === 'dark' ? 'text-white' : 'text-black'"
      />
      {{ colorMode.value === "dark" ? "Light" : "Dark" }}
    </div>
  </UButton>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const buttonColor = computed(() => (colorMode.value === "dark" ? "white" : "black"));

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

