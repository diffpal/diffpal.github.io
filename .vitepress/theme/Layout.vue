<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ConsentAnalytics from './ConsentAnalytics.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <ConsentAnalytics />
    </template>
  </DefaultTheme.Layout>
</template>
