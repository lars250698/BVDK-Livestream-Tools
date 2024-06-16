import { createStore } from 'vuex'

let state = {
  token: null,
  gqlClient: null,
  applicationState: null,
  vportalUrl: 'https://bvdk.vportal-online.de',
  loginProxyUrl: 'https://818wrx6ocb.execute-api.eu-central-1.amazonaws.com/default/vportal-auth-proxy',
  apiPort: 8000
}

const getters = {
  isLoggedIn: (state) => {
    return state.token != null
  }
}

const actions = {}

const mutations = {
  setApplicationState(state, applicationState) {
    state.applicationState = applicationState
  },
  setToken(state, token) {
    state.token = token
  },
  setGqlClient(state, client) {
    state.gqlClient = client
  }
}
export default createStore({
  state,
  getters,
  actions,
  mutations
})
