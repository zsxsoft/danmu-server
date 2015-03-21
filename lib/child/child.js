(function() {
	"use strict";

	var io = null;
	var danmuQueue = {};
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
		initDanmuQueue();
		restartTimeval();
	});

	// 待推送弹幕
	coordinator.on("danmuTransfer", function(data) {
		// 过老弹幕没有意义，直接从队列头出队列
		while (danmuQueue[data.data.room].queue.length > config.rooms[data.data.room].maxlength) {
			danmuQueue[data.data.room].queue.shift();
		}
		var comment = {
			text: data.data.text,
			lifeTime: (parseInt(Math.random() * 10) + data.data.text.length % 10) * 60
		};
		log.log("得到弹幕（" + data.data.hash + "）：" + data.data.text.substr(0, 10) + "...");
		danmuQueue[data.data.room].queue.push(comment);
	});


	var initDanmuQueue = function() {
		danmuQueue = {};
		for (var room in config.rooms) {
			danmuQueue[room] = {
				queue: [],
				timeval: 0
			}
		}
	};
	
	var restartTimeval = function() {
		for (var room in danmuQueue) {
			clearInterval(danmuQueue[room].timeval);
			danmuQueue[room].timeval = initTimeval(room);
		}
	};

	var initTimeval = function(room) {
		return setInterval(function() {
			// 定时推送
			var ret = [];
			if (danmuQueue[room].queue.length === 0) return;
			while (ret.length < config.websocket.singlesize && danmuQueue[room].queue.length > 0) {
				ret.push(danmuQueue[room].queue.pop());
			}
			log.log("推送" + ret.length + "条弹幕到客户端，剩余" + danmuQueue[room].queue.length + "条。");
			process.send({
				method: "danmu",
				data: {
					room: room,
					data: ret
				}
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