import { GraphQLClient } from 'graphql-request'
import { createClient } from '../vportal/client'
import { State } from '../../../shared/models/state'
import { Store } from 'vuex'

export function ensureClient(timeout: number, store: Store<State>): Promise<GraphQLClient> {
  const start = Date.now()

  function waitForClient(this: unknown, resolve, reject) {
    if (store.state.token) {
      resolve(createClient(store.state.appSettings.vportalUrl, store.state.token))
    } else if (Date.now() - start >= timeout) {
      reject(new Error('Timeout'))
    } else {
      setTimeout(
        waitForClient.bind(
          this as (res: (client: GraphQLClient) => void, reject) => void,
          resolve,
          reject
        ),
        30
      )
    }
  }

  return new Promise(waitForClient)
}
