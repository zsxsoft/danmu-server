(function() {
	var http = require('http');
	var express = require('express');
	var logger = require('morgan');
	var router = require('./route');
	var errorHandler = require('errorhandler');
	var path = require('path');
	var app = express();
	var bodyParser = require('body-parser');

	module.exports = {
		init: function(callback) {
			app
				.engine('.html', require('ejs').__express)
				//.use(logger('dev'))
				.use(bodyParser.json())
				.use(bodyParser.urlencoded({
					extended: true
				}))
				.use(errorHandler())
				.set('view engine', 'html')
				.set('views', path.join(__dirname, "./view/"))
				.use(express.static(path.join(__dirname, "./res/")))
				.route("/").all(function(req, res, next) {
					res.append('Server', 'zsx\'s Danmu Server');
					next();
				}).post(function(req, res, next) {
					res.header("Content-Type", "text/html; charset=utf-8");
					next();
				});
			router.bindExpress(app);

			var server = app.listen(config.http.port, function() {
				log.log("服务器于http://127.0.0.1:" + config.http.port + '/成功创建');
				coordinator.emit("httpCreated", server);
				callback(null);
			});

			
		}
	};

})();