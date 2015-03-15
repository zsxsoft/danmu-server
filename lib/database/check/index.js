(function() {
	module.exports = {
		init: function(callback) {
			if (config.danmu.check) {
				coordinator.on("httpCreated", function(app) {
					// 创建关于弹幕审核器的路由
				});

				coordinator.on("danmuChecked", function(data) {
					coordinator.emit("danmuBeforeTransfer", data);
				});
			}
			coordinator.on("gotDanmu", function(data) {
				if (config.danmu.check) {
					coordinator.emit("danmuBeforeCheck", data);
				} else {
					coordinator.emit("danmuBeforeTransfer", data);
				}
			});

			callback(null);
		}
	};
})();