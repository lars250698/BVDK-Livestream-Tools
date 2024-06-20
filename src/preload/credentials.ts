import { Credentials } from "../shared/models/credentials";
import { ipcRenderer } from "electron";

export interface ICredentials {
  available: () => Promise<boolean>
  storageAvailable: () => Promise<boolean>
  write: (credentials: Credentials) => void
  load: () => Promise<Credentials>
  clear: () => void
}

export const credentials: ICredentials = {
  available() {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('credentials-available')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  storageAvailable() {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('credentials-storage-available')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  write(credentials: Credentials) {
    ipcRenderer.send('save-credentials', credentials)
  },
  load() {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('load-credentials')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  clear() {
    ipcRenderer.send('clear-credentials')
  }
}
