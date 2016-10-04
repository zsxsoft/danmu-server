const Base = require('./Base')
const updated = Base.register('updated')
class Config extends Base {
  static get updated () {
    return updated
  }
}
module.exports = Config
