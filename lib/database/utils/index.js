(function() {
	var crypto = require('crypto');

	global.log = {
		log: function(text) {
			console.log("[" + utils.getTime() + "] " + text);
		}
	};
	module.exports = {
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
		}
	}
})();