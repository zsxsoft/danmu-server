/* global config */
'use strict';
module.exports = function (app) {
	function renderIndex(advanced) {
		let keys = Object.keys(config.rooms);
		let permissions = {};
		keys.forEach(item =>permissions[item] = config.rooms[item].permissions);
		return {
			config: config,
			advanced: advanced,
			roomKeys: keys,  
			permissions: permissions, 
		}
	}

	app.route("/*").all((req, res, next)=> {
		res.append('Server', 'zsx\'s Danmu Server');
		for (let item in config.http.headers) {
			res.append(item, config.http.headers[item]);
		}
		next();
	});


	app.get("/", (req, res) => {
		res.render('index', renderIndex(false));
	});

	app.get("/advanced", (req, res) => {
		res.render('index', renderIndex(true));
	});

	app.post((req, res, next)=> {
		res.header("Content-Type", "text/html; charset=utf-8");
		next();
	});

};
