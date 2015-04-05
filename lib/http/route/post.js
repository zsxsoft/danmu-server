module.exports = function(app) {

	app.post("/post", function(req, res) {
		// 计算用户唯一身份识别信息
		var hash = utils.getHash(req.ip, req.headers['user-agent'], req.body.hash);
		var room = req.body.room;
		// 简单验证后，若没有问题，则直接转入线程2
		// 得到弹幕发送请求后，通过关键词和用户是否被屏蔽判断是否允许发送
		if (typeof config.rooms[room] == 'undefined') {
			res.end("房间信息错误！");
			return;
		}
		if (filter.checkBlock(room, hash, req.body.text)) {
			log.log("拦截 " + hash + " - " + req.body.text.substr(0, 10) + "...");
			res.end("发送失败！\n请检查你发送的弹幕有无关键词，或确认自己未被封禁。");
		} else {
			res.end("发送成功！");
			coordinator.emit("gotDanmu", {
				hash: hash,
				room: room,
				text: req.body.text,
				style: req.body.style || "",
				textStyle: req.body.textStyle || "",
				lifeTime: req.body.lifeTime || "",
				color: req.body.color || "",
				ip: req.ip,
				ua: req.headers['user-agent']
			});
		}
	});
	
};