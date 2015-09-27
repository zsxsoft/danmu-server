/* global utils */

var crypto = require('crypto');
var util = require('util');
var events = require('events');
global.async = require("async");

// EventEmitter继承
var EventEmitter = function () {
	events.EventEmitter.call(this);
};
util.inherits(EventEmitter, events.EventEmitter);
EventEmitter.prototype.emitAsync = function (type) { // 目前的emit是Sync的
	var self = this;
	var callback = arguments[arguments.length - 1];
	var len, args, listeners, i, handler;
	handler = this._events[type];
	len = arguments.length;
	args = new Array(len - 2);
	for (i = 1; i < len; i++)
		args[i - 1] = arguments[i];

	setImmediate(function () {
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
	}
};

// 全局工具
global.utils = {
	md5: function (text) {
		return crypto.createHash('md5').update(text).digest('hex');
	},
	getTime: function () {
		var d = new Date();
		return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
	},
	getHash: function (ip, userAgent, hashCode) {
		var str = [
			"IP=", ip,
			"UA=", userAgent,
			"HC=", hashCode
		].join("\n");
		return utils.md5(str);
	},
	buildConfigToArray: function (room) {
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
		var imageMatches = data.text.match(config.rooms[data.room].image.regex);
		var imageLength = imageMatches === null ? 0 : imageMatches.length;
		return (Math.trunc(data.text.length / 10)) * 60 + config.rooms[data.room].image.lifetime * imageLength;
	}
};
