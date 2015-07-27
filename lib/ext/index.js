/* global log */
/* global async */
var fs = require('fs');
var path = require('path');
module.exports.init = function(callback) {

	for (var name in config.ext) {
		log.log("加载扩展组件：" + name);
		require(path.join(__dirname, "./ext/", name))();
	}
	log.log("扩展组件加载完成");
	callback(null);

};