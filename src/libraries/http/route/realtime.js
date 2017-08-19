const config = require('../../../../config')

module.exports = function (app) {
  app.get('/realtime', (req, res) => {
    res.render('realtime', {
      config,
      version: global.version
    })
  })
}
