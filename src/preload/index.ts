import { contextBridge } from 'electron'
import { stateIpc } from './state-ipc'
import { livestreamToolsApiIpc } from './livestream-tools-api-ipc'
import { util } from './util'
import { credentials } from './credentials'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('livestreamToolsApi', livestreamToolsApiIpc)
    contextBridge.exposeInMainWorld('stateIpc', stateIpc)
    contextBridge.exposeInMainWorld('util', util)
    contextBridge.exposeInMainWorld('credentials', credentials)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.livestreamToolsApi = livestreamToolsApiIpc
  // @ts-ignore (define in dts)
  window.stateIpc = stateIpc
  // @ts-ignore (define in dts)
  window.util = util
  // @ts-ignore (define in dts)
  window.credentials = credentials
}
