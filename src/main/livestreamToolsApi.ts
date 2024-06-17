import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { BrowserWindow, ipcMain } from 'electron'
import Mustache from 'mustache'
import * as http from 'http'
import IpcMainEvent = Electron.IpcMainEvent

type TwoWayIpcHandler = (res: unknown) => void

interface TemplateResponse {
  template: string
  data: unknown
}

function isTemplateResponse(object: unknown): object is TemplateResponse {
  return (object as TemplateResponse).template != null && (object as TemplateResponse).data != null
}

export default (window: BrowserWindow, port: number): http.Server => {
  const app: Express = express()
  app.use(cors())

  function twoWayIpcInvoke(channel: string, handler: TwoWayIpcHandler) {
    window.webContents.send(channel)
    ipcMain.once(channel, (_: IpcMainEvent, res) => {
      handler(res)
    })
  }

  app.get('/active-athlete', (_: Request, res: Response) => {
    twoWayIpcInvoke('active-athlete', (msg) => {
      res.send(msg)
    })
  })

  app.get('/scoreboard/:category', (req: Request, res: Response) => {
    if (!['overall', 'squat', 'bench', 'deadlift'].includes(req.params.category)) {
      res.status(404).send('Not found')
    }
    twoWayIpcInvoke(`scoreboard-${req.params.category}`, (msg) => {
      res.send(msg)
    })
  })

  app.get('/custom/lower-thirds', (_: Request, res: Response) => {
    twoWayIpcInvoke('custom-lower-thirds', (msg) => {
      if (isTemplateResponse(msg)) {
        const rendered = Mustache.render(msg.template, msg.data)
        res.send(rendered)
      }
    })
  })

  return app.listen(port)
}
