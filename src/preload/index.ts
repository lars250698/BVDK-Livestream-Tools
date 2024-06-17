import { contextBridge, ipcRenderer } from 'electron'
import IpcRendererEvent = Electron.IpcRendererEvent

type LivestreamToolsApiFunction = (handler: LivestreamToolsApiHandler) => void
type LivestreamToolsApiHandler = () => Promise<unknown>
type TwoWayIpcBridgeErrorHandler = (e: IpcRendererEvent, channel: string, err: unknown) => void

interface ILivestreamToolsApi {
  onActiveAthleteRequest: LivestreamToolsApiFunction
  onOverallScoreboardRequest: LivestreamToolsApiFunction
  onSquatScoreboardRequest: LivestreamToolsApiFunction
  onBenchScoreboardRequest: LivestreamToolsApiFunction
  onDeadliftScoreboardRequest: LivestreamToolsApiFunction
  onCustomLowerThirdsRequest: LivestreamToolsApiFunction
  start: (port: number) => void
  stop: () => void
}

interface LivestreamToolsApiHandlerError {
  error: string
  detail: unknown
}

const livestreamToolsApi: ILivestreamToolsApi = {
  onActiveAthleteRequest(handler) {
    twoWayIpcBridge('active-athlete', handler, handleExpressApiHandlerError)
  },
  onCustomLowerThirdsRequest(handler) {
    twoWayIpcBridge('custom-lower-thirds', handler, handleExpressApiHandlerError)
  },
  onOverallScoreboardRequest(handler) {
    twoWayIpcBridge('scoreboard-overall', handler, handleExpressApiHandlerError)
  },
  onSquatScoreboardRequest(handler) {
    twoWayIpcBridge('scoreboard-squat', handler, handleExpressApiHandlerError)
  },
  onBenchScoreboardRequest(handler) {
    twoWayIpcBridge('scoreboard-bench', handler, handleExpressApiHandlerError)
  },
  onDeadliftScoreboardRequest(handler) {
    twoWayIpcBridge('scoreboard-deadlift', handler, handleExpressApiHandlerError)
  },
  start(port) {
    ipcRenderer.send('start-api', { port: port })
  },
  stop() {
    ipcRenderer.send('stop-api')
  }
}

function twoWayIpcBridge(
  channel: string,
  handler: LivestreamToolsApiHandler,
  errorHandler: TwoWayIpcBridgeErrorHandler
) {
  ipcRenderer.on(channel, (e: IpcRendererEvent) => {
    handler()
      .then((res) => e.sender.send(channel, res))
      .catch((err) => errorHandler(e, channel, err))
  })
}

function handleExpressApiHandlerError(e: IpcRendererEvent, channel: string, err: unknown) {
  e.sender.send(channel, {
    error: 'An error occurred while fetching the data',
    detail: err
  } as LivestreamToolsApiHandlerError)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('livestreamToolsApi', livestreamToolsApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.expressApi = livestreamToolsApi
}

export type { LivestreamToolsApiFunction, LivestreamToolsApiHandler, ILivestreamToolsApi }
