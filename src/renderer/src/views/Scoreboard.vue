<script setup lang="ts">
import ScoreboardOverall from '../components/ScoreboardOverall.vue'
import { useStore } from 'vuex'
import { createClient } from '../vportal/client'
import { onMounted, Ref, ref } from 'vue'
import { GraphQLClient } from 'graphql-request'
import ScoreboardSquat from '../components/ScoreboardSquat.vue'
import ScoreboardBench from '../components/ScoreboardBench.vue'
import ScoreboardDeadlift from '../components/ScoreboardDeadlift.vue'
import { ScoreboardType } from '../../../shared/models/state'

const store = useStore()
const gqlClient: Ref<GraphQLClient | undefined> = ref(undefined)

function ensureClient(timeout: number): Promise<GraphQLClient> {
  const start = Date.now()

  function waitForClient(this: unknown, resolve, reject) {
    if (store.state.token) {
      resolve(createClient(store.state.appSettings.vportalUrl, store.state.token))
    } else if (Date.now() - start >= timeout) {
      reject(new Error('Timeout'))
    } else {
      setTimeout(
        waitForClient.bind(
          this as (res: (client: GraphQLClient) => void, reject) => void,
          resolve,
          reject
        ),
        30
      )
    }
  }

  return new Promise(waitForClient)
}

onMounted(() => {
  ensureClient(5000).then((res) => {
    gqlClient.value = res
  })
})
</script>

<template>
  <div
    class="w-full h-full overflow-hidden"
    :style="{ 'background-color': store.state.colorSettings.bgColor }"
  >
    <ScoreboardOverall
      v-if="store.state.applicationState.selectedScoreboardType === ScoreboardType.Overall"
      :gql-client="gqlClient"
      :state="store.state"
    />
    <ScoreboardSquat
      v-if="store.state.applicationState.selectedScoreboardType === ScoreboardType.Squat"
      :gql-client="gqlClient"
      :state="store.state"
    />
    <ScoreboardBench
      v-if="store.state.applicationState.selectedScoreboardType === ScoreboardType.Bench"
      :gql-client="gqlClient"
      :state="store.state"
    />
    <ScoreboardDeadlift
      v-if="store.state.applicationState.selectedScoreboardType === ScoreboardType.Deadlift"
      :gql-client="gqlClient"
      :state="store.state"
    />
  </div>
</template>

<style scoped></style>
