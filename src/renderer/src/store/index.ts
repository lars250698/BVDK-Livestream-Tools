import { createStore } from 'vuex'
import {
  ApplicationState,
  AppSettings,
  defaultAppSettings,
  defaultColorSettings,
  ScoreboardSettings,
  ScoreboardType,
  State
} from '../../../shared/models/state'
import { ipcPlugin } from './ipc'

const state: State = {
  token: undefined,
  applicationState: undefined,
  appSettings: defaultAppSettings,
  colorSettings: defaultColorSettings
}

const getters = {
  isLoggedIn: (state: State) => {
    return state.token != null
  }
}

const actions = {}

const mutations = {
  updateState(state: State, newState: State) {
    state.token = newState.token
    state.applicationState = newState.applicationState
    state.appSettings = newState.appSettings
    state.colorSettings = newState.colorSettings
  },
  setApplicationState(state: State, applicationState: ApplicationState) {
    state.applicationState = applicationState
  },
  setToken(state: State, token: string) {
    state.token = token
  },
  setBgColor(state: State, color: string) {
    state.colorSettings.bgColor = color
  },
  setScoreboardSettings(
    state: State,
    params: { scoreboardSettings: ScoreboardSettings; scoreboardType: string }
  ) {
    if (!state.applicationState) {
      console.error('Trying to set Scoreboard settings while no state has been initialized')
      return
    }
    switch (params.scoreboardType) {
      case 'overall':
        state.applicationState.overallScoreboardSettings = params.scoreboardSettings
        break
      case 'squat':
        state.applicationState.squatScoreboardSettings = params.scoreboardSettings
        break
      case 'bench':
        state.applicationState.benchPressScoreboardSettings = params.scoreboardSettings
        break
      case 'deadlift':
        state.applicationState.deadliftScoreboardSettings = params.scoreboardSettings
        break
    }
  },
  setSelectedScoreboardType(state: State, scoreboardType: ScoreboardType) {
    if (!state.applicationState) {
      return
    }
    state.applicationState.selectedScoreboardType = scoreboardType
  },
  resetAppSettings(state: State) {
    state.appSettings = defaultAppSettings
  },
  resetColorSettings(state: State) {
    state.colorSettings = defaultColorSettings
  },
  updateAppSettings(state: State, appSettings: AppSettings) {
    state.appSettings = appSettings
  },
  logout(state: State) {
    state.token = undefined
    state.applicationState = undefined
  }
}
export default createStore({
  state: state,
  getters,
  actions,
  mutations,
  plugins: [ipcPlugin]
})

export { defaultAppSettings }
