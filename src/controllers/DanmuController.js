const filter = require('../utilities/filter')
const log = require('../utilities/log')
const danmuEvent = require('../interfaces/Danmu')
const configEvent = require('../interfaces/Config')

const permissions = ['color', 'style', 'height', 'lifeTime', 'textStyle', 'sourceCode'] // 为了不foreach
let config = require('../../config')

danmuEvent.addSingle.listen((data, inputs = {}, extra = {
  password: '',
  isAdvanced: false
}) => {
  return new Promise((resolve, reject) => {
    const room = data.room
    const roomConfig = config.rooms[room]
    const realFilter = filter(room)
    if (!roomConfig.permissions.send) {
      return reject(new Error('弹幕暂时被关闭'))
    }
    if (extra.isAdvanced) {
      if (extra.password !== roomConfig.advancedpassword) {
        return reject(new Error('高级弹幕密码错误！'))
      }
    }
    if (!extra.isAdvanced && data.text.length > roomConfig.textlength) {
      return reject(new Error(`弹幕长度大于${roomConfig.textlength}个字，可能影响弹幕观感，请删减。`))
    }
    if (realFilter.checkUserIsBlocked(data.hash) || !realFilter.validateText(data.text)) {
      log.log(`拦截 ${data.hash} - ${data.text}`)
      danmuEvent.ban.emit(data)
      return reject(new Error('发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。'))
    }

    permissions.forEach((val) => {
      if (extra.isAdvanced || roomConfig.permissions[val]) {
        data[val] = inputs[val] || ''
      }
    })
    resolve(true)
    danmuEvent.get.emit(data)
  })
})

/**
 * 删除一条弹幕
 */
danmuEvent.removeSingle.listen((data, blockUser = false) => {
  let deleteObject = {}
  deleteObject[data.room] = {
    ids: [data.id],
    hashs: [data.hash]
  }
  danmuEvent.removing.emit(deleteObject)
  if (blockUser) configEvent.blockUser.emit(data.room, data.hash)
  log.log(`删除弹幕 ${data.id} 成功`)
})
