const log = require('../../utilities/log')

module.exports = {
  init: function (callback) {
    log.log('无数据库')
    callback(null)
  }
}
