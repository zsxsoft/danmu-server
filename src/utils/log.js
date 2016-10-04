const utils = require('./')
module.exports = {
  log: function (text) {
    console.log('[' + utils.getTime() + '] ' + text)
  }
}
