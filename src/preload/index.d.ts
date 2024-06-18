import { ElectronAPI } from '@electron-toolkit/preload'
import { ILivestreamToolsApi } from './index'
import { IStateIPC } from './state-ipc'
import { IUtil } from "./util";

declare global {
  interface Window {
    livestreamToolsApi: ILivestreamToolsApi
    stateIpc: IStateIPC
    util: IUtil
  }
}
