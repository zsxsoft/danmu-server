'use strict'
const utils = require('../../utils')
const listener = require('../../utils/event')
const filter = require('../../utils/filter')
const log = require('../../utils/log')
let config = require('../../../config')

// let _ = require('ramda');
const permissions = ['color', 'style', 'height', 'lifeTime', 'textStyle', 'sourceCode'] // 为了不foreach

module.exports = function (app) {
  app.post('/post', (req, res) => {
// 请求合法性校验
    req.body.hash = req.body.hash || ''
    req.body.text = req.body.text || ''
    req.body.type = req.body.type || ''
    req.body.password = req.body.password || ''

// 计算用户唯一身份识别信息
    let hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash)
    let room = req.room
    let danmuData = {
      hash: hash,
      room: room,
      text: req.body.text,
      ip: req.ip, // 如果使用CDN就要开启后面这东西  //req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip,
      ua: req.headers['user-agent'],
      style: '',
      textStyle: '',
      lifeTime: '',
      color: '',
      height: '',
      sourceCode: ''
    }

    if (req.body.text === '') {
      return res.end('弹幕不能为空')
    }

// 等所有异步逻辑都执行完毕之后再进行下一步操作
// 如果这里用setTimeout 0的话就方便很多了，但是在这种入口用红黑树，效率太低了
    listener.emitAsync('getDanmu', req, res, danmuData, () => {
      let realFilter = filter(danmuData.room)
      let isAdvanced = false
      if (!config.rooms[room].permissions.send) {
        return res.end('弹幕暂时被关闭')
      }
      if (req.body.type === 'advanced') {
        if (req.body.password !== config.rooms[room].advancedpassword) {
          return res.end('高级弹幕密码错误！')
        }
        isAdvanced = true
      }
      if (!isAdvanced && danmuData.text.length > config.rooms[room].textlength) {
        return res.end('弹幕长度大于' + config.rooms[room].textlength + '个字，可能影响弹幕观感，请删减。')
      }
// 通过关键词和用户是否被屏蔽判断是否允许发送
      if (realFilter.checkUserIsBlocked(danmuData.hash) || !realFilter.validateText(req.body.text)) {
        log.log('拦截 ' + hash + ' - ' + req.body.text)
        listener.emit('banDanmu', danmuData)
        return res.end('发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。')
      }

      permissions.forEach((val) => {
        if (isAdvanced || config.rooms[room].permissions[val]) {
          danmuData[val] = req.body[val] || ''
        }
      })
      res.end('发送成功！')
      listener.emit('gotDanmu', danmuData)
    })
  })
}
