const fs = require('fs')
const express = require('express')
const errorHandler = require('errorhandler')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const httpEvent = require('../../interfaces/Http')
const log = require('../../utilities/log')
let config = require('../../../config')

module.exports = {
  init: function (callback) {
    app
      .engine('.html', require('ejs').__express)
    // .use(logger('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(errorHandler())
      .set('view engine', 'html')
      .set('views', path.join(__dirname, './view/'))
      .use(express.static(path.join(__dirname, './res/')))

    httpEvent.beforeRoute.emit(app)

    // 处理路由
    fs.readdir(path.join(__dirname, './route'), (err, files) => {
      if (err) {
        console.error(err)
        return
      }
      files.forEach((filename) => {
        require(path.join(__dirname, './route', filename))(app)
      })
    })

    let server = app.listen(config.http.port, () => {
      log.log(`服务器于http://127.0.0.1:${config.http.port}/成功创建`)
      httpEvent.created.emit(server)
      callback(null)
    })
  }
}
