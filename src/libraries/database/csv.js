// / <reference path="../../typings/main.d.ts" />

'use strict'

const fs = require('fs')
const path = require('path')
const danmuEvent = require('../../interfaces/Danmu')
const log = require('../../utilities/log')
let config = require('../../../config')

function formatContent (content) {
  return '"' + content.toString().replace(/"/g, '""') + '"'
}
module.exports = {}
module.exports.init = function (callback) {
  let savePath = path.resolve(config.database.savedir)
  log.log('保存位置：' + savePath)
  callback(null)
  danmuEvent.get.listen(data => {
    let joinArray = []
    joinArray.push(formatContent(Math.round(new Date().getTime() / 1000)))
    joinArray.push(formatContent(data.hash))
    joinArray.push(formatContent(data.ip))
    joinArray.push(formatContent(data.ua))
    joinArray.push(formatContent(data.text))
    joinArray.push('\r\n')
    fs.appendFile(path.resolve(savePath, data.room + '.csv'), joinArray.join(','))
  })

  danmuEvent.search.listen((data) => new Promise((resolve, reject) => {
    resolve('[{"user": "ERROR", "text": "Not yet supported", "publish": ""}]')
  }))
}
