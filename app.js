(function() {
	"use strict";

	var async = require("async");
	var config = global.config = require('./config');
	// 公用函数
	global.utils = require("./lib/utils");

	// 事件处理
	global.coordinator = new (require('events').EventEmitter);

	// 加载模块
	async.each(["child", "http", "socket", "check"], function(module, callback) {
		require("./lib/" + module).init(callback);
	}, function(err) {
		log.log("Init completed!");
	});

})();