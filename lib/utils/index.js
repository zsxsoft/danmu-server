(function() {
	var crypto = require('crypto');
	require("./filter");

	// 全局日志
	global.log = {
		log: function(text) {
			console.log("[" + utils.getTime() + "] " + text);
		}
	};

	// 全局工具
	global.utils = {
		md5: function(text) {
			return crypto.createHash('md5').update(text).digest('hex');
		},
		getTime: function() {
			var d = new Date();
			return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
		},
		getHash: function(ip, userAgent, hashCode) {
			var str = [
				"IP=" + ip,
				"UA=" + userAgent,
				"HC=" + hashCode
			].join("\n");
			return utils.md5(str);
		},
		buildConfigToArray: function(room) {
			return {
				replaceKeyword: config.rooms[room].keyword.replacement,
				blockKeyword: config.rooms[room].keyword.block,
				maxlength: config.rooms[room].maxlength,
				socketinterval: config.websocket.interval,
				socketsingle: config.websocket.singlesize
			};
		}
	};
})();