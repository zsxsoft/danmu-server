// / <reference path="../../../typings/main.d.ts" />

'use strict'
let listener = require('../../utils/event')
let config = require('../../../config')

module.exports = function (app) {
  app.post('/manage/danmu/delete/', (req, res) => {
    req.body.hash = req.body.hash || ''
    req.body.id = req.body.id || 0
    req.body.room = req.body.room || ''

    if (req.body.id === 0) {
      res.end({})
      return
    }

    let deleteObject = {}
    deleteObject[req.body.room] = {
      ids: [req.body.id],
      hashs: [req.body.hash]
    }
    listener.emit('danmuDelete', deleteObject)

    if (req.body.hash !== '') {
      config.rooms[req.body.room].blockusers.push(req.body.hash)
      log.log('封禁用户' + req.body.hash + '成功')
      listener.emit('configUpdated')
    }

    log.log('删除弹幕 ' + req.body.id + ' 成功')
    return res.end('{"error": "删除弹幕成功"}')
  })
}
