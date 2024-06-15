<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { refreshCompetitionData } from '../vportal/state-actions'
import {
  getActiveAthlete,
  getBenchScoreboard,
  getDeadliftScoreboard,
  getOverallScoreboard,
  getSquatScoreboard
} from '../vportal/stream-data'
import { useToast } from 'vue-toastification'
import defaultTemplate from '../../../../examples/templates/lower-thirds.mustache?raw'

const store = useStore()
const router = useRouter()
const toast = useToast()
const state = computed(() => store.state.applicationState)
const gqlClient = store.state.gqlClient
const customLowerThirdsTemplateFile = ref(null)

let customLowerThirdsTemplate = defaultTemplate
let interval = null

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

async function handleFileUpload() {
  const reader = new FileReader()
  reader.onload = (e) => {
    customLowerThirdsTemplate = e.target.result
  }
  reader.readAsText(customLowerThirdsTemplateFile.value.files[0])
}

function openLowerThirds() {
  const r = router.resolve({ name: 'lower-thirds', params: { port: store.state.apiPort } })
  window.open(r.href, '_blank', 'width=1400,height=180,nodeIntegration=no')
}

function openCustomLowerThirds() {
  window.open(
    `http://localhost:${store.state.apiPort}/custom/lower-thirds`,
    '_blank',
    'width=1400,height=180,nodeIntegration=no'
  )
}

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

window.electron.ipcRenderer.on('custom-lower-thirds', (e) => {
  getActiveAthlete(gqlClient, state.value)
    .then((res) => {
      res.attempt1valid = res.attemptStatus1 === 'valid'
      res.attempt2valid = res.attemptStatus2 === 'valid'
      res.attempt3valid = res.attemptStatus3 === 'valid'
      res.attempt1invalid = res.attemptStatus1 === 'invalid'
      res.attempt2invalid = res.attemptStatus2 === 'invalid'
      res.attempt3invalid = res.attemptStatus3 === 'invalid'
      e.sender.send('custom-lower-thirds-response', {
        data: res,
        template: customLowerThirdsTemplate
      })
    })
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
  window.electron.ipcRenderer.send('settings-loaded', { port: store.state.apiPort })
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
                v-for="category in group.bodyWeightCategories"
                :key="category.id"
                class="border-b border-gray-600 border-opacity-20 last:border-none py-1 text-gray-300 font-extralight"
              >
                {{ category.name }} ({{ category.ageCategoryName }})
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col flex-shrink justify-start w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900"
      >
        <h2 class="text-xl text-white px-4">Athleteneinblendung</h2>

        <!-- Competition Stage Selection -->
        <div class="flex flex-row w-full justify-around">
          <div class="settings-card">
            <div class="flex-col w-1/2">
              <h3 class="pb-2">Plattform</h3>
              <select
                v-model="state.selectedCompetitionStageId"
                class="select"
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
          <div class="w-96 m-4"></div>
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
                    v-model="state.overallScoreboardSettings.selectedBodyWeightCategoryId"
                    class="select"
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
                <div class="mr-2">
                  <select v-model="state.overallScoreboardSettings.page" class="select">
                    <option v-for="page in overallAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
                <div class="w-14">
                  <input
                    class="input"
                    type="number"
                    v-model="state.overallScoreboardSettings.pageSize"
                    @change="refreshState"
                  />
                </div>
              </div>
            </div>

            <!-- Squat Scoreboard Settings -->
            <div class="settings-card">
              <h3>Squat</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    v-model="state.squatScoreboardSettings.selectedBodyWeightCategoryId"
                    class="select"
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
                <div class="mr-2">
                  <select
                    id="squatPage"
                    v-model="state.squatScoreboardSettings.page"
                    class="select"
                  >
                    <option v-for="page in squatAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
                <div class="w-14">
                  <input
                    class="input"
                    type="number"
                    v-model="state.squatScoreboardSettings.pageSize"
                    @change="refreshState"
                  />
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
                    v-model="state.benchPressScoreboardSettings.selectedBodyWeightCategoryId"
                    class="select"
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
                <div class="mr-2">
                  <select v-model="state.benchPressScoreboardSettings.page" class="select">
                    <option v-for="page in benchPressAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
                <div class="w-14">
                  <input
                    class="input"
                    type="number"
                    v-model="state.benchPressScoreboardSettings.pageSize"
                    @change="refreshState"
                  />
                </div>
              </div>
            </div>

            <!-- Squat Scoreboard Settings -->
            <div class="settings-card">
              <h3>Deadlift</h3>
              <div class="flex flex-row my-2">
                <div class="mr-2">
                  <select
                    v-model="state.deadliftScoreboardSettings.selectedBodyWeightCategoryId"
                    class="select"
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
                <div class="mr-2">
                  <select v-model="state.deadliftScoreboardSettings.page" class="select">
                    <option v-for="page in deadliftAvailablePages" :key="page" :value="page">
                      {{ page }}
                    </option>
                  </select>
                </div>
                <div class="w-14">
                  <input
                    class="input"
                    type="number"
                    v-model="state.deadliftScoreboardSettings.pageSize"
                    @change="refreshState"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-row justify-around py-4">
            <div class="flex flex-col w-96 py-4">
              <button type="button" class="btn-secondary" @click="openLowerThirds">
                Lower Thirds
              </button>
              <button type="button" class="btn-secondary">Scoreboard</button>
            </div>
            <div class="flex flex-col w-96 py-4">
              <div class="flex flex-row">
                <input
                  class="file-upload mb-2"
                  id="custom-lower-thirds-input"
                  type="file"
                  ref="customLowerThirdsTemplateFile"
                  @change="handleFileUpload"
                />
                <button type="button" class="btn-secondary" @click="openCustomLowerThirds">
                  Lower Thirds (Custom)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
}

.settings-card {
  @apply flex flex-col w-96 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md m-4 text-gray-300;
}

.select {
  @apply bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

.btn-secondary {
  @apply w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700;
}

.file-upload {
  @apply block py-2 me-2 mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400;
}
</style>
