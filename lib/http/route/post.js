/* global filter */
/* global coordinator */
/* global log */
/* global config */
/* global utils */
module.exports = function (app) {

	app.post("/post", function (req, res) {
		// 计算用户唯一身份识别信息
		var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
		var room = req.body.room;
		var danmuData = {
			hash: hash,
			room: room,
			text: req.body.text,
			ip: req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip,
			ua: req.headers['user-agent'],
			style: "",
			textStyle: "",
			lifeTime: "",
			color: "",
		};

		// 简单验证后，若没有问题，则直接下一步
		// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
		if (typeof config.rooms[room] == 'undefined') {
			return res.end("房间信息错误！");
		}
		
		// 等所有异步逻辑都执行完毕之后再进行下一步操作
		// 如果这里用setTimeout 0的话就方便很多了，但是在这种入口用红黑树，效率太低了
		coordinator.emitAsync("getDanmu", req, res, danmuData, function () {
			if (filter.checkBlock(danmuData.room, danmuData.hash, req.body.text)) {
				log.log("拦截 " + hash + " - " + req.body.text.substr(0, 10) + "...");
				coordinator.emit("banDanmu", danmuData);
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
					if (danmuData.text.length > config.rooms[room].textlength) {
						return res.end("弹幕长度大于" + config.rooms[room].textlength + "个字，可能影响弹幕观感，请删减。");
					}
					res.end("发送成功！");
					coordinator.emit("gotDanmu", danmuData);
				}
			}
		});
	});

};