(function() {
	var events = {
		"get": {
			"/": function(req, res) {
				res.render('index');
			},
			"/manage": function(req, res) {

			}
		},
		"post": {
			"/post": function(req, res) {
				res.header("Content-Type", "text/html; charset=utf-8")
				// 计算用户唯一身份识别信息
				var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
				// 简单验证后，若没有问题，则直接转入线程2
				// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
				if (config.danmu.blockusers.indexOf(hash) > -1 && !req.body.text.test(config.keyword.block)) {
					log.log("BAN " + hash + " - " + req.body.text.substr(0, 10) + "...");	
					res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
				} else {
					res.end("发送成功！");
					coordinator.emit("gotDanmu", {hash: hash, text: req.body.text, ip: req.ip, ua: req.headers['user-agent']});
				}
			}
		}
	};
	module.exports = {
		bindExpress: function(app) {
			for (var name in events.get) {
				app.get(name, events.get[name]);
			}
			for (var name in events.post) {
				app.post(name, events.post[name]);
			}
			return true;
		}
	}
})();