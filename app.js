"use strict";
delete require.cache['./config'];
//  Include modules
var
  express = require('express'),
  http = require('http'),
  path = require('path'),
	common = require('./lib/common'),
  console = require('./lib/console'),
	expressLess = require('express-less');

var config = require('./config').config,
	httpPage = require('./' + config.webServer.serverFolders),
	app = express(),
  lang = require('./lang/' + config.lang).lang;

httpPage.config = config;
httpPage.lang = lang;

app
   // Dev mode
   /*
     .use(express.logger('dev'))
     .use(express.errorHandler())
   */
   
   // set ejs
   .engine('.html', require('ejs').__express)
   .set('view engine', 'html')
   // set ejs render
   .set('views', path.join(__dirname, config.webServer.htmlFolders))

   // set less
   .use('/less', expressLess(path.join(__dirname, config.webServer.staticFolders, '/less')))

   .use(express.json())
   .use(express.urlencoded())
   .use(express.methodOverride())
   .use(app.router)
    
   // set port
   .set('port', config.webServer.port)

   // set static resouces
   .use(express.static(path.join(__dirname, config.webServer.staticFolders)))

   // set url
   .get('/', httpPage.index)
   .get('/manage', httpPage.manage)

;


var httpServer = http.createServer(app).listen(config.webServer.port, function(){
  console.success(lang.console.serverCreated.replace("%u%", "http://127.0.0.1:" + config.webServer.port + '/'));
});

common.setConsole(console)
      .setLang(lang)
      .rebuildConfig(config)
      .bindEvent('receiver')
      .bindEvent('manage')
      .bindEvent('index')
      .bindServer(httpServer);
