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
				if (data.password == config.manage.password) {
					socket.join(data.room);
					socket.emit("connected", "Hello World");
				} else {
					socket.emit("init", "Password error");
				}
			});
		});
	};
})();