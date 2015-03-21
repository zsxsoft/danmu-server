(function() {
	var websocket = require("./socket");
	var io;
	module.exports = {
		init: function(callback) {

			coordinator.on("gotDanmu", function(data) {
				//coordinator.emit("danmuTransfer", data);
			});
			// 推送弹幕
			coordinator.on("danmuTransfer", function(data) {
				io.to(data.room).emit("danmu", data);
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