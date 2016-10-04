const Base = require('./Base')
const className = 'socket'
const _ = require('ramda')
const register = _.curry(Base.register)(className)
const created = register('created')
class Socket extends Base {
  static get className () {
    return className
  }
  static get created () {
    return created
  }
}
module.exports = Socket
