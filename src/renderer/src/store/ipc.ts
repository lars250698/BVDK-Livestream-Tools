import { MutationPayload, Store } from 'vuex'
import { State } from '../../../shared/models/state'

export const ipcPlugin = (store: Store<State>) => {
  window.stateIpc.vuexConnect().then((res) => {
    store.commit('updateState', res)
  })

  window.stateIpc.stateUpdateHandler((stateJson: string) => {
    store.commit('updateState', JSON.parse(stateJson))
  })

  store.subscribe((_: MutationPayload, state: State) => {
    window.stateIpc.stateUpdate(JSON.stringify(state))
  })
}
