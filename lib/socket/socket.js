(function() {
	var io = null;
	module.exports = {
		init: function(obj) {
			io = obj;
			initIO();
		}
	}

	var initIO = function() {
		io.on("connection", function(socket) {
			// 向客户端推送密码请求
			socket.emit("init", "Require Password.");
			socket.on("password", function(data) {
				var room = data.room;
				if (typeof config.rooms[room] == "undefined") {
					socket.emit("init", "Room Not Found");
					return false;
				}
				if (data.password == config.rooms[room].managepassword) {
					socket.join(room);
					socket.emit("connected", "Hello World");
				} else {
					socket.emit("init", "Password error");
				}
			});
		});
	};
})();