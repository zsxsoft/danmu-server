/* global coordinator */
/* global log */
/* global config */
"use strict";
var io;
module.exports = {
	init: function (callback) {

		// 推送弹幕
		coordinator.on("danmuDelete", (data) => {
			Object.keys(data).forEach((room) => {
				io.to(room).emit("delete", data[room]);
			});
		});
		// 删除弹幕
		coordinator.on("danmuTransfer", (data) => {
			io.to(data.room).emit("danmu", data);
		});


		// 当服务器创建后，绑定WebSocket
		coordinator.on("httpCreated", (app) => {
			io = require("socket.io")(app);
			io.on("connection", (socket) => {
				// 向客户端推送密码请求
				socket.emit("init", "Require Password.");
				log.log("检测到客户端" + socket.id + "连接");
				socket.on("password", (data) => {
					let room = data.room;
					if (!config.rooms[room]) {
						socket.emit("init", "Room Not Found");
						log.log(socket.id + "试图加入未定义房间");
						return false;
					}
					if (data.password != config.rooms[room].connectpassword) {
						socket.emit("init", "Password error");
						return false;
					}
					if (!data.info) {
						log.log("该版本弹幕客户端过老，请更新弹幕客户端。");
						return false;
					}
					socket.join(room);
					socket.emit("connected", {
						version: version
					});
					log.log(socket.id + "加入" + room);
				});
			});
		});

		callback(null);
	}
};
