/* global coordinator */
var passport = require('passport');
var PassportSina = require('passport-sina');

passport.serializeUser(function (user, callback) {
    callback(null, user);
});

passport.deserializeUser(function (obj, callback) {
    callback(null, obj);
});

passport.use(new PassportSina({
	clientID: '3307364434',
	clientSecret: 'dcfc72bd617395c1aa69edbe9a02434c',
	callbackURL: '/auth/sina/callback'
},
    function (accessToken, refreshToken, profile, callback) {
        process.nextTick(function () {
            return callback(null, profile);
        });
    })
	);

module.exports = function () {

	coordinator.on("httpBeforeRoute", function (app) {
		app.use(function (req, res, next) {
			console.log(req);
		});
	});
}