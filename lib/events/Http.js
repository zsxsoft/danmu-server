const Base = require('./Base')
const className = 'http'
const _ = require('ramda')
const register = _.curry(Base.register)(className)
const created = register('created')
const beforeRoute = register('beforeRoute')
class Http extends Base {
  static get className () {
    return className
  }
  static get created () {
    return created
  }
  static get beforeRoute () {
    return beforeRoute
  }
}
module.exports = Http
