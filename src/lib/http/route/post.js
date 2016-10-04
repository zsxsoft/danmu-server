'use strict'
const utils = require('../../../utils')
const danmuEvent = require('../../../interfaces/Danmu')

let config = require('../../../../config')

// let _ = require('ramda');

module.exports = function (app) {
  app.post('/post', (req, res) => {
    const room = req.room
    const roomConfig = config.rooms[room]
    const ip = roomConfig.cdn ? req.ip : (req.get('X-Real-IP') || req.get('X-Forwarded-For') || req.ip)
    const hash = utils.getHash(ip, req.headers['user-agent'], req.body.hash)

    let danmuData = {
      hash,
      room,
      text: req.body.text,
      ip,
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

    danmuEvent.httpReceived.wait(req, res, danmuData)
    .then(() => danmuEvent.addSingle.wait(danmuData, req.body, {
      password: req.body.password,
      isAdvanced: req.body.type === 'advanced'
    }))
    .then(() => res.end('发送成功！'))
    .catch(e => res.end(e.toString()))
  })
}
