(function() {

	// 全局过滤器模块
	var FilterBuilder = function() {
		this.blockRegExp = {};
		this.replaceRegExp = {};
	};
	FilterBuilder.prototype.initRegExp = function() {
		for (var room in config.rooms) {
			this.blockRegExp[room] = new RegExp(config.rooms[room].keyword.block, "ig");
			this.replaceRegExp[room] = new RegExp(config.rooms[room].keyword.replacement, "ig");
		}
	}
	FilterBuilder.prototype.checkBlock = function(room, hash, str) {
		return config.rooms[room].blockusers.indexOf(hash) > -1 || this.blockRegExp[room].test(str);
	}
	FilterBuilder.prototype.replaceKeyword = function(room, str) {
		return str.replace(this.replaceRegExp[room], "***");
	}

	global.filter = new FilterBuilder();

	// 更新正则缓存
	coordinator.on("configUpdated", function() {
		filter.initRegExp();
	});
})();