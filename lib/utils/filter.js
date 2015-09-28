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

	Object.keys(config.rooms).map(function (room) {
		// 加入警告
		if (typeof config.rooms[room].keyword.block == "string") {
			console.error("请升级你的配置，将所有字符串类型关键词转换为正则类型关键词。");
			throw "Init RegExp Error";
		}
		this.blockRegExp[room] = config.rooms[room].keyword.block;
		this.replaceRegExp[room] = config.rooms[room].keyword.replacement;
		this.ignoreRegExp[room] = config.rooms[room].keyword.ignore;

	}.bind(this));
};
FilterBuilder.prototype.checkUserBlock = function (room, hash) {
	return (config.rooms[room].blockusers.indexOf(hash)) > -1;
};
FilterBuilder.prototype.checkBlock = function (room, hash, str) {
	var testStr = str.replace(this.ignoreRegExp[room], "");
	if (this.checkUserBlock(room, hash)) return true;

	var ret = this.blockRegExp[room].test(testStr);
	this.blockRegExp[room].lastIndex = 0; // 把其flag恢复，否则index始终在最后，会导致下一次判断出错。
	return ret;
};
FilterBuilder.prototype.replaceKeyword = function (room, str) {
	return str.replace(this.replaceRegExp[room], "***");
};

global.filter = new FilterBuilder();
// 更新正则缓存
coordinator.on("configUpdated", function () {
	filter.initRegExp();
});
