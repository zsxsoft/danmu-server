const Base = require('./Base')
const created = Base.register('created')
class Socket extends Base {
  static get created () {
    return created
  }
}
module.exports = Socket
