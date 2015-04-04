module.exports = function(app) {

	app.post("/manage/config/set/", function(req, res) {
		var room = req.body.room;
		config.rooms[room].keyword.replacement = req.body.replaceKeyword;
		config.rooms[room].keyword.block = req.body.blockKeyword;
		config.rooms[room].maxlength = req.body.maxlength;
		config.websocket.interval = req.body.socketinterval;
		config.websocket.singlesize = req.body.socketsingle;
		coordinator.emit("configUpdated");
		res.end(JSON.stringify(utils.buildConfigToArray(room)));
	});

	app.post("/manage/config/get/", function(req, res) {
		var room = req.body.room;
		log.log("已将配置向管理页面下发");
		res.end(JSON.stringify(utils.buildConfigToArray(room)));
	});

};