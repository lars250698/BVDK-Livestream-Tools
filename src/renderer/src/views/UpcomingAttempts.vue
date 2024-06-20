<script setup lang="ts">
import { useStore } from 'vuex'
import { onMounted, ref, Ref } from 'vue'
import { GraphQLClient } from 'graphql-request'
import { AthleteAttemptData } from '../models/stream-data'
import { ensureClient } from '../util/state'

const store = useStore()
const gqlClient: Ref<GraphQLClient | undefined> = ref(undefined)

const attempts = ref<Array<AthleteAttemptData>>(
  Array(store.state.applicationState.upcomingAttemptAmount).fill({
    name: '',
    attempt: '',
    weight: ''
  } as AthleteAttemptData)
)

onMounted(() => {
  ensureClient(5000, store).then((res) => {
    gqlClient.value = res
  })
})
</script>

<template>
  <div
    class="flex flex-col justify-center align-middle w-full h-full content-center items-center"
    :style="{ 'background-color': store.state.colorSettings.bgColor }"
  >
    <div class="flex flex-row justify-start w-full h-full px-6" style="width: 800px; height: 600px">
      <div class="flex flex-col w-full h-full justify-around">
        <div class="flex gradient h-20 w-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
