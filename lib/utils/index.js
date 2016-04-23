/* global utils */
'use strict';
let crypto = require('crypto');
let util = require('util');
let events = require('events');
global.async = require("async");

// EventEmitter继承
let EventEmitter = function () {
	events.EventEmitter.call(this);
};
util.inherits(EventEmitter, events.EventEmitter);
EventEmitter.prototype.emitAsync = function (type) { // 目前的emit是Sync的
	let self = this;
	let callback = arguments[arguments.length - 1];
	let len, args, listeners, i, handler;
	handler = this._events[type];
	len = arguments.length;
	args = new Array(len - 2);
	for (i = 1; i < len; i++)
		args[i - 1] = arguments[i];

	setImmediate(() => {
		// 不需要太复杂的功能，只需要能apply就行

		if (util.isUndefined(handler)) {
			callback(null);
		} else if (util.isFunction(handler)) {
			args.push(function () {
				callback.apply(self, arguments);
			});
			handler.apply(self, args);
		} else {
			listeners = handler.slice();
			len = listeners.length;
			async.map(listeners, function (item, cb) {
				args.push(callback);
				item.apply(self, args);
				args.pop();
			}, callback);
		}
	});

};
global.coordinator = new EventEmitter();


require("./filter");

// 全局日志
global.log = {
	log: function (text) {
		console.log("[" + utils.getTime() + "] " + text);
	},
};

// 全局工具
global.utils = {
	md5: text => crypto.createHash('md5').update(text).digest('hex'),
	getTime: function () {
		let d = new Date();
		return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
	},
	getHash: (ip, userAgent, hashCode) => utils.md5([
		"IP=", ip,
		"UA=", userAgent,
		"HC=", hashCode,
	].join("\n")),
	buildConfigToArray: room => {
		return {
			replaceKeyword: config.rooms[room].keyword.replacement.source,
			blockKeyword: config.rooms[room].keyword.block.source,
			ignoreKeyword: config.rooms[room].keyword.ignore.source,
			maxlength: config.rooms[room].maxlength,
			socketinterval: config.websocket.interval,
			socketsingle: config.websocket.singlesize,
		};
	},
	parseLifeTime: function (data) {
		let imageMatches = data.text.match(config.rooms[data.room].image.regex);
		let imageLength = imageMatches === null ? 0 : imageMatches.length;
		return (Math.trunc(data.text.length / 10)) * 60 + config.rooms[data.room].image.lifetime * imageLength;
	},
};
