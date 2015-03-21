(function() {
	var regExList = {};
	var events = {
		"get": {
			"/": function(req, res) {
				res.render('index', {
					config: config
				});
			},
			"/manage": function(req, res) {
				res.render('manage', {
					config: config
				});
			}
		},
		"post": {
			"/post": function(req, res) {
				// 计算用户唯一身份识别信息
				var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
				var room = req.body.room;
				// 简单验证后，若没有问题，则直接转入线程2
				// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
				if (typeof config.rooms[room] == 'undefined') return;
				if (config.rooms[room].blockusers.indexOf(hash) > -1 || regExList[room].test(req.body.text)) {
					log.log("BAN " + hash + " - " + req.body.text.substr(0, 10) + "...");
					res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
				} else {
					res.end("发送成功！");
					coordinator.emit("gotDanmu", {
						hash: hash,
						room: room,
						text: req.body.text,
						ip: req.ip,
						ua: req.headers['user-agent']
					});
				}
			},
			"/manage/search": function(req, res) {
				// 在这里要加入密码验证
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}
				coordinator.emit("searchDanmu", {
					key: req.body.key,
					room: room
				});
				coordinator.on("gotSearchDanmu", function(data) {
					console.log(data);
					res.end(data);
				});
			},
			"/manage/block/add/": function(req, res) {
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}
				config.rooms[room].blockusers.push(req.body.user);
				coordinator.emit("configUpdated");
				res.end('{"error": 0}');
			},
			"/manage/block/get/": function(req, res) {
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}
				res.end(JSON.stringify(config.rooms[room].blockusers));
			},
			"/manage/block/remove/": function(req, res) {
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}
				var indexOf = config.rooms[room].blockusers.indexOf(req.body.user);
				if (indexOf >= 0) {
					config.rooms[room].blockusers.splice(indexOf, 1);
					coordinator.emit("configUpdated");
					//res.end('{"error": 0}');
				} else {

				}
				res.end('{"error": 0}');
			},
			"/manage/config/set/": function(req, res) {
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}

				config.rooms[room].keyword.replacement = req.body.replaceKeyword;
				config.rooms[room].keyword.block = req.body.blockKeyword;
				config.rooms[room].maxlength = req.body.maxlength;
				config.websocket.interval = req.body.socketinterval;
				config.websocket.singlesize = req.body.socketsingle;
				coordinator.emit("configUpdated");
				res.end(JSON.stringify(buildConfigToArray(room)));
			},
			"/manage/config/get/": function(req, res) {
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{"error": "房间错误"}');
					return;
				}

				res.end(JSON.stringify(buildConfigToArray(room)));
			}
		}
	};
	module.exports = {
		bindExpress: function(app) {
			for (var name in events.get) {
				app.get(name, events.get[name]);
			}
			for (name in events.post) {
				app.post(name, events.post[name]);
			}
			initRegExp();
			return true;
		}
	};

	var buildConfigToArray = function(room) {
		return {
			replaceKeyword: config.rooms[room].keyword.replacement,
			blockKeyword: config.rooms[room].keyword.block,
			maxlength: config.rooms[room].maxlength,
			socketinterval: config.websocket.interval,
			socketsingle: config.websocket.singlesize
		};
	};

	var initRegExp = function() {
		for (var room in config.rooms) {
			regExList[room] = new RegExp(config.rooms[room].keyword.block, "ig");
		}
	};

	// 更新正则缓存
	coordinator.on("configUpdated", initRegExp);
})();