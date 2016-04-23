/* global coordinator */
/* global log */
/* global config */
'use strict';
module.exports = function (app) {

	app.post("/manage/search", function (req, res) {
		let room = req.body.room;

		log.log("尝试搜索" + req.body.key);
		coordinator.emit("searchDanmu", {
			key: req.body.key,
			room: room, 
		});
		coordinator.on("gotSearchDanmu", function (data) {
			log.log("搜索" + req.body.key + "成功");
			res.end(data);
		});
	});

};
