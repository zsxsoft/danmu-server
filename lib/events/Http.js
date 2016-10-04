const Base = require('./Base')
const created = Base.register('created')
const beforeRoute = Base.register('beforeRoute')
class Http extends Base {
  static get created () {
    return created
  }
  static get beforeRoute () {
    return beforeRoute
  }
}
module.exports = Http
