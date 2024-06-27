<script setup lang="ts">
import 'vue-loading-overlay/dist/css/index.css'
import LoginForm from '../components/login/LoginForm.vue'
import LoginSettingsForm from '../components/login/LoginSettingsForm.vue'
</script>

<template>
  <div class="flex w-full h-full bg-sky-950 text-white">
    <div class="w-full h-full flex flex-row justify-around">
      <login-form></login-form>
      <div class="border-r border-gray-600"></div>
      <login-settings-form></login-settings-form>
    </div>
  </div>
</template>

<style scoped></style>
