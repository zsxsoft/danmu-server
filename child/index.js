(function() {
	var childProcess = require("child_process");
	var child = null;

	module.exports = {
		init: function(callback) {
			// 在配置更新后更新子线程的配置
			coordinator.on("configUpdated", function(data) {
				child.send({
					method: "configUpdated",
					data: config
				});
			});

			// 当弹幕准备发送的时候，把弹幕推送到子线程
			coordinator.on("danmuBeforeTransfer", function(data) {
				child.send({
					method: "danmuTransfer",
					data: data
				});
			});

			// 当弹幕准备审核的时候，把弹幕推送到子线程使其可被审核页面接收
			coordinator.on("danmuBeforeCheck", function(data) {
				child.send({
					method: "danmuBeforeCheck",
					data: data
				});
			});

			child = childProcess.fork("./child/child.js");
			child.send({
				method: "init",
				data: config
			});

			child.on("message", function(m) {
				if (m.method == "init") {
					// 确认子进程创建成功
					callback(null);
				} else if (m.method == "danmu") {
					coordinator.emit("danmuTransfer", m.data);
				}
			});

		}
	}
})();