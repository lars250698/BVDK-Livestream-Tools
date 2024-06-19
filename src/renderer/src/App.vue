<script setup lang="ts">
import { computed } from 'vue'

const isMac = computed(() => {
  return window.util.getPlatform() === 'darwin'
})
</script>

<template>
  <div v-if="isMac" class="fixed top-0 w-screen h-6 opacity-0 draggable"></div>
  <div class="w-screen h-screen">
    <RouterView />
  </div>
</template>

<style>
.draggable {
  -webkit-app-region: drag;
}
</style>
