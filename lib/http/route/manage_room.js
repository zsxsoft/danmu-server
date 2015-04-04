module.exports = function(app) {

	app.post("/manage/room/get/", function(req, res) {
		var ret = [];
		for (var room in config.rooms) {
			ret.push({
				id: room,
				display: config.rooms[room].display
			});
		}
		log.log("已把房间信息向管理页面下发");
		res.end(JSON.stringify(ret));
	});
	
};