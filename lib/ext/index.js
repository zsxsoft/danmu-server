/// <reference path="../../typings/main.d.ts" />
'use strict';
let fs = require('fs');
let path = require('path');
let config = require('../../config');

module.exports.init = function (callback) {

	Object.keys(config.ext).map(function (name) {
		log.log("加载扩展组件：" + name);
		require(path.join(__dirname, "./ext/", name))();
	});
	log.log("扩展组件加载完成");
	callback(null);

};
