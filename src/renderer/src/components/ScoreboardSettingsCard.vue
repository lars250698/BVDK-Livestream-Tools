<script setup lang="ts">
import { computed, ComputedRef, PropType } from 'vue'
import { ScoreboardSettings, ScoreboardSettingsType } from '../../../shared/models/state'
import { useStore } from 'vuex'

const props = defineProps({
  title: { type: String, required: true },
  scoreboardSettingsType: { type: String as PropType<ScoreboardSettingsType>, required: true }
})

const emit = defineEmits<{
  (
    e: 'settings-update',
    payload: {
      scoreboardSettingsType: ScoreboardSettingsType
      scoreboardSettings: ScoreboardSettings
    }
  )
  (
    e: 'page-size-update',
    payload: {
      scoreboardSettingsType: ScoreboardSettingsType
      scoreboardSettings: ScoreboardSettings
    }
  )
}>()

const settings: ComputedRef<ScoreboardSettings> = computed(() => {
  switch (props.scoreboardSettingsType) {
    case ScoreboardSettingsType.Squat:
      return store.state.applicationState.squatScoreboardSettings
    case ScoreboardSettingsType.Bench:
      return store.state.applicationState.benchPressScoreboardSettings
    case ScoreboardSettingsType.Deadlift:
      return store.state.applicationState.deadliftScoreboardSettings
    case ScoreboardSettingsType.Overall:
    case ScoreboardSettingsType.All:
      return store.state.applicationState.overallScoreboardSettings
    default:
      return store.state.applicationState.overallScoreboardSettings
  }
})

const store = useStore()

function settingsUpdate() {
  emit('settings-update', {
    scoreboardSettingsType: props.scoreboardSettingsType,
    scoreboardSettings: settings.value
  })
}

function pageSizeUpdate() {
  emit('page-size-update', {
    scoreboardSettingsType: props.scoreboardSettingsType,
    scoreboardSettings: settings.value
  })
}
</script>

<template>
  <div class="settings-card">
    <h3>{{ props.title }}</h3>
    <div class="flex flex-row my-2">
      <div class="mr-2">
        <select
          v-model="settings.selectedBodyWeightCategoryId"
          class="select"
          @change="settingsUpdate"
        >
          <template v-for="group in store.state.applicationState.availableGroups">
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
      <div class="mr-2 w-14">
        <select v-model="settings.page" class="select" @change="settingsUpdate">
          <option v-for="page in settings.availablePages" :key="page" :value="page">
            {{ page }}
          </option>
        </select>
      </div>
      <div class="w-14">
        <input v-model="settings.pageSize" class="input" type="number" @change="pageSizeUpdate" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500;
}

.settings-card {
  @apply flex flex-col w-96 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md m-4 text-gray-300;
}

.select {
  @apply bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
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
