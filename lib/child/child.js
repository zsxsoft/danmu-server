(function() {
	"use strict";

	var io = null;
	var danmuQueue = {};
	var async = require("async");
	var checkKeyword = {};

	module.exports = {
		init: function(data) {
			coordinator.emit("configUpdated", data);
			initThis(function() {
				if (config.env.childprocess) {
					process.send({
						method: "init"
					});
				}
			});
		}
	};

	if (typeof config == "undefined") { // 当子进程时配置不存在
		global.coordinator = new(require('events').EventEmitter)(); // 子线程也需要事件处理
		global.utils = require("../utils");

		process.on("message", function(data) {
			coordinator.emit(data.method, data);
		});

		// 初始化线程
		coordinator.on("init", function(data) {
			module.exports.init(data);
		});

		// 得到搜索弹幕信息
		coordinator.on("gotSearchDanmu", function(data) {
			process.send({
				method: "gotSearchDanmu",
				data: data
			});
		});
	}



	// 更新配置
	coordinator.on("configUpdated", function(data) {
		if (typeof config == "undefined") {
			global.config = data.data;
		} else if (config.env.childprocess) {
			config = data.data;
		}
		clearAllTimeval();
		initDanmuQueue();
		startAllTimeval();
		initKeyWordRegExp();
	});

	// 待推送弹幕
	coordinator.on("gotDanmu", function(argu) {
		var data;
		if (!config.env.childprocess) {
			data = {
				data: argu
			};
		} else {
			data = argu;
		}
		// 过老弹幕没有意义，直接从队列头出队列
		while (danmuQueue[data.data.room].queue.length > config.rooms[data.data.room].maxlength) {
			danmuQueue[data.data.room].queue.shift();
		}
		var comment = {
			text: data.data.text,
			lifeTime: (parseInt(Math.random() * 10) + data.data.text.length % 10) * 60
		};
		log.log("房间" + data.data.room + "得到弹幕（" + data.data.hash + "）：" + data.data.text.substr(0, 10) + "...");
		danmuQueue[data.data.room].queue.push(comment);
	});


	var initDanmuQueue = function() {
		danmuQueue = {};
		for (var room in config.rooms) {
			danmuQueue[room] = {
				queue: [],
				timeval: null
			};
		}
	};

	var startAllTimeval = function() {
		for (var room in danmuQueue) {
			danmuQueue[room].timeval = initTimeval(room);
			log.log("创建(" + room + ")定时器 - " + config.websocket.interval + "ms");
		}
	};

	var clearAllTimeval = function() {
		for (var room in danmuQueue) {
			log.log("清理(" + room + ")定时器");
			clearInterval(danmuQueue[room].timeval);
		}
	};

	var initTimeval = function(room) {
		return setInterval(function() {
			// 定时推送
			var ret = [];
			if (danmuQueue[room].queue.length === 0) return;
			while (ret.length < config.websocket.singlesize && danmuQueue[room].queue.length > 0) {
				var object = danmuQueue[room].queue.pop();
				object.text = object.text.replace(checkKeyword[room], "**");
				ret.push(object); // 一边弹出一边替换
			}
			log.log("推送" + ret.length + "条弹幕到" + room + "，剩余" + danmuQueue[room].queue.length + "条。");

			if (config.env.childprocess) {
				process.send({
					method: "danmu",
					data: {
						room: room,
						data: ret
					}
				});
			} else {
				coordinator.emit("danmuTransfer", {
					room: room,
					data: ret
				});
			}

		}, config.websocket.interval);
	};

	var initThis = function(callback) {
		// 数据库由子线程负责操作
		async.each(["./../database"], function(module, callback) {
			require(module).init(callback);
		}, function(err) {
			log.log("子进程启动成功");
			callback(null);
		});
	};

	var initKeyWordRegExp = function() {
		for (var room in danmuQueue) {
			checkKeyword[room] = new RegExp(config.rooms[room].keyword.replacement, "ig");
		}
	};


})();