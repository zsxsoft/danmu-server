(function() {
	var io = null;
	module.exports = {
		init: function(obj) {
			io = obj;
			initIO();
		}
	};

	var initIO = function() {
		io.on("connection", function(socket) {
			// 向客户端推送密码请求
			socket.emit("init", "Require Password.");
			log.log("检测到客户端" + socket.id + "连接");
			socket.on("password", function(data) {
				var room = data.room;
				if (typeof config.rooms[room] == "undefined") {
					socket.emit("init", "Room Not Found");
					log.log(socket.id + "试图加入未定义房间");
					return false;
				}
				if (data.password == config.rooms[room].connectpassword) {
					socket.join(room);
					socket.emit("connected", {
						version: version
					});
					log.log(socket.id + "加入" + room);
				} else {
					socket.emit("init", "Password error");
				}
			});
		});
	};
})();