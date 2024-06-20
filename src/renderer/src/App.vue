<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const isMac = computed(() => {
  return window.util.getPlatform() === 'darwin'
})
const isMainWindow = ref(false)

onMounted(() => {
  window.util.isMainWindow().then((res) => (isMainWindow.value = res))
})
</script>

<template>
  <div class="w-screen h-screen">
    <div
      v-if="isMac && isMainWindow"
      class="fixed top-0 w-screen h-8 opacity-0 draggable z-50"
    ></div>
    <RouterView />
  </div>
</template>

<style></style>
