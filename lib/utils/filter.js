/* global config */
/* global coordinator */
/* global filter */


// 全局过滤器模块
var FilterBuilder = function () {
	this.blockRegExp = {};
	this.replaceRegExp = {};
	this.ignoreRegExp = {};
};
FilterBuilder.prototype.initRegExp = function () {
	for (var room in config.rooms) {
		this.blockRegExp[room] = new RegExp(config.rooms[room].keyword.block, "ig");
		this.replaceRegExp[room] = new RegExp(config.rooms[room].keyword.replacement, "ig");
		this.ignoreRegExp[room] = new RegExp(config.rooms[room].keyword.ignore, "ig");
	}
}
FilterBuilder.prototype.checkBlock = function (room, hash, str) {
	var testStr = str.replace(this.ignoreRegExp[room], "");
	var ret = (config.rooms[room].blockusers.indexOf(hash) > -1 || this.blockRegExp[room].test(testStr));
	this.blockRegExp[room].lastIndex = 0; // 把其flag恢复，否则index始终在最后，会导致下一次判断出错。
	return ret;
}
FilterBuilder.prototype.replaceKeyword = function (room, str) {
	return str.replace(this.replaceRegExp[room], "***");
}

global.filter = new FilterBuilder();

// 更新正则缓存
coordinator.on("configUpdated", function () {
	filter.initRegExp();
});
