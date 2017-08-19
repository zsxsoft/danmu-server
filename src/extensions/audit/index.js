// / <reference path="../../../typings/main.d.ts" />

'use strict'
const fs = require('fs')
const path = require('path')
const socketEvent = require('../../interfaces/Socket')
const httpEvent = require('../../interfaces/Http')
const configEvent = require('../../interfaces/Config')
const danmuEvent = require('../../interfaces/Danmu')
const auditEvent = require('./Audit')
const log = require('../../utilities/log')
const config = require('../../../config')
let danmuQueue = {}
let danmuId = 0
let io = null

function Audit () {
  socketEvent.created.listen(socketObject => {
    io = socketObject
    io.on('connection', socket => {
      socket.on('auditLogin', data => {
        let room = data.room
        if (!config.rooms[room]) return socket.emit('auditInit', 'Room Not Found')
        let managePassword = config.rooms[room].managepassword
        if (managePassword !== data.password) return socket.emit('auditInit', 'Password Error')
        socket.join(`auditRoom${room}`)
        socket.emit('auditConnected')
        log.log(`审核页面${socket.id}已连接${room}`)

        {
          let danmuObject = {}
          danmuQueue[room].forEach((value, key) => {
            danmuObject[key] = value
          })
          socket.emit('auditDanmu', danmuObject)
        }
      })
      socket.on('auditPass', data => {
        log.log(`通过${data.room}(id = ${data.id})`)
        auditEvent.passed.emit(danmuQueue[data.room].get(parseInt(data.id)))
        danmuQueue[data.room].delete(data.id)
      })
      socket.on('auditFail', data => {
        log.log(`否决${data.room}(id = ${data.id})`)
        danmuQueue[data.room].delete(data.id)
        if (data.hash !== '') {
          config.rooms[data.room].blockusers.push(data.hash)
          log.log(`封禁用户${data.hash}成功`)
          configEvent.updated.emit()
        }
      })
    })
  })
  httpEvent.beforeRoute.listen(app => {
    let danmuKeys = Object.keys(config.rooms)

    app.get('/audit', (req, res, next) => fs.readFile(path.join(__dirname, './audit.html'), (err, data) => {
      if (err) throw err
      res.end(data)
    }))

    // Remove all listeners to gotDanmu and bind to a new listener.
    const danmuEvents = danmuEvent.get.listeners()
    danmuEvent.get.removeAllListeners()
    danmuEvents.forEach(event => auditEvent.passed.listen(event))

    danmuKeys.forEach(room => {
      danmuQueue[room] = new Map()
    })
    danmuEvent.get.listen(data => {
      let room = data.room
      danmuQueue[room].set(++danmuId, data)
      io.to(`auditRoom${room}`).emit('auditDanmu', { [danmuId]: data }) // 懒得再去写队列
      log.log(`${data.room}得到待审核弹幕（${data.hash}） - ${danmuId}：${data.text}`)
    })
  })
};
module.exports = Audit
