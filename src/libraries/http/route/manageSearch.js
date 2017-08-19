const log = require('../../../utilities/log')
const danmuEvent = require('../../../interfaces/Danmu')

module.exports = function (app) {
  app.post('/manage/search', function (req, res) {
    const room = req.body.room

    log.log('尝试搜索' + req.body.key)
    danmuEvent.search.wait({
      key: req.body.key,
      room
    }).then(data => {
      log.log('搜索' + req.body.key + '成功')
      res.end(data)
    }).catch(data => {
      res.end(`[{"user": "ERROR", "text": "${JSON.parse(data.toString())}", "publish": ""}]`)
    })
  })
}
