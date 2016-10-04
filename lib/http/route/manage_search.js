// / <reference path="../../../typings/main.d.ts" />
'use strict'
const log = require('../../utils/log')
const danmuEvent = require('../../interfaces/Danmu')

module.exports = function (app) {
  app.post('/manage/search', function (req, res) {
    let room = req.body.room

    log.log('尝试搜索' + req.body.key)
    danmuEvent.search.wait({
      key: req.body.key,
      room
    }).then(data => {
      log.log('搜索' + req.body.key + '成功')
      res.end(data)
    })
  })
}
