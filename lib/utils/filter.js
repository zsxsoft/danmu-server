/* global config */
'use strict';
let listener = require('./event');
let _ = require('ramda');
let cachedFilters = {};

let checkUserIsBlocked = _.curry((room, blockUsers, hash) => {
	return (blockUsers.indexOf(hash)) > -1;
});
let validateText = _.curry((room, ignoreRegEx, checkRegEx, str) => {
	checkRegEx.lastIndex = 0;
	let testStr = str.replace(ignoreRegEx, "");
	return !checkRegEx.test(testStr);
});
let replaceKeyword = _.curry((room, regex, str) => {
	return str.replace(regex, "***");
});


function initialize(roomName, forceUpdate) {
	if (cachedFilters[roomName] && !forceUpdate) {
		return cachedFilters[roomName];
	}
	let room = config.rooms[roomName];
	if (typeof room.keyword.block === "string") {
		console.error("请升级你的配置，将所有字符串类型关键词转换为正则类型关键词。");
		throw "Init RegExp Error";
	}
	let ret = {
		checkUserIsBlocked: checkUserIsBlocked(roomName)(room.blockusers),
		validateText: validateText(roomName)(room.keyword.ignore)(room.keyword.block),
		replaceKeyword: replaceKeyword(roomName)(room.keyword.replacement),
	};
	cachedFilters[roomName] = null; // Release Memory
	cachedFilters[roomName] = ret;
	console.log("Inited: " + roomName);
	console.log(room);
	return ret;
};

// 正则缓存更新
listener.on("configUpdated", () => {
	Object.keys(config.rooms).forEach(room => initialize(room, true));
});
module.exports = initialize;