/* global coordinator */
/* global log */
/* global config */
module.exports = function (app) {

	app.post("/manage/config/set/", function (req, res) {
		var room = req.body.room || "";
		config.rooms[room].keyword.replacement = new RegExp(req.body.replaceKeyword, "ig");
		config.rooms[room].keyword.block = new RegExp(req.body.blockKeyword, "ig");
		config.rooms[room].keyword.ignore = new RegExp(req.body.ignoreKeyword, "ig");
		config.rooms[room].maxlength = req.body.maxlength;
		config.rooms[room].openstate = req.body.openstate;
		config.websocket.interval = req.body.socketinterval;
		config.websocket.singlesize = req.body.socketsingle;

		var newConfig = JSON.stringify(utils.buildConfigToArray(room));
		log.log("收到配置信息：" + newConfig);
		coordinator.emit("configUpdated");
		res.end(newConfig);
	});

	app.post("/manage/config/permissions/set/", function (req, res) {
		var room = req.body.room || "";
		Object.keys(config.rooms[room].permissions).map(function (item) {
			config.rooms[room].permissions[item] = !!req.body[item];
		});
		var newConfig = JSON.stringify(config.rooms[room].permissions);
		log.log("收到权限配置信息：" + newConfig);
		coordinator.emit("configUpdated");
		res.end(newConfig);
	});

	app.post("/manage/config/password/set/", function (req, res) {
		var type = req.body.type || "";
		var password = req.body.newPassword || "";
		var room = req.body.room || "";

		if (config.rooms[room][type]) {
			config.rooms[room][type] = password;
			log.log("房间（" + room + "）的" + type + "已更新为" + password);
		}
		coordinator.emit("configUpdated");
		res.end();
	});


	app.post("/manage/config/permissions/get/", function (req, res) {
		var room = req.body.room || "";
		log.log("已将权限配置向管理页面下发");
		res.end(JSON.stringify(config.rooms[room].permissions));
	});

	app.post("/manage/config/get/", function (req, res) {
		var room = req.body.room || "";
		log.log("已将配置向管理页面下发");
		res.end(JSON.stringify(utils.buildConfigToArray(room)));
	});

};
