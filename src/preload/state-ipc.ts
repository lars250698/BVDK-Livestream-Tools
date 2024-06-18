import { ipcRenderer } from 'electron'
import IpcRendererEvent = Electron.IpcRendererEvent

export interface IStateIPC {
  vuexConnect: () => Promise<string>
  stateUpdate: (stateJson: string) => void
  stateUpdateHandler: (handler: (stateJson: string) => void) => void
}

export const stateIpc: IStateIPC = {
  async vuexConnect() {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('vuex-connect')
        .then((res) => {
          resolve(JSON.parse(res))
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  stateUpdate(stateJson: string) {
    ipcRenderer.send('state-update', stateJson)
  },
  stateUpdateHandler(handler: (stateJson: string) => void) {
    ipcRenderer.on('state-update-renderer', (_: IpcRendererEvent, data: string) => {
      handler(data)
    })
  }
}
