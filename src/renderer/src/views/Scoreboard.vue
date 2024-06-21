<script setup lang="ts">
import ScoreboardOverall from '../components/ScoreboardOverall.vue'
import { useStore } from 'vuex'
import { onMounted, Ref, ref } from 'vue'
import { GraphQLClient } from 'graphql-request'
import ScoreboardSquat from '../components/ScoreboardSquat.vue'
import ScoreboardBench from '../components/ScoreboardBench.vue'
import ScoreboardDeadlift from '../components/ScoreboardDeadlift.vue'
import { ScoreboardType } from '../../../shared/models/state'
import { ensureClient } from '../util/state'
import TransparentWindowControls from '../components/TransparentWindowControls.vue'

const store = useStore()
const gqlClient: Ref<GraphQLClient | undefined> = ref(undefined)

onMounted(() => {
  ensureClient(5000, store).then((res) => {
    gqlClient.value = res
  })
})
</script>
<template>
  <div class="w-full h-full overflow-hidden bg-opacity-0">
    <TransparentWindowControls></TransparentWindowControls>
    <div class="flex mx-auto" style="width: 1000px; height: 600px">
      <div class="flex flex-col justify-start w-full h-full">
        <div class="flex w-full gradient h-16 my-2">
          <div class="flex flex-row w-full h-full justify-start items-center px-4">
            <div class="text-white text-4xl">Ergebnisse</div>
          </div>
        </div>
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
    </div>
  </div>
</template>

<style scoped></style>
