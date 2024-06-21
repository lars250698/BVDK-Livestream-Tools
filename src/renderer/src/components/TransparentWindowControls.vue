<script setup lang="ts">
function close() {
  window.close()
}
</script>

<template>
  <div class="flex flex-row justify-center w-full h-8 mb-12">
    <div class="flex flex-row justify-between h-full w-20 items-center rounded-md bg-gray-900 px-2">
      <button class="w-8 h-8 text-white hover:opacity-80" @click="close">
        <svg
          class="text-white white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          stroke="#ffffff"
        >
          <line x1="16" y1="16" x2="48" y2="48" stroke-width="3" />
          <line x1="48" y1="16" x2="16" y2="48" stroke-width="3" />
        </svg>
      </button>
      <div class="flex w-8 h-full draggable z-50 cursor-move justify-end items-center text-white">
        <svg
          style="fill: currentColor"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="5" r="1.5" />
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="19" cy="5" r="1.5" />
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
          <circle cx="5" cy="19" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
          <circle cx="19" cy="19" r="1.5" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  -webkit-app-region: no-drag;
}
</style>
