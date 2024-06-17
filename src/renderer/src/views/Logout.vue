<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Loading from 'vue-loading-overlay'

const store = useStore()
const router = useRouter()

onMounted(() => {
  store.commit('logout')
  router.push('/login')
})
</script>

<template>
  <div class="w-full h-full bg-sky-950">
    <loading :active="true" :can-cancel="false" :is-full-page="true" />
  </div>
</template>

<style scoped></style>
