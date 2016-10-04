const Base = require('../../interfaces/Base')
const className = 'audit'
const _ = require('ramda')
const register = _.curry(Base.register)(className)
const passed = register('passed')
class Audit extends Base {
  static get className () {
    return className
  }
  static get passed () {
    return passed
  }
}
module.exports = Audit
