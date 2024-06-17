import { contextBridge, ipcRenderer } from 'electron'

const api = {}

const livestreamToolsApi = {
  activeAthleteRequestHandler(handler) {
    twoWayIpcBridge('active-athlete', handler, handleExpressApiHandlerError)
  },
  customLowerThirdsHandler(handler) {
    twoWayIpcBridge('custom-lower-thirds', handler, handleExpressApiHandlerError)
  },
  overallScoreboardHandler(handler) {
    twoWayIpcBridge('scoreboard-overall', handler, handleExpressApiHandlerError)
  },
  squatScoreboardHandler(handler) {
    twoWayIpcBridge('scoreboard-squat', handler, handleExpressApiHandlerError)
  },
  benchScoreboardHandler(handler) {
    twoWayIpcBridge('scoreboard-bench', handler, handleExpressApiHandlerError)
  },
  deadliftScoreboardHandler(handler) {
    twoWayIpcBridge('scoreboard-deadlift', handler, handleExpressApiHandlerError)
  },
  start(port) {
    ipcRenderer.send('start-api', { port: port })
  },
  stop() {
    ipcRenderer.send('stop-api')
  }
}

function twoWayIpcBridge(channel, handler, errorHandler) {
  ipcRenderer.on(channel, (e) => {
    handler()
      .then((res) => e.sender.send(channel, res))
      .catch((err) => errorHandler(e, channel, err))
  })
}

function handleExpressApiHandlerError(e, channel, err) {
  e.sender.send(channel, {
    error: 'An error occurred while fetching the data',
    detail: err
  })
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('livestreamToolsApi', livestreamToolsApi)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
  window.expressApi = livestreamToolsApi
}
