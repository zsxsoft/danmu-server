// / <reference path="../../../typings/main.d.ts" />

'use strict'
const danmuController = require('../../../controllers/DanmuController')

module.exports = function (app) {
  app.post('/manage/danmu/delete/', (req, res) => {
    let data = {}
    data.hash = req.body.hash || ''
    data.id = req.body.id || 0
    data.room = req.body.room || ''

    if (data.id === 0) {
      res.end({})
      return
    }

    danmuController.removeSingle(data, data.hash !== '')
    return res.end('{"error": "删除弹幕成功"}')
  })
}
