<script setup lang="ts">
import { State } from '../../../../shared/models/state'
import { GraphQLClient } from 'graphql-request'
import { onBeforeMount, onUnmounted, PropType, ref } from 'vue'
import { OverallScoreboardEntry } from '../../models/stream-data'
import { getOverallScoreboard } from '../../vportal/stream-data'

const props = defineProps({
  state: { type: Object as PropType<State>, required: true },
  gqlClient: { type: GraphQLClient, required: true }
})

const athletes = ref<Array<OverallScoreboardEntry>>(
  Array(14).fill({
    name: '',
    lot: '',
    bodyWeight: '',
    total: '',
    prognosis: '',
    bestSquat: '',
    bestBench: '',
    bestDeadlift: ''
  })
)

let interval: ReturnType<typeof setTimeout> | undefined = undefined

function getAthletes() {
  if (props.state.applicationState) {
    getOverallScoreboard(props.gqlClient, props.state.applicationState).then((res) => {
      athletes.value = res
    })
  }
}

onBeforeMount(() => {
  getAthletes()
  interval = setInterval(getAthletes, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="flex flex-col w-full gradient h-8">
    <div class="flex flex-row w-full h-full px-2 justify-between text-white">
      <div class="flex flex-row justify-between w-5/6">
        <div class="flex flex-row justify-start w-3/5">
          <div class="mx-1 flex items-center flex-row justify-center w-6">#</div>
          <div class="mx-1 flex items-center flex-row justify-center w-16">Gew.</div>
          <div class="mx-1 flex items-center flex-row justify-center w-10">Lot</div>
          <div class="mx-1 flex items-center flex-row justify-start w-96">Name</div>
        </div>
        <div class="flex flex-row justify-end w-2/5">
          <div class="mx-2 flex flex-row items-center justify-center w-16">KB</div>
          <div class="mx-2 flex flex-row items-center justify-center w-16">BD</div>
          <div class="mx-2 flex flex-row items-center justify-center w-16">KH</div>
        </div>
      </div>
      <div class="flex flex-row justify-end w-36 items-center">
        <div class="mr-2 flex flex-row justify-center w-16">Total</div>
        <div class="ml-2 flex flex-row justify-center w-16">Prog.</div>
      </div>
    </div>
  </div>

  <div
    v-for="(athlete, idx) in athletes"
    :key="idx"
    class="flex flex-col w-full h-8 even:bg-gray-700 odd:bg-gray-500 opacity-80"
  >
    <div class="flex flex-row w-full h-full px-2 justify-between text-white items-center">
      <div class="flex flex-row justify-between w-5/6">
        <div class="flex flex-row justify-start w-3/5">
          <div v-if="athlete.name" class="mx-1 flex flex-row justify-center w-6">
            {{ idx + 1 }}
          </div>
          <div v-else class="mx-1 flex flex-row justify-center w-6"></div>
          <div class="mx-1 flex flex-row justify-center w-16">{{ athlete.bodyWeight }}</div>
          <div class="mx-1 flex flex-row justify-center w-10">{{ athlete.lot }}</div>
          <div class="mx-1 flex flex-row justify-start w-96">{{ athlete.name }}</div>
        </div>
        <div class="flex flex-row justify-end w-2/5">
          <div class="mx-2 flex flex-row justify-center w-16">{{ athlete.bestSquat }}</div>
          <div class="mx-2 flex flex-row justify-center w-16">{{ athlete.bestBench }}</div>
          <div class="mx-2 flex flex-row justify-center w-16">{{ athlete.bestDeadlift }}</div>
        </div>
      </div>
      <div class="flex flex-row justify-end w-36 items-center">
        <div class="mr-2 flex flex-row justify-center w-16">{{ athlete.total }}</div>
        <div class="ml-2 flex flex-row justify-center w-16">{{ athlete.prognosis }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
