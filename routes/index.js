exports.config = {};
exports.lang = {};

exports.index = function(req, res){
	res.render('index', {
		title: exports.lang.global.client,
		lang: exports.lang
	});
};

exports.manage = function(req, res){
	res.render('manage', {
		title: exports.lang.global.manage,
		lang: exports.lang,
		config: exports.config
	});
};