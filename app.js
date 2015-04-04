(function() {
	"use strict";

	var async = require("async");
	var config = global.config = require('./config');
	// 事件处理
	global.coordinator = new (require('events').EventEmitter)();

	// 公用函数
	require("./lib/utils");



	// 加载模块
	async.each(["transfer", "http", "socket", "database"], function(module, callback) {
		require("./lib/" + module).init(callback);
	}, function(err) {
		coordinator.emit("configUpdated");
		log.log("服务器初始化完成");
	});

})();