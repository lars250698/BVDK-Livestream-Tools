import { ElectronAPI } from '@electron-toolkit/preload'
import { ILivestreamToolsApi } from './index'

declare global {
  interface Window {
    livestreamToolsApi: ILivestreamToolsApi
  }
}
