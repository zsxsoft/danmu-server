/// <reference path="../../typings/main.d.ts" />
'use strict';
let crypto = require('crypto');
let async = require('async');
let config = require('../../config');

let md5 = text => crypto.createHash('md5').update(text).digest('hex');
let getHash = (ip, userAgent, hashCode) => md5(`IP=${ip}\nUA=${userAgent}\nHC=${hashCode}`);
let getTime = () => {
	let d = new Date();
	return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
}
let buildConfigToArray = room => {
	return {
		replaceKeyword: config.rooms[room].keyword.replacement.source,
		blockKeyword: config.rooms[room].keyword.block.source,
		ignoreKeyword: config.rooms[room].keyword.ignore.source,
		maxlength: config.rooms[room].maxlength,
		socketinterval: config.websocket.interval,
		socketsingle: config.websocket.singlesize,
	};
}
let parseLifeTime = data => {
	let imageMatches = data.text.match(config.rooms[data.room].image.regex);
	let imageLength = imageMatches === null ? 0 : imageMatches.length;
	return (Math.trunc(data.text.length / 10)) * 60 + config.rooms[data.room].image.lifetime * imageLength;
}
// 全局工具
module.exports = {
	md5,
	getHash,
	getTime,
	buildConfigToArray, 
	parseLifeTime,
};
