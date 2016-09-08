// / <reference path="../../../typings/main.d.ts" />

'use strict'
const listener = require('../../utils/event')
const log = require('../../utils/log')
let config = require('../../../config')

module.exports = function (app) {
  app.post('/manage/block/add/', (req, res) => {
    let room = req.body.room

    config.rooms[room].blockusers.push(req.body.user)
    log.log('封禁用户' + req.body.user + '成功')
    listener.emit('configUpdated')
    res.end('{"error": "封禁用户成功"}')
  })

  app.post('/manage/block/get/', (req, res) => {
    let room = req.body.room
    log.log('请求被封禁用户成功')
    res.end(JSON.stringify(config.rooms[room].blockusers))
  })

  app.post('/manage/block/remove/', (req, res) => {
    let room = req.body.room
    let indexOf = config.rooms[room].blockusers.indexOf(req.body.user)
    if (indexOf >= 0) {
      log.log('已从黑名单移除标识为' + indexOf + '的用户' + config.rooms[room].blockusers[indexOf])
      config.rooms[room].blockusers.splice(indexOf, 1)
      listener.emit('configUpdated')
// res.end('{"error": 0}');
    } else {
      log.log('黑名单中未搜索到' + config.rooms[room].blockusers[indexOf])
    }
    res.end('{"error": "移除封禁成功"}')
  })
}
