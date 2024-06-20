import { ipcRenderer } from "electron";

export interface IUtil {
  getPlatform: () => string
  closeAllWindowsExceptMain: () => void
}

export const util: IUtil = {
  getPlatform() {
    return process.platform
  },
  closeAllWindowsExceptMain() {
    ipcRenderer.send('close-all-windows-except-main')
  }
}
