// / <reference path="../../typings/main.d.ts" />
'use strict'
const path = require('path')
const log = require('../utils/log')
let config = require('../../config')

module.exports.init = function (callback) {
  Object.keys(config.ext).map(name => {
    log.log('加载扩展组件：' + name)
    require(path.join(__dirname, './', name))()
  })
  log.log('扩展组件加载完成')
  callback(null)
}
