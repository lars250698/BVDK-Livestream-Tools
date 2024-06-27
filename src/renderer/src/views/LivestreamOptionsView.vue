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
import {
  CompetitionGroup,
  ScoreboardSettings,
  ScoreboardSettingsType,
  ScoreboardType
} from '../../../shared/models/state'
import { createClient } from '../vportal/client'
import ScoreboardSettingsCard from '../components/ScoreboardSettingsCard.vue'

const store = useStore()
const router = useRouter()
const toast = useToast()
const state = computed(() => store.state.applicationState)
const gqlClient = createClient(store.state.appSettings.vportalUrl, store.state.token)
const isLoading = ref<boolean>(false)

let customLowerThirdsTemplate = defaultTemplate
let interval: ReturnType<typeof setTimeout> | undefined = undefined

const activeGroups = computed(() =>
  state.value.availableGroups.filter((group: CompetitionGroup) =>
    state.value.activeGroupIds.includes(group.id)
  )
)

const isMac = computed(() => {
  return window.util.getPlatform() === 'darwin'
})

const individualScoreboardControl = ref(false)

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
  window.open(r.href, '_blank', fixedWindowFeatures(1500, 300))
}

function openCustomLowerThirds() {
  window.open(
    `http://localhost:${store.state.appSettings.apiPort}/custom/lower-thirds`,
    '_blank',
    'width=1400,height=180,nodeIntegration=no'
  )
}

function openScoreboard() {
  const r = router.resolve({
    name: `scoreboard`
  })
  window.open(r.href, '_blank', fixedWindowFeatures(1050, 630))
}

function fixedWindowFeatures(fixedWidth: number, fixedHeight: number) {
  return `width=${fixedWidth},minWidth=${fixedWidth},maxWidth=${fixedWidth},height=${fixedHeight},minHeight=${fixedHeight},maxHeight=${fixedHeight},nodeIntegration=no`
}

function logout() {
  router.push('/logout')
  window.credentials.clear()
  window.util.closeAllWindowsExceptMain()
}

function updateScoreboardSettings(
  scoreboardSettingsType: ScoreboardSettingsType,
  scoreboardSettings: ScoreboardSettings
) {
  store.commit('setScoreboardSettings', {
    scoreboardSettingsType: scoreboardSettingsType,
    scoreboardSettings: scoreboardSettings
  })
}

function updateScoreboardPageSize(
  scoreboardSettingsType: ScoreboardSettingsType,
  scoreboardSettings: ScoreboardSettings
) {
  isLoading.value = true
  updateScoreboardSettings(scoreboardSettingsType, scoreboardSettings)
  refreshCompetitionData(gqlClient, store.state.applicationState)
    .then((newState) => {
      store.commit('setApplicationState', newState)
      isLoading.value = false
    })
    .catch((err) => {
      toast.error('Error refreshing competition data')
      console.error(err)
    })
}

function updateSelectedScoreboardType() {
  store.commit('setSelectedScoreboardType', store.state.applicationState.selectedScoreboardType)
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
        :class="{ 'pt-10': isMac }"
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
        class="flex flex-col flex-shrink justify-start w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 pt-8"
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
          <ScoreboardSettingsCard
            :title="'Scoreboard'"
            :scoreboard-settings-type="ScoreboardSettingsType.All"
            @settings-update="
              (payload) =>
                updateScoreboardSettings(payload.scoreboardSettingsType, payload.scoreboardSettings)
            "
            @page-size-update="
              (payload) =>
                updateScoreboardPageSize(payload.scoreboardSettingsType, payload.scoreboardSettings)
            "
          />
        </div>

        <!-- Scoreboard Settings -->
        <div class="flex flex-row justify-between w-full">
          <label class="inline-flex items-center cursor-pointer">
            <span class="mx-3 text-sm font-medium text-gray-300"
              >Individual Scoreboard Control</span
            >
            <input
              v-model="individualScoreboardControl"
              type="checkbox"
              value=""
              class="sr-only peer"
            />
            <div
              class="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        <div class="flex flex-col">
          <div v-if="individualScoreboardControl" class="flex flex-col">
            <div class="w-full flex flex-row justify-around">
              <!-- Overall Scoreboard Settings -->
              <ScoreboardSettingsCard
                :title="'Overall'"
                :scoreboard-settings-type="ScoreboardSettingsType.Overall"
                @settings-update="
                  (payload) =>
                    updateScoreboardSettings(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
                @page-size-update="
                  (payload) =>
                    updateScoreboardPageSize(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
              />
              <ScoreboardSettingsCard
                :title="'Squat'"
                :scoreboard-settings-type="ScoreboardSettingsType.Squat"
                @settings-update="
                  (payload) =>
                    updateScoreboardSettings(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
                @page-size-update="
                  (payload) =>
                    updateScoreboardPageSize(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
              />
            </div>

            <div class="w-full flex flex-row justify-around">
              <ScoreboardSettingsCard
                :title="'Bench'"
                :scoreboard-settings-type="ScoreboardSettingsType.Bench"
                @settings-update="
                  (payload) =>
                    updateScoreboardSettings(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
                @page-size-update="
                  (payload) =>
                    updateScoreboardPageSize(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
              />
              <ScoreboardSettingsCard
                :title="'Deadlift'"
                :scoreboard-settings-type="ScoreboardSettingsType.Deadlift"
                @settings-update="
                  (payload) =>
                    updateScoreboardSettings(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
                @page-size-update="
                  (payload) =>
                    updateScoreboardPageSize(
                      payload.scoreboardSettingsType,
                      payload.scoreboardSettings
                    )
                "
              />
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
              <select
                v-model="state.selectedScoreboardType"
                class="select w-full text-white"
                @change="updateSelectedScoreboardType"
              >
                <option :value="ScoreboardType.Overall">Overall</option>
                <option :value="ScoreboardType.Squat">Squat</option>
                <option :value="ScoreboardType.Bench">Benchpress</option>
                <option :value="ScoreboardType.Deadlift">Deadlift</option>
              </select>
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
.settings-card {
  @apply flex flex-col w-96 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md m-4 text-gray-300;
}

.select {
  @apply bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

.btn-secondary {
  @apply w-full border focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700;
}

.file-upload {
  @apply block py-2 me-2 mb-2 w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400;
}

input[type='color'] {
  border-radius: 50%;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
}

input[type='color' i]::-webkit-color-swatch {
  border-radius: 50%;
}

input[type='color' i]::-moz-color-swatch {
  border-radius: 50%;
}
</style>
