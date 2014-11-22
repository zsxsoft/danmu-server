exports.config = {};
exports.lang = {};

exports.index = function(req, res){
	res.render('index', {
		title: exports.lang.global.client,
		lang: exports.lang
	});
};