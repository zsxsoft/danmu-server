// / <reference path="../../../typings/main.d.ts" />
'use strict'
let listener = require('../../utils/event')
module.exports = function (app) {
  app.post('/manage/search', function (req, res) {
    let room = req.body.room

    log.log('尝试搜索' + req.body.key)
    listener.emit('searchDanmu', {
      key: req.body.key,
      room: room
    })
    listener.on('gotSearchDanmu', function (data) {
      log.log('搜索' + req.body.key + '成功')
      res.end(data)
    })
  })
}
