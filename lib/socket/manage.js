exports.e = function(io, socket) {
	var self = this;
	self.console.info(this.lang.console.clientConnected.replace("%c%", this.lang.global.manage).replace("%d%", socket.id));

	socket.on('keyword', function(data){
		try {
			var regEx = new RegExp(data, "ig");
			self.keyword = regEx;
			self.config.manage.keyword = data;
			socket.emit('result', 'OK');
			self.console.success(self.lang.console.gotKeyword.replace("%d%", data));
		} catch (e) {
			self.console.error(self.lang.console.gotErrKeyword.replace("%d%", data));
			socket.emit('result', e.toString())
		}
		
	});	
}