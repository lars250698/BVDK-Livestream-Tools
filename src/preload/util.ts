import { ipcRenderer } from 'electron'

export interface IUtil {
  getPlatform: () => string
  closeAllWindowsExceptMain: () => void
  isMainWindow: () => Promise<boolean>
}

export const util: IUtil = {
  getPlatform() {
    return process.platform
  },
  closeAllWindowsExceptMain() {
    ipcRenderer.send('close-all-windows-except-main')
  },
  isMainWindow(): Promise<boolean> {
    return ipcRenderer.invoke('is-main-window')
  }
}
