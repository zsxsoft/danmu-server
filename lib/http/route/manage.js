'use strict';
let config = require('../../../config');

module.exports = function (app) {

	app.get("/manage", function (req, res) {
		res.render("manage", {
			config: config,
		});
	});

	// 总身份验证
	app.post("/manage/*", (req, res, next) => {
		if (/room\/get/.test(req.url)) {
			// 如果是房间下发则不验证身份
			return next();
		}
		let room = req.body.room;
		if (!config.rooms[room]) {
			res.status(404);
			return res.end('{"error": "房间错误"}');
		}
		if (config.rooms[room].managepassword !== req.body.password) {
			res.status(403);
			return res.end('{"error": "密码错误"}');
		}
		return next();

	});

};
