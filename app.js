/* global async */
/* global log */
/* global coordinator */
/* global global */

"use strict";
global.version = "0.0.3-20150501b";
global.config = require('./config');

// 公用函数
require("./lib/utils");

// 检测DaoCloud的MySQL服务
if (process.env.MYSQL_PORT_3306_TCP_PORT) {
	var dbPos = config.database;
	dbPos.type = "mysql";
	dbPos.server = process.env.MYSQL_PORT_3306_TCP_ADDR;
	dbPos.username = process.env.MYSQL_USERNAME;
	dbPos.password = process.env.MYSQL_PASSWORD;
	dbPos.port = process.env.MYSQL_PORT_3306_TCP_ADDR;
	dbPos.db = process.env.MYSQL_INSTANCE_NAME;
}

// 加载模块
async.map(["ext", "cache", "transfer", "database", "http", "socket"], function (module, callback) {
	require("./lib/" + module).init(callback);
}, function (err) {
	coordinator.emit("configUpdated");
	log.log("服务器初始化完成");
});

