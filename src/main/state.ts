import { join } from 'path'
import { app } from 'electron'
import * as fs from 'fs'
import { defaultAppSettings, defaultColorSettings, State } from '../shared/models/state'

export type StateHolderCallbackFunction = (state: State) => void

export class StateHolder {
  private appSettingsPath = join(app.getPath('userData'), 'app-settings.json')
  private colorSettingsPath = join(app.getPath('userData'), 'color-settings.json')

  private state: State
  private callbacks: StateHolderCallbackFunction[] = []

  constructor() {
    const appSettings = this.readFileOrDefault(this.appSettingsPath, defaultAppSettings)
    const colorSettings = this.readFileOrDefault(this.colorSettingsPath, defaultColorSettings)
    this.state = {
      token: undefined,
      applicationState: undefined,
      appSettings: appSettings,
      colorSettings: colorSettings
    }
  }

  registerCallback(func: StateHolderCallbackFunction) {
    this.callbacks.push(func)
  }

  setState(state: State) {
    const stateChanged = !shallowEqual(this.state, state)
    const appSettingsChanged = !shallowEqual(this.state.appSettings, state.appSettings)
    const colorSettingsChanged = !shallowEqual(this.state.colorSettings, state.colorSettings)
    this.state = state
    if (stateChanged) {
      this.callbacks.forEach((callback) => callback(this.state))
    }
    if (appSettingsChanged || colorSettingsChanged) {
      this.saveToDisk()
    }
  }

  getState(): State {
    return this.state
  }

  saveToDisk() {
    console.log('Saving...')
    this.writeFile(this.appSettingsPath, this.state.appSettings)
    this.writeFile(this.colorSettingsPath, this.state.colorSettings)
  }

  private writeFile<T>(path: string, val: T) {
    fs.writeFile(path, JSON.stringify(val), (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  private readFileOrDefault<T>(path: string, defaultVal: T): T {
    try {
      const data = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' })
      return JSON.parse(data) as T
    } catch (err) {
      console.log("Can't read settings file, creating new default settings...")
    }
    return defaultVal
  }
}

function shallowEqual(object1: object, object2: object) {
  return JSON.stringify(object1) === JSON.stringify(object2)
}
