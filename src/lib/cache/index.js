// / <reference path="../../typings/main.d.ts" />
'use strict'
var cache = null
let config = require('../../../config')
let memoryCacheMap = new Map()

module.exports = {
  init: function (callback) {
    switch (config.cache.type) {
      case 'memcached':
        cache = new (require('memcached'))(config.cache.host)
        break
      case 'aliyun':
        let ALY = require('aliyun-sdk')
        let PORT = config.cache.host.split(':')[1]
        let HOST = config.cache.host.split(':')[0]
        cache = ALY.MEMCACHED.createClient(PORT, HOST, {
          username: config.cache.authUser,
          password: config.cache.authPassword
        })
        break
      default:
        cache = {
          get: (name, callback) => {
            callback(null, memoryCacheMap.get(name))
          },
          set: (name, value, date, callback) => {
            memoryCacheMap.set(name, value)
            callback(null)
          }
        }
    }
    callback(null)
  }
}
module.exports.cache = () => {
  return cache
}

