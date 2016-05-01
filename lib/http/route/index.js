/// <reference path="../../../typings/main.d.ts" />
'use strict';

let config = require('../../../config');

module.exports = function (app) {
	// Initialize Hostname Map
	let hostnameMap = new Map();
	Object.keys(config.rooms).forEach(room => config.rooms[room].hostname.forEach(value => hostnameMap.set(value, room)));

	function getRoom(hostname) {
		return (hostnameMap.has(hostname)) ? hostnameMap.get(hostname) : null;
	}

	function renderIndex(advanced, room) {
		console.log(room)
		let permission = config.rooms[room].permissions;
		return {
			config,
			advanced,
			room,
			permission,
		}
	}

	app.route("/*").all((req, res, next) => {
		res.append('Server', 'zsx\'s Danmu Server');
		req.room = getRoom(req.hostname);
		for (let item in config.http.headers) {
			res.append(item, config.http.headers[item]);
		}
		if (req.room === null) {
			res.status(403);
			res.end("403 Forbidden");
		}
		next();
	});


	app.get("/", (req, res) => {
		res.render('index', renderIndex(false, req.room));
	});

	app.get("/advanced", (req, res) => {
		res.render('index', renderIndex(true, req.room));
	});

	app.post((req, res, next) => {
		res.header("Content-Type", "text/html; charset=utf-8");
		next();
	});

};
