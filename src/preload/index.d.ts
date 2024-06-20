import { ElectronAPI } from '@electron-toolkit/preload'
import { ILivestreamToolsApi } from './index'
import { IStateIPC } from './state-ipc'
import { IUtil } from './util'
import { ICredentials } from './credentials'

declare global {
  interface Window {
    livestreamToolsApi: ILivestreamToolsApi
    stateIpc: IStateIPC
    util: IUtil
    credentials: ICredentials
  }
}
