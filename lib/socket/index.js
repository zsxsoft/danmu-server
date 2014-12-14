exports.e = function(io, socket) {
	var self = this;
	self.console.info(this.lang.console.clientConnected.replace("%c%", this.lang.global.index).replace("%d%", socket.id));
	socket.on('barrage', function(data){

		data = data.replace(self.keyword, "**");
		self.barrageList.push({
			style: "Scroll",
			text: data,
			color: "white",
			lifeTime: (parseInt(Math.random() * 10) + data.length % 10) * 60
		});
		socket.emit('result', data);
		self.console.success(self.lang.console.gotBarrage.replace("%d%", data));


		self.sendBarrageToReceivers();
	});	
}