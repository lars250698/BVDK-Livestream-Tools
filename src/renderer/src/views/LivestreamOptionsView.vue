<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { createClient } from '../vportal/client'
import { refreshCompetitionData } from '../vportal/state-actions'
import {
  getActiveAthlete,
  getOverallScoreboard,
  getSquatScoreboard,
  getBenchScoreboard,
  getDeadliftScoreboard
} from '../vportal/stream-data'
import { useToast } from 'vue-toastification'

const store = useStore()
const router = useRouter()
const toast = useToast()
const state = computed(() => store.state.applicationState)
const gqlClient = createClient(store.state.token)

let interval = 0

const activeGroups = computed(() =>
  state.value.availableGroups.filter((group) => state.value.activeGroupIds.includes(group.id))
)
const overallAvailablePages = computed(() =>
  Array.from({ length: state.value.overallScoreboardSettings.availablePages }, (_, i) => i + 1)
)
const squatAvailablePages = computed(() =>
  Array.from({ length: state.value.squatScoreboardSettings.availablePages }, (_, i) => i + 1)
)
const benchPressAvailablePages = computed(() =>
  Array.from({ length: state.value.benchPressScoreboardSettings.availablePages }, (_, i) => i + 1)
)
const deadliftAvailablePages = computed(() =>
  Array.from({ length: state.value.deadliftScoreboardSettings.availablePages }, (_, i) => i + 1)
)

async function refreshState() {
  refreshCompetitionData(gqlClient, state.value)
    .then((newState) => {
      store.commit('setApplicationState', newState)
    })
    .catch((err) => {
      toast.error('Error refreshing competition data')
      console.error(err)
    })
}

window.electron.ipcRenderer.on('active-athlete', (e) => {
  getActiveAthlete(gqlClient, state.value)
    .then((res) => e.sender.send('active-athlete-response', res))
    .catch((err) =>
      e.sender.send('active-athlete-response', {
        error: 'An error occurred while fetching the data',
        detail: err
      })
    )
})

window.electron.ipcRenderer.on('scoreboard-overall', (e) => {
  getOverallScoreboard(gqlClient, state.value)
    .then((res) => e.sender.send('scoreboard-overall-response', res))
    .catch((err) =>
      e.sender.send('scoreboard-overall-response', {
        error: 'An error occurred while fetching the data',
        detail: err
      })
    )
})

window.electron.ipcRenderer.on('scoreboard-squat', (e) => {
  getSquatScoreboard(gqlClient, state.value)
    .then((res) => e.sender.send('scoreboard-squat-response', res))
    .catch((err) =>
      e.sender.send('scoreboard-squat-response', {
        error: 'An error occurred while fetching the data',
        detail: err
      })
    )
})

window.electron.ipcRenderer.on('scoreboard-bench', (e) => {
  getBenchScoreboard(gqlClient, state.value)
    .then((res) => e.sender.send('scoreboard-bench-response', res))
    .catch((err) =>
      e.sender.send('scoreboard-bench-response', {
        error: 'An error occurred while fetching the data',
        detail: err
      })
    )
})

window.electron.ipcRenderer.on('scoreboard-deadlift', (e) => {
  getDeadliftScoreboard(gqlClient, state.value)
    .then((res) => e.sender.send('scoreboard-deadlift-response', res))
    .catch((err) =>
      e.sender.send('scoreboard-deadlift-response', {
        error: 'An error occurred while fetching the data',
        detail: err
      })
    )
})

onMounted(() => {
  interval = setInterval(refreshState, 10000)
  window.electron.ipcRenderer.send('settings-loaded')
})

onUnmounted(() => {
  clearInterval(interval)
  window.electron.ipcRenderer.send('settings-unloaded')
})

