// / <reference path="../../typings/main.d.ts" />
'use strict'

const configEvent = require('../../interfaces/Config')
const danmuEvent = require('../../interfaces/Danmu')
const filter = require('../../utils/filter')
const log = require('../../utils/log')
const utils = require('../../utils')

let danmuQueue = {}
let danmuKeys = []
let config = require('../../../config')

let danmuId = 0

module.exports = {
  init: function (callback) {
    callback(null)
  }
}

// 更新配置
configEvent.updated.listen(data => {
  clearAllTimeval()
  initDanmuQueue()
  startAllTimeval()
})

// 待推送弹幕
danmuEvent.get.listen(data => {
// 过老弹幕没有意义，直接从队列头出队列
  while (danmuQueue[data.room].queue.length > config.rooms[data.room].maxlength) {
    danmuQueue[data.room].queue.shift()
  }
  if (data.lifeTime === '') {
    data.lifeTime = utils.parseLifeTime(data)
  }
  log.log(`房间${data.room}得到弹幕（${data.hash}）：${data.text}`)
  danmuQueue[data.room].queue.push(data)
})

let initDanmuQueue = function () {
  danmuQueue = {}
  danmuKeys = Object.keys(config.rooms)
  danmuKeys.forEach(room => {
    danmuQueue[room] = {
      queue: [],
      timeval: null
    }
  }
  )
}

let startAllTimeval = function () {
  danmuKeys.forEach(room => {
    if (config.rooms[room].permissions.send) {
      danmuQueue[room].timeval = initTimeval(room)
      log.log(`创建(${room})定时器 - ${config.websocket.interval} ms.`)
    } else {
      log.log(`${room} 房间弹幕已关闭，不创建定时器。`)
    }
  })
}

let clearAllTimeval = function () {
  danmuKeys.forEach(room => {
    log.log(`清理(${room})定时器`)
    clearInterval(danmuQueue[room].timeval)
  })
}

let initTimeval = function (room) {
  return setInterval(() => {
    // 定时推送
    let ret = []
    if (danmuQueue[room].queue.length === 0) return
    while (ret.length < config.websocket.singlesize && danmuQueue[room].queue.length > 0) {
      let object = danmuQueue[room].queue.pop()
      // 只在传输时才需要进行替换
      object.text = filter(room).replaceKeyword(object.text)
      object.id = ++danmuId
      ret.push(object)
    }
    log.log(`推送${ret.length}条弹幕到${room}，剩余${danmuQueue[room].queue.length}条。`)

    danmuEvent.transfer.emit({
      room: room,
      data: ret
    })
  }, config.websocket.interval)
}
