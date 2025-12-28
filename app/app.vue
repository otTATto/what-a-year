<script setup lang="ts">
const appConfig = useAppConfig();

useHead({
  title: appConfig.title,
  bodyAttrs: {
    class: 'font-sans text-neutral-700 bg-neutral-200'
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
