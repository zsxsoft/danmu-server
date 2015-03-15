(function() {
	"use strict";

	var io = null;
	var danmuQueue = [];
	var interval = 0;
	var async = require("async");


	global.coordinator = new(require('events').EventEmitter); // 子线程也需要事件处理
	global.utils = require("../utils");
	global.config = {};

	process.on("message", function(data) {
		coordinator.emit(data.method, data);
	});

	// 初始化线程
	coordinator.on("init", function(data) {
		coordinator.emit("configUpdated", data);
		initThis(function() {
			process.send({
				method: "init"
			});
		});
	});

	// 更新配置
	coordinator.on("configUpdated", function(data) {
		config = data.data;
		initTimeval();
	});

	// 待推送弹幕
	coordinator.on("danmuTransfer", function(data) {
		// 过老弹幕没有意义，直接从队列头出队列
		while (danmuQueue.length > config.danmu.length) {
			danmuQueue.shift();
		}
		var comment = {
			text: data.data.text,
			lifeTime: (parseInt(Math.random() * 10) + data.data.text.length % 10) * 60
		};
		log.log("得到弹幕（" + data.data.hash + "）：" + data.data.text.substr(0, 10) + "...");
		danmuQueue.push(comment);
	});

	// 待审核弹幕
	coordinator.on("danmuBeforeCheck", function(data) {

	});

	var initTimeval = function() {
		clearInterval(interval);
		interval = setInterval(function() {
			// 定时推送
			var ret = [];
			if (danmuQueue.length === 0) return;
			while (ret.length < config.websocket.singlesize && danmuQueue.length > 0) {
				ret.push(danmuQueue.pop());
			}
			log.log("推送" + ret.length + "条弹幕到客户端，剩余" + danmuQueue.length + "条。");
			process.send({
				method: "danmu",
				data: ret
			});
		}, config.websocket.interval);
	};

	var initThis = function(callback) {
		// 数据库由子线程负责操作
		async.each(["./../database"], function(module, callback) {
			require(module).init(callback);
		}, function(err) {
			log.log("Child process init completed!");
			callback(null);
		});
	};


})();