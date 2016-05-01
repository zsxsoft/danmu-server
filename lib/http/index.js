/// <reference path="../../typings/node/node.d.ts"/>
'use strict';
let fs = require('fs');
let express = require('express');
let logger = require('morgan');
let errorHandler = require('errorhandler');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let listener = require('../utils/event');
let config = require('../../config');

module.exports = {
	init: function (callback) {
		app
			.engine('.html', require('ejs').__express)
			//.use(logger('dev'))
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({
				extended: true, 
			}))
			.use(errorHandler())
			.set('view engine', 'html')
			.set('views', path.join(__dirname, "./view/"))
			.use(express.static(path.join(__dirname, "./res/")));

		listener.emit("httpBeforeRoute", app);

		// 处理路由
		fs.readdir(path.join(__dirname, "./route"), (err, files) => {
			files.forEach((filename) => {
				require(path.join(__dirname, "./route", filename))(app);
			});
		});

		let server = app.listen(config.http.port, () => {
			log.log(`服务器于http://127.0.0.1:${config.http.port}/成功创建`);
			listener.emit("httpCreated", server);
			callback(null);
		});


	}, 
};

