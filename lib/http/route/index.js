/* global config */
module.exports = function (app) {
	function renderIndex(advanced) {
		var keys = Object.keys(config.rooms);
		var permissions = {};
		keys.map(function(item) {
		    permissions[item] = config.rooms[item].permissions;
		});
		return {
			config: config,
			advanced: advanced,
			roomKeys: keys,  
			permissions: permissions
		}
	}

	app.route("/*").all(function (req, res, next) {
		res.append('Server', 'zsx\'s Danmu Server');
		for (var item in config.http.headers) {
			res.append(item, config.http.headers[item]);
		}
		next();
	});


	app.get("/", function (req, res) {
		res.render('index', renderIndex(false));
	});

	app.get("/advanced", function (req, res) {
		res.render('index', renderIndex(true));
	});

	app.post(function (req, res, next) {
		res.header("Content-Type", "text/html; charset=utf-8");
		next();
	});

};
