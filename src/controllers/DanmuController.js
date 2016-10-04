const filter = require('../utils/filter')
const log = require('../utils/log')
const danmuEvent = require('../interfaces/Danmu')
const permissions = ['color', 'style', 'height', 'lifeTime', 'textStyle', 'sourceCode'] // 为了不foreach
let config = require('../../config')

class DanmuController {
  static add (data, inputs = {}, extra = {
    password: '',
    isAdvanced: false
  }) {
    return new Promise((resolve, reject) => {
      const room = data.room
      const roomConfig = config.rooms[room]
      const realFilter = filter(room)
      if (!roomConfig.permissions.send) {
        return reject('弹幕暂时被关闭')
      }
      if (extra.isAdvanced) {
        if (extra.password !== roomConfig.advancedpassword) {
          return reject('高级弹幕密码错误！')
        }
      }
      if (!extra.isAdvanced && data.text.length > roomConfig.textlength) {
        return reject(`弹幕长度大于${roomConfig.textlength}个字，可能影响弹幕观感，请删减。`)
      }
      if (realFilter.checkUserIsBlocked(data.hash) || !realFilter.validateText(data.text)) {
        log.log(`拦截 ${data.hash} - ${data.text}`)
        danmuEvent.ban.emit(data)
        return reject('发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。')
      }

      permissions.forEach((val) => {
        if (extra.isAdvanced || roomConfig.permissions[val]) {
          data[val] = inputs[val] || ''
        }
      })
      resolve(true)
      danmuEvent.get.emit(data)
    })
  }
}
module.exports = DanmuController
