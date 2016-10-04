'use strict'
const cp = require('child_process')
const path = require('path')
const danmuEvent = require('../../interfaces/Danmu')
const log = require('../../utilities/log')
let config = require('../../../config')

const tryCatch = (fn, e) => {
  try {
    return fn()
  } catch (err) {
    return e(err)
  }
}

module.exports = function () {
  Object.keys(config.ext.livesync).forEach(room => {
    const liveConfig = config.ext.livesync[room]
    const ls = cp.spawn('python', [path.join(__dirname, '/get.py'), liveConfig.liveUrl], ['ignore', 'pipe', 'pipe'])
    ls.stdout.on('data', stdout => {
      const splitted = stdout.toString().split('\n')
      splitted.forEach(data => {
        if (data.trim() === '') return
        tryCatch(() => {
          const ret = JSON.parse(data)
          let content = ''
          switch (ret.type) {
            case 'danmu':
              content = `${ret.data.Content}`
              break
            case 'gift':
              log.log(ret.data.NickName + ' 送了一份礼物')
              return
            case 'other':
              log.log('弹幕直播信息：' + data)
              return
          }
          danmuEvent.addSingle.wait({
            hash: ret.data.NickName,
            room,
            text: content,
            ip: '127.0.0.1',
            ua: 'liveSync',
            style: '',
            textStyle: '',
            lifeTime: '',
            color: '',
            height: '',
            sourceCode: ''
          })
        }, (e) => {
          log.log('解析弹幕失败：' + e.toString())
        })
      })
    })
  })
}