onBeforeMount(() => {
  if (!store.getters.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex h-14 bg-blue-950 shadow-md p-2 px-4">
      <div class="text-white text-3xl">BVDK Livestream Tools</div>
    </div>
    <div class="flex flex-row h-full w-full max-h-screen">
      <div
        class="flex w-80 flex-col h-full p-4 bg-blue-950 text-white overflow-x-hidden overflow-y-auto"
      >
        <h2 class="text-white">Gewichtsklassen</h2>
        <div class="py-4 pr-4">
          <div v-for="group in activeGroups" :key="group.id">
            <h3>{{ group.name }}</h3>
            <ul>
              <li
                class="border-b border-gray-600 border-opacity-20 last:border-none py-1 text-gray-300 font-extralight"
                v-for="category in group.bodyWeightCategories"
                :key="category.id"
              >
                {{ category.name }} ({{ category.ageCategoryName }})
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900">
        <h2 class="text-xl text-white px-4">Athleteneinblendung</h2>

        <!-- Competition Stage Selection -->
        <div class="flex flex-row w-full">
          <div class="settings-card">
            <div class="flex-col w-1/2">
              <h3 class="pb-2">Plattform</h3>
              <select
                class="select"
                v-model="state.selectedCompetitionStageId"
                @change="submitSelection()"
              >
                <option
                  v-for="stage in state.availableCompetitionStages"
                  :key="stage.id"
                  :value="stage.id"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="w-1/2 m-4"></div>
        </div>

        <!-- Scoreboard Settings -->
        <h2 class="text-xl text-white px-4">Scoreboard</h2>
        <div class="flex flex-col">
          <div class="w-full flex flex-row justify-around">
            <!-- Overall Scoreboard Settings -->
            <div class="settings-card">
              <h3>Overall</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    class="select"
                    v-model="state.overallScoreboardSettings.selectedBodyWeightCategoryId"
                  >
                    <template v-for="group in state.availableGroups">
                      <option
                        v-for="category in group.bodyWeightCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }} ({{ category.ageCategoryName }})
                      </option>
                    </template>
                  </select>
                </div>
                <div class="">
                  <select class="select" v-model="state.overallScoreboardSettings.page">
                    <option v-for="page in overallAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Squat Scoreboard Settings -->
            <div class="settings-card">
              <h3>Squat</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    class="select"
                    v-model="state.squatScoreboardSettings.selectedBodyWeightCategoryId"
                    @change="submitSelection()"
                  >
                    <template v-for="group in state.availableGroups">
                      <option
                        v-for="category in group.bodyWeightCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }} ({{ category.ageCategoryName }})
                      </option>
                    </template>
                  </select>
                </div>
                <div class="">
                  <select
                    class="select"
                    id="squatPage"
                    v-model="state.squatScoreboardSettings.page"
                    @change="submitSelection()"
                  >
                    <option v-for="page in squatAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-row justify-around">
            <!-- Overall Scoreboard Settings -->
            <div class="settings-card">
              <h3>Bench Press</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    class="select"
                    v-model="state.benchPressScoreboardSettings.selectedBodyWeightCategoryId"
                  >
                    <template v-for="group in state.availableGroups">
                      <option
                        v-for="category in group.bodyWeightCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }} ({{ category.ageCategoryName }})
                      </option>
                    </template>
                  </select>
                </div>
                <div class="">
                  <select class="select" v-model="state.benchPressScoreboardSettings.page">
                    <option v-for="page in benchPressAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Squat Scoreboard Settings -->
            <div class="settings-card">
              <h3>Deadlift</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    class="select"
                    v-model="state.deadliftScoreboardSettings.selectedBodyWeightCategoryId"
                  >
                    <template v-for="group in state.availableGroups">
                      <option
                        v-for="category in group.bodyWeightCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }} ({{ category.ageCategoryName }})
                      </option>
                    </template>
                  </select>
                </div>
                <div class="">
                  <select class="select" v-model="state.deadliftScoreboardSettings.page">
                    <option v-for="page in deadliftAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-card {
  @apply flex flex-col w-1/2 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md m-4 text-gray-300;
}

.select {
  @apply bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}
</style>
