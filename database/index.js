(function() {
	var mysql = require("mysql");
	var connection = null;
	var createTableSql = [
		"CREATE TABLE IF NOT EXISTS `%table%` (",
		"danmu_id int(11) NOT NULL AUTO_INCREMENT,",
		"danmu_user varchar(255) NOT NULL DEFAULT '',",
		"danmu_text text NOT NULL,",
		"danmu_publish int(11) NOT NULL DEFAULT '0',",
		"danmu_ip varchar(255) NOT NULL DEFAULT '',",
		"danmu_useragent text NOT NULL,",
		"PRIMARY KEY (danmu_id),",
		"KEY danmu_TPISC (danmu_publish)",
		") ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;"
	].join("\n");

	var createDatabase = function(callback) {
		connection.query('SELECT 1 FROM `' + config.database.table + '`', function(err, rows) {
			if (err !== null) {
				log.log("Creating Table...");
				connection.query(createTableSql.replace(/%table%/g, config.database.table), function(err, rows) {
					callback(err);
				});
			} else {
				callback(null);
			}
		});
	};

	module.exports = {
		init: function(callback) {
			connection = mysql.createConnection({
				host: config.database.server,
				user: config.database.username,
				password: config.database.password
			});
			connection.connect(function() {
				connection.query('USE ' + config.database.db, function(err, rows) {
					if (err !== null) {
						callback(err);
						return;
					}
					createDatabase(function(err) {
						callback(err);
					});
				});
			});

			coordinator.on("danmuTransfer", function(data) {
				connection.query("INSERT INTO `%table%` (danmu_user, danmu_text, danmu_publish, danmu_ip, danmu_useragent) VALUES (?, ?, ?, ?, ?)".replace("%table%", config.database.db), [
					data.data.hash, data.data.text, Math.round(new Date().getTime() / 1000), data.data.ip, data.data.ua
				]);
			});
		}
	};

})();