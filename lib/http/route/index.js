/* global config */
module.exports = function(app) {

	app.route("/*").all(function(req, res, next) {
		res.append('Server', 'zsx\'s Danmu Server');
		for (var item in config.http.headers) {
			res.append(item, config.http.headers[item]);
		}
		next();
	});

	app.get("/", function(req, res) {
		res.render('index', {
			config: config
		});
	});

	app.get("/advanced", function(req, res) {
		res.render('advanced', {
			config: config
		});
	});

	app.post(function(req, res, next) {
		res.header("Content-Type", "text/html; charset=utf-8");
		next();
	});

};