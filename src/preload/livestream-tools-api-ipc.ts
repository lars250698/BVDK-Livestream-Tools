import IpcRendererEvent = Electron.IpcRendererEvent
import { ipcRenderer } from 'electron'

export type LivestreamToolsApiFunction = (handler: LivestreamToolsApiHandler) => void
export type LivestreamToolsApiHandler = () => Promise<unknown>
export type TwoWayIpcBridgeErrorHandler = (
  e: IpcRendererEvent,
  channel: string,
  err: unknown
) => void

export interface ILivestreamToolsApi {
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

export const livestreamToolsApiIpc: ILivestreamToolsApi = {
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
