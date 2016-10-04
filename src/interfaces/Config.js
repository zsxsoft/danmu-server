const Base = require('./Base')
const className = 'config'
const updated = Base.register(className, 'updated')
const blockUser = Base.register(className, 'blockUser')
const unblockUser = Base.register(className, 'unblockUser')
class Config extends Base {
  static get className () {
    return className
  }
  static get blockUser () {
    return blockUser
  }
  static get updated () {
    return updated
  }
  static get unblockUser () {
    return unblockUser
  }
}
module.exports = Config
