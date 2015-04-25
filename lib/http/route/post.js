module.exports = function(app) {

	app.post("/post", function(req, res) {
		// 计算用户唯一身份识别信息
		var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
		var room = req.body.room;
		var danmuData = {
			hash: hash,
			room: room,
			text: req.body.text,
			ip: req.ip,
			ua: req.headers['user-agent'],
			style: "",
			textStyle: "",
			lifeTime: "",
			color: ""
		};
		// 简单验证后，若没有问题，则直接转入线程2
		// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
		if (typeof config.rooms[room] == 'undefined') {
			return res.end("房间信息错误！");
		}
		if (filter.checkBlock(room, hash, req.body.text)) {
			log.log("拦截 " + hash + " - " + req.body.text.substr(0, 10) + "...");
			return res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
		} else {
			if (!config.rooms[room].openstate) {
				return res.end("发送成功！但当前弹幕处于关闭状态，不能显示。");
			} else {
				if (req.body.type == "advanced") {
					if (req.body.password != config.rooms[room].advancedpassword) {
						return res.end("高级弹幕密码错误！");
					}
					danmuData.style = req.body.style;
					danmuData.textStyle = req.body.textStyle;
					danmuData.lifeTime = req.body.lifeTime;
					danmuData.color = req.body.color;
				}
				coordinator.emit("gotDanmu", danmuData);
				res.end("发送成功！");
			}
		}
	});

};