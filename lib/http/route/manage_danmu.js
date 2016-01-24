/* global coordinator */
/* global log */
/* global config */
"use strict";
module.exports = function (app) {

	app.post("/manage/danmu/delete/", function (req, res) {

		req.body.hash = req.body.hash || "";
		req.body.id = req.body.id || 0;
		req.body.room = req.body.room || "";

		if (req.body.id == 0) {
			res.end({});
			return;
		}

		let deleteObject = {};
		deleteObject[req.body.room] = {
			ids: [req.body.id], 
			hashs: [req.body.hash],
		};
		coordinator.emit("danmuDelete", deleteObject);

		if (req.body.hash !== "") {
			config.rooms[req.body.room].blockusers.push(req.body.hash);
			log.log("封禁用户" + req.body.hash + "成功");
			coordinator.emit("configUpdated");
		}

		log.log("删除弹幕 " + req.body.id + " 成功");
		res.end('{"error": "删除弹幕成功"}');
	});


};
