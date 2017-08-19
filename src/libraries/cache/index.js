'use strict'
let cache = null
const config = require('../../../config')
const memoryCacheMap = new Map()

module.exports = {
  init: function (callback) {
    switch (config.cache.type) {
      case 'memcached':
        cache = new (require('memcached'))(config.cache.host)
        break
      case 'aliyun':
        const ALY = require('aliyun-sdk')
        const PORT = config.cache.host.split(':')[1]
        const HOST = config.cache.host.split(':')[0]
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
