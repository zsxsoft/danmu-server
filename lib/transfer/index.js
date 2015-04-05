(function() {
	"use strict";

	var io = null;
	var danmuQueue = {};
	var async = require("async");

	module.exports = {
		init: function(callback) {
			callback(null);
		}
	};

	// 更新配置
	coordinator.on("configUpdated", function(data) {
		clearAllTimeval();
		initDanmuQueue();
		startAllTimeval();
	});

	// 待推送弹幕
	coordinator.on("gotDanmu", function(data) {

		// 过老弹幕没有意义，直接从队列头出队列
		while (danmuQueue[data.room].queue.length > config.rooms[data.room].maxlength) {
			danmuQueue[data.room].queue.shift();
		}
		var comment = {
			color: data.color,
			style: data.style,
			textStyle: data.textStyle,
			text: data.text,
			lifeTime: data.lifeTime === "" ? (parseInt(Math.random() * 10) + data.text.length % 10) * 60 : data.lifeTime
		};
		log.log("房间" + data.room + "得到弹幕（" + data.hash + "）：" + data.text.substr(0, 10) + "...");
		danmuQueue[data.room].queue.push(comment);
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
				// 只在传输时才需要进行替换
				object.text = filter.replaceKeyword(room, object.text);
				ret.push(object);
			}
			log.log("推送" + ret.length + "条弹幕到" + room + "，剩余" + danmuQueue[room].queue.length + "条。");

			coordinator.emit("danmuTransfer", {
				room: room,
				data: ret
			});

		}, config.websocket.interval);
	};



})();