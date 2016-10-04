const configEvent = require('../interfaces/Config')
const log = require('../utils/log')
let config = require('../../config')

configEvent.blockUser.listen((room, username) => {
  config.rooms[room].blockusers.push(username)
  configEvent.updated.emit()
  log.log(`封禁用户${username}成功`)
})

configEvent.unblockUser.listen((room, username) => {
  return new Promise((resolve, reject) => {
    let indexOf = config.rooms[room].blockusers.indexOf(username)
    if (indexOf >= 0) {
      config.rooms[room].blockusers.splice(indexOf, 1)
      configEvent.updated.emit()
      log.log(`已从黑名单移除用户${username}`)
      resolve()
    } else {
      log.log(`黑名单中未搜索到${username}`)
      reject()
    }
  })
})
