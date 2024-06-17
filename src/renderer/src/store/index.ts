import { createStore } from 'vuex'
import { ApplicationState, AppSettings, State } from '../models/state'
import { GraphQLClient } from 'graphql-request'

const defaultSettings: AppSettings = {
  vportalUrl: 'https://bvdk.vportal-online.de',
  loginProxyUrl:
    'https://818wrx6ocb.execute-api.eu-central-1.amazonaws.com/default/vportal-auth-proxy',
  apiPort: 8000
}

const state: State = {
  token: undefined,
  gqlClient: undefined,
  applicationState: undefined,
  appSettings: defaultSettings
}

const getters = {
  isLoggedIn: (state: State) => {
    return state.token != null
  }
}

const actions = {}

const mutations = {
  setApplicationState(state: State, applicationState: ApplicationState) {
    state.applicationState = applicationState
  },
  setToken(state: State, token: string) {
    state.token = token
  },
  setGqlClient(state: State, client: GraphQLClient) {
    state.gqlClient = client
  },
  resetAppSettings(state: State) {
    state.appSettings = defaultSettings
  },
  logout(state: State) {
    state.token = undefined
    state.gqlClient = undefined
    state.applicationState = undefined
  }
}
export default createStore({
  state: state,
  getters,
  actions,
  mutations
})

export { defaultSettings }
