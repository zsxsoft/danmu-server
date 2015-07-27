/* global async */
/* global config */
/* global log */
/* global coordinator */
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
	var asyncList = [];
	for (var room in config.rooms) {
		asyncList.push(room);
	}
	async.each(asyncList, function(room) {
		connection.query('SELECT MAX(danmu_id) FROM `' + config.rooms[room].table + '`', function(err, rows) {
			if (err !== null) {
				log.log("Creating Table...");
				connection.query(createTableSql.replace(/%table%/g, config.rooms[room].table), function(err, rows) {
					callback(err);
				});
			} else {
				callback(null);
			}
		});
	});
};

module.exports = {
	init: function(callback) {
		connection = mysql.createConnection({
			host: config.database.server,
			user: config.database.username,
			password: config.database.password,
			port: config.database.port,
			database: config.database.db,
			//debug: true
		});
		connection.connect(function(err) {
			if (err !== null) {
				log.log("数据库连接出错");
				console.log(err);
			} else {
				log.log("数据库连接正常");
				createDatabase(function(err) {
					callback(err);
				});
			}
		});
		connection.on('error', function(err) {
			if (err.errno != 'ECONNRESET') {
				throw err;
			} else {
				//do nothing
			}
		});

		coordinator.on("gotDanmu", function(data) {

			var room = data.room;
			connection.query("INSERT INTO `%table%` (danmu_user, danmu_text, danmu_publish, danmu_ip, danmu_useragent) VALUES (?, ?, ?, ?, ?)".replace("%table%", config.rooms[room].table), [
				data.hash, data.text, Math.round(new Date().getTime() / 1000), data.ip, data.ua
			], function(err, rows) {
				if (err !== null) {
					log.log("数据库写入出错");
					console.log(err);
				}
			});
		});

		coordinator.on("searchDanmu", function(data) {

			var room = data.room;
			connection.query('SELECT * from `%table%` where `danmu_text` LIKE ? LIMIT 20'.replace("%table%", config.rooms[room].table), [
				'%' + data.key + '%'
			], function(err, rows) {
				if (err === null) {
					var ret = [];
					ret = JSON.stringify(rows).replace(/"danmu_/g, '"');
					coordinator.emit("gotSearchDanmu", ret);
				} else {
					log.log("数据库搜索出错");
					console.log(err);
					coordinator.emit("gotSearchDanmu", "[]");
				}

			});
		});
	}
};