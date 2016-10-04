const Base = require('./Base')
const created = Base.register('created')
class Http extends Base {
  static get created () {
    return created
  }
}
module.exports = Http
