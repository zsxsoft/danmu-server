const Base = require('./Base')
const className = 'config'
const _ = require('ramda')
const register = _.curry(Base.register)(className)
const updated = register('updated')
class Config extends Base {
  static get className () {
    return className
  }
  static get updated () {
    return updated
  }
}
module.exports = Config
