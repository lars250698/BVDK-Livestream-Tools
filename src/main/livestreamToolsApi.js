import express from 'express'
import cors from 'cors'
import { ipcMain } from 'electron'
import Mustache from 'mustache'

export default (window, port) => {
  const app = express()
  app.use(cors())

  function twoWayIpcInvoke(channel, handler) {
    window.webContents.send(channel)
    ipcMain.once(channel, (e, res) => {
      handler(res)
    })
  }

  app.get('/active-athlete', (req, res) => {
    twoWayIpcInvoke('active-athlete', (msg) => {
      res.send(msg)
    })
  })

  app.get('/scoreboard/:category', (req, res) => {
    if (!['overall', 'squat', 'bench', 'deadlift'].includes(req.params.category)) {
      res.status(404).send('Not found')
    }
    twoWayIpcInvoke(`scoreboard-${req.params.category}`, (msg) => {
      res.send(msg)
    })
  })

  app.get('/custom/lower-thirds', (req, res) => {
    twoWayIpcInvoke('custom-lower-thirds', (msg) => {
      const rendered = Mustache.render(msg.template, msg.data)
      res.send(rendered)
    })
  })

  return app.listen(port)
}
