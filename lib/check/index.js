(function() {
	module.exports = {
		init: function(callback) {
			coordinator.on("httpCreated", function(app) {
				// 创建关于弹幕审核器的路由
			});
			coordinator.on("gotDanmu", function(data) {
				coordinator.emit("danmuBeforeTransfer", data);
			});

			callback(null);
		}
	};
})();