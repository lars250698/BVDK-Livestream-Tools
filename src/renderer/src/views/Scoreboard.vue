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
