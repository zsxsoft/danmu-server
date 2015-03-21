(function() {
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
				res.header("Content-Type", "text/html; charset=utf-8");
				// 计算用户唯一身份识别信息
				var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
				var room = req.body.room;
				// 简单验证后，若没有问题，则直接转入线程2
				// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
				if (typeof config.rooms[room] == 'undefined') return;
				if (config.rooms[room].blockusers.indexOf(hash) > -1 && !req.body.text.test(config.rooms[room].keyword.block)) {
					log.log("BAN " + hash + " - " + req.body.text.substr(0, 10) + "...");	
					res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
				} else {
					res.end("发送成功！");
					coordinator.emit("gotDanmu", {hash: hash, room: room, text: req.body.text, ip: req.ip, ua: req.headers['user-agent']});
				}
			}, 
			"/manage/search": function(req, res) {
				res.header("Content-Type", "text/html; charset=utf-8");
				// 在这里要加入密码验证
				var room = req.body.room;
				if (typeof config.rooms[room] == 'undefined') {
					res.end('{error: "密码错误"}');
					return;
				}
				coordinator.emit("searchDanmu", {key: req.body.key, room: room});
				coordinator.on("gotSearchDanmu", function(data) {
					console.log(data);
					res.end(data);
				});
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
			return true;
		}
	};
})();