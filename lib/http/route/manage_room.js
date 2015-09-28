/* global coordinator */
/* global log */
/* global config */
module.exports = function (app) {

	app.post("/manage/room/get/", function (req, res) {
		var ret = [];
		Object.keys(config.rooms).map(function (room) {
			ret.push({
				id: room,
				display: config.rooms[room].display
			});
		});
		log.log("已把房间信息向管理页面下发");
		res.end(JSON.stringify(ret));
	});

};
