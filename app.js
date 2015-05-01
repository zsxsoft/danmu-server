/* global async */
/* global log */
/* global coordinator */
/* global global */

"use strict";
global.version = "0.0.1-20150405b";
global.config = require('./config');
global.async = require("async");
	
// 事件处理
global.coordinator = new (require('events').EventEmitter)();


// 公用函数
require("./lib/utils");


// 加载模块
async.map(["ext", "transfer", "database", "http", "socket"], function (module, callback) {
	require("./lib/" + module).init(callback);
}, function (err) {
		coordinator.emit("configUpdated");
		log.log("服务器初始化完成");
	}
	);

