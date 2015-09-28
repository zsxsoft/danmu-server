/* global filter */
/* global coordinator */
/* global log */
/* global config */
/* global utils */
var permissions = ["color", "style", "height", "lifeTime", "textStyle"]; // 为了不foreach

module.exports = function (app) {

	app.post("/post", function (req, res) {
		// 请求合法性校验
		req.body.hash = req.body.hash || "";
		req.body.room = req.body.room || "";
		req.body.text = req.body.text || "";
		req.body.type = req.body.type || "";
		req.body.password = req.body.password || "";

		// 计算用户唯一身份识别信息
		var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
		var room = req.body.room;
		var danmuData = {
			hash: hash,
			room: room,
			text: req.body.text,
			ip: req.ip, // 如果使用CDN就要开启后面这东西  //req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip,
			ua: req.headers['user-agent'],
			style: "",
			textStyle: "",
			lifeTime: "",
			color: "",
			height: ""
		};

		if (req.body.text === "") {
			return res.end("弹幕不能为空");
		}
		if (!config.rooms[room]) {
			return res.end("房间信息错误！");
		}

		// 等所有异步逻辑都执行完毕之后再进行下一步操作
		// 如果这里用setTimeout 0的话就方便很多了，但是在这种入口用红黑树，效率太低了
		coordinator.emitAsync("getDanmu", req, res, danmuData, function () {

			var isAdvanced = false;
			if (!config.rooms[room].permissions.send) {
				return res.end("弹幕暂时被关闭");
			}
			if (req.body.type == "advanced") {
				if (req.body.password != config.rooms[room].advancedpassword) {
					return res.end("高级弹幕密码错误！");
				}
				isAdvanced = true;
			}
			if (!isAdvanced && danmuData.text.length > config.rooms[room].textlength) {
				return res.end("弹幕长度大于" + config.rooms[room].textlength + "个字，可能影响弹幕观感，请删减。");
			}
			// 通过关键词和用户是否被屏蔽判断是否允许发送
			if (filter.checkBlock(danmuData.room, danmuData.hash, req.body.text)) {
				log.log("拦截 " + hash + " - " + req.body.text);
				coordinator.emit("banDanmu", danmuData);
				return res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
			}

			permissions.map(function (val) {
				if (isAdvanced || config.rooms[room].permissions[val]) {
					danmuData[val] = req.body[val] || "";
				}
			});

			res.end("发送成功！");
			coordinator.emit("gotDanmu", danmuData);


		});
	});

};
