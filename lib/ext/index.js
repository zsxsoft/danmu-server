/* global log */
/* global async */
var fs = require('fs');
var path = require('path');
module.exports.init = function (callback) {
	// 这里的逻辑要求不能异步，否则事件无法监听
	/*
	fs.readdir(path.join(__dirname, "./ext/"), function (err, files) {
		if (err !== null) {
			return callback(err);
		}
		async.each(files, function (filename, callback) {
			require(path.join(__dirname, "./ext", filename))();
		}, function(err) {
			log.log("扩展组件加载完成");
			callback(err);
		});
	});
	*/
	
	var files = fs.readdirSync(path.join(__dirname, "./ext"));
	files.forEach(function(filename, index) {
		require(path.join(__dirname, "./ext", filename))();
	});
	log.log("扩展组件加载完成");
	callback(null);
	
};