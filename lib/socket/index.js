(function() {
	var websocket = require("./socket");
	var io;
	module.exports = {
		init: function(callback) {

			// 推送弹幕
			coordinator.on("danmuTransfer", function(data) {
				io.to("client").emit("danmu", data);
			});

			// 当服务器创建后，推送到子线程绑定WebSocket
			coordinator.on("httpCreated", function(app) {
				io = require("socket.io")(app);
				websocket.init(io);
			});
			
			callback(null);
		}
	};
})();