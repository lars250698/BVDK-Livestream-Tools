<script setup lang="ts">
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
import Loading from 'vue-loading-overlay'
import { ActiveAthleteCustomTemplate } from '../models/stream-data'
import { AttemptStatus } from '../models/vportal'
import { CompetitionGroup } from '../models/state'

const store = useStore()
const router = useRouter()
const toast = useToast()
const state = computed(() => store.state.applicationState)
const gqlClient = store.state.gqlClient
const isLoading = ref<boolean>(false)

let customLowerThirdsTemplate = defaultTemplate
let interval: ReturnType<typeof setTimeout> | undefined = undefined

const activeGroups = computed(() =>
  state.value.availableGroups.filter((group: CompetitionGroup) =>
    state.value.activeGroupIds.includes(group.id)
  )
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

async function handleFileUpload($event: Event) {
  const reader = new FileReader()
  reader.onload = (e) => {
    customLowerThirdsTemplate = e.target?.result ?? ''
  }
  const target = $event.target as HTMLInputElement
  if (target?.files) {
    reader.readAsText(target.files[0])
  }
}

function openLowerThirds() {
  const r = router.resolve({
    name: 'lower-thirds',
    params: { port: store.state.appSettings.apiPort }
  })
  const fixedWidth = 1350
  const fixedHeight = 180
  window.open(r.href, '_blank', fixedWindowFeatures(fixedWidth, fixedHeight))
}

function openCustomLowerThirds() {
  window.open(
    `http://localhost:${store.state.appSettings.apiPort}/custom/lower-thirds`,
    '_blank',
    'width=1400,height=180,nodeIntegration=no'
  )
}

function openScoreboard(category: string) {
  const r = router.resolve({
    name: `scoreboard-${category}`,
    params: { port: store.state.appSettings.apiPort }
  })
  window.open(r.href, '_blank', fixedWindowFeatures(1050, 600))
}

function fixedWindowFeatures(fixedWidth: number, fixedHeight: number) {
  return `width=${fixedWidth},minWidth=${fixedWidth},maxWidth=${fixedWidth},height=${fixedHeight},minHeight=${fixedHeight},maxHeight=${fixedHeight},nodeIntegration=no`
}

function refreshStateWithLoadingIndicator() {
  isLoading.value = true
  refreshCompetitionData(gqlClient, state.value)
    .then((newState) => {
      store.commit('setApplicationState', newState)
      isLoading.value = false
    })
    .catch((err) => {
      toast.error('Error refreshing competition data')
      console.error(err)
    })
}

function logout() {
  router.push('/logout')
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

window.livestreamToolsApi.onCustomLowerThirdsRequest(
  () =>
    new Promise((resolve, reject) => {
      getActiveAthlete(gqlClient, state.value)
        .then((res) => {
          const data: ActiveAthleteCustomTemplate = {
            ...res,
            attempt1valid: res.attemptStatus1 === AttemptStatus.Valid,
            attempt2valid: res.attemptStatus2 === AttemptStatus.Valid,
            attempt3valid: res.attemptStatus3 === AttemptStatus.Valid,
            attempt1invalid: res.attemptStatus1 === AttemptStatus.Invalid,
            attempt2invalid: res.attemptStatus2 === AttemptStatus.Invalid,
            attempt3invalid: res.attemptStatus3 === AttemptStatus.Invalid
          }

          resolve({
            data: data,
            template: customLowerThirdsTemplate
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
)
window.livestreamToolsApi.onActiveAthleteRequest(() => getActiveAthlete(gqlClient, state.value))
window.livestreamToolsApi.onOverallScoreboardRequest(() =>
  getOverallScoreboard(gqlClient, state.value)
)
window.livestreamToolsApi.onSquatScoreboardRequest(() => getSquatScoreboard(gqlClient, state.value))
window.livestreamToolsApi.onBenchScoreboardRequest(() => getBenchScoreboard(gqlClient, state.value))
window.livestreamToolsApi.onDeadliftScoreboardRequest(() =>
  getDeadliftScoreboard(gqlClient, state.value)
)

onMounted(() => {
  interval = setInterval(refreshState, 10000)
  window.livestreamToolsApi.start(store.state.appSettings.apiPort)
})

onUnmounted(() => {
  clearInterval(interval)
  window.livestreamToolsApi.stop()
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
        class="flex w-80 flex-col h-full p-4 bg-sky-950 text-white overflow-x-hidden overflow-y-auto"
      >
        <div class="flex flex-col w-full h-full justify-between">
          <div class="flex flex-col">
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
        </div>
        <div class="flex">
          <button type="button" class="btn-secondary" @click="logout">Log out</button>
        </div>
      </div>

      <div
        class="flex flex-col flex-shrink justify-start w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900"
      >
        <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="false" />
        <h2 class="text-xl text-white px-4">Athleteneinblendung</h2>

        <!-- Competition Stage Selection -->
        <div class="flex flex-row w-full justify-around">
          <div class="settings-card">
            <div class="flex-col w-1/2">
              <h3 class="pb-2">Plattform</h3>
              <select v-model="state.selectedCompetitionStageId" class="select">
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
                    v-model="state.overallScoreboardSettings.pageSize"
                    class="input"
                    type="number"
                    @change="refreshStateWithLoadingIndicator"
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
                    v-model="state.squatScoreboardSettings.pageSize"
                    class="input"
                    type="number"
                    @change="refreshStateWithLoadingIndicator"
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
                    v-model="state.benchPressScoreboardSettings.pageSize"
                    class="input"
                    type="number"
                    @change="refreshStateWithLoadingIndicator"
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
                    v-model="state.deadliftScoreboardSettings.pageSize"
                    class="input"
                    type="number"
                    @change="refreshStateWithLoadingIndicator"
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
              <button type="button" class="btn-secondary" @click="openScoreboard('overall')">
                Scoreboard
              </button>
              <button type="button" class="btn-secondary" @click="openScoreboard('squat')">
                Scoreboard Squat
              </button>
              <button type="button" class="btn-secondary" @click="openScoreboard('bench')">
                Scoreboard Bench
              </button>
              <button type="button" class="btn-secondary" @click="openScoreboard('deadlift')">
                Scoreboard Deadlift
              </button>
            </div>
            <div class="flex flex-col w-96 py-4">
              <div class="flex flex-row">
                <input
                  id="custom-lower-thirds-input"
                  class="file-upload mb-2"
                  type="file"
                  @change="handleFileUpload($event)"
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
