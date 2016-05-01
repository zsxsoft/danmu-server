/// <reference path="../../typings/main.d.ts" />
'use strict';
module.exports = {
	init: function (callback) {
		require("./" + config.database.type + ".js").init(function () {
			callback.apply(this, arguments);
		});
	}, 
};
