var exports = module.exports = {};
exports.console = console;
exports.io = null;
exports.sql = null;
exports.socketFunctions = [];
exports.config = [];
exports.lang = {};
exports.barrageList = [];
exports.setConsole = function(object) {
	this.console = object;
	return this;
}
exports.setLang = function(object) {
	this.lang = object;
	return this;
}
exports.rebuildConfig = function(object) {
	this.config = object;
	return this;
};
exports.sendBarrageToReceivers = function(requestId, dataId, requestData) {
	var countReceiver = 0;
	for (var o in this.io.sockets.adapter.rooms.receiver) {
		countReceiver++;
		break;
	}
	if (countReceiver > 0) {
		this.io.sockets.in('receiver').emit('barrage', this.barrageList);
		this.barrageList = [];
		console.success("弹幕发送到了" + countReceiver + "个接收器");
	}
	return this;

};
exports.bindServer = function(server) {
	var me = this,
		io = this.io = require('socket.io').listen(server);
	
	io.sockets.on('connection', function (socket) {
		socket.emit('whoami', 'Who are you?');
		socket.on('whoami', function (data) {
			socket.join(data);
			me.socketFunctions[data].call(me, io, socket);
		});
	});
	return this;

};
exports.bindEvent = function(moduleName) {
	var module = require('./socket/' + moduleName).e,
		me = this;
	me.socketFunctions[moduleName] = module;
	return this;
}

exports.logConsole = function(queue) {
	this.console.info(this.lang.console.requestCreated.replace("%s%", queue.id) + JSON.stringify(queue.data));
}