const utilities = require('./')
module.exports = {
  log: function (text) {
    console.log('[' + utilities.getTime() + '] ' + text)
  }
}
