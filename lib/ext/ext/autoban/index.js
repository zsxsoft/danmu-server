/* global log */
/* global cache */
/// <reference path="../../../../typings/node/node.d.ts"/>
/* global config */
/* global filter */
'use strict';
let listener = require('../../../utils/event');
let filter = require('../../../utils/filter');
module.exports = function () {
	// 弹幕被拦截达到一定次数后封号
	listener.on("banDanmu", function (danmuData) {

		process.nextTick(function () {

			if (filter(danmuData.room).checkUserIsBlocked(danmuData.hash)) return;

			cache.get("block_" + danmuData.hash, function (err, data) {
				if (err !== null && typeof err !== "undefined") {
					log.log("封禁用户查询失败");
					console.log(err);
					data = 0;
				} else if (typeof data === "undefined") {
					data = 0;
				} else {
					data = parseInt(data);
					data++;
				}
				log.log("自动封号检测" + danmuData.hash + "次数为" + data);


				if (data >= config.ext.autoban.block) { // 开始封号
					config.rooms[danmuData.room].blockusers.push(danmuData.hash);
					log.log("自动封号" + danmuData.hash);
					listener.emit("configUpdated");
				} else {
					cache.set("block_" + danmuData.hash, data, 60 * 60 * 3, function (err, data) {

					});
				}
			});

		});
	});
};
