// / <reference path="../../typings/main.d.ts" />

const mongodb = require('mongodb')
const danmuEvent = require('../events/Danmu')
const log = require('../utils/log')
let config = require('../../config')
let db = null

const server = new mongodb.Server(config.database.server, config.database.port, {
  auto_reconnect: true
})
const getConnection = function (callback) {
  db = new mongodb.Db(config.database.db, server, {
    w: 1
  })
  db.open(err => {
    if (err !== null) {
      log.log('数据库连接错误')
      throw err
    }

    if (config.database.username !== '') {
      db.authenticate(config.database.username, config.database.password, function (err, result) {
        if (err !== null) {
          log.log('数据库验证错误')
          throw err
        }
        callback.apply(callback, arguments)
      })
    }

    callback.apply(callback, arguments)
    log.log('数据库连接成功')
  })
    // callback(null);
}

module.exports = {
  init: function (callback) {
    getConnection(callback)

    danmuEvent.get.listen(data => {
      let room = data.room
      db.collection(config.rooms[room].table).insert({
        user: data.hash,
        text: data.text,
        publish: Math.round(new Date().getTime() / 1000),
        ip: data.ip,
        ua: data.ua
      }, (err, results) => {
        if (err !== null) {
          log.log('数据库写入出错')
          console.log(err)
        }
      })
    })

    danmuEvent.search.listen((callback, data) => {
      let room = data.room
      db.collection(config.rooms[room].table).find({
        text: {
          $regex: '.*?' + pregQuote(data.key) + '.*?'
        }
      }, null, null).toArray(function (err, results) {
        if (err === null) {
          results.map(function (object) {
            object.id = object._id
          })
          callback(JSON.stringify(results))
        } else {
          log.log('数据库搜索出错')
          console.error(err)
          callback('[]')
        }
      })
    })
  }
}

function pregQuote (str, delimiter) {
    //  discuss at: http://phpjs.org/functions/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //   example 1: preg_quote("$40");
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?");
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

  return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&')
}
