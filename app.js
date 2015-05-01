/* global async */
/* global log */
/* global coordinator */
/* global global */

"use strict";
global.version = "0.0.1-20150405b";
global.config = require('./config');

// 公用函数
require("./lib/utils");


// 加载模块
async.map(["ext", "cache", "transfer", "database", "http", "socket"], function (module, callback) {
	require("./lib/" + module).init(callback);
}, function (err) {
		coordinator.emit("configUpdated");
		log.log("服务器初始化完成");
	}
	);

