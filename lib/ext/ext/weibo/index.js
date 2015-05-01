/* global cache */
/// <reference path="../../../../typings/async/async.d.ts"/>
/// <reference path="../../../../typings/node/node.d.ts"/>
/* global config */
/* global coordinator */
/* global log */
/* global utils */
var passport = require('passport');
var PassportSina = require('passport-sina');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');

/*
passport.serializeUser(function (user, callback) {
    callback(null, user);
});

passport.deserializeUser(function (obj, callback) {
    callback(null, obj);
});
*/
passport.use(new PassportSina(config.ext.weibo,
    function (accessToken, refreshToken, profile, callback) {
        process.nextTick(function () {
            return callback(null, {
                accessToken: accessToken,
                profile: profile
            });
        });
    })
    );

module.exports = function () {
    
    coordinator.on("httpBeforeRoute", function (app) {
        app.use(session({
            secret: config.http.sessionKey,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }
        }));
        app.use(passport.initialize());
        app.use(cookieParser());
        app.get('/auth/sina', passport.authenticate('sina', { session: false }));
        app.get('/auth/sina/callback', function (req, res, next) {
            passport.authenticate('sina', { session: false }, function (err, data) {
                if (err !== null) {
                    console.log(err);
                    res.redirect("/");
                }
                var hash = utils.getHash(data.profile.id, data.profile.name, data.profile.created_at);
                cache.set('weibo_' + hash, JSON.stringify({
                    accessToken: data.accessToken,
                    name: data.profile.name,
                    id: data.profile.id,
                    nick: data.profile.screen_name
                }), 24 * 60 * 60, function (err, data) {
                    // Do nothing..
                    // But it's necessary.....
                    // Damn
                });
                res.cookie("weibo", hash, { maxAge: 24 * 60 * 60 * 1000 });
                log.log("用户" + data.profile.id + "(" + data.profile.name + ")登录(" + hash + ")");
                res.redirect("/");
            })(req, res, next);
        });
        app.use(function (req, res, next) {
            // 这里用来给req添加函数
            req.getSina = function (callback) {
                if (typeof req.cookies.weibo != "undefined") {
                    cache.get("weibo_" + req.cookies.weibo, function (err, data) {
                        if (err !== null && typeof err != "undefined") {
                            callback(err, false);
                        } else if (typeof data == "undefined") {
                            callback(null, false);
                        } else {
                            callback(null, JSON.parse(data));
                        }
                    });
                } else {
                    callback(null, false);
                }

            };
            next();
        });

        // 未登录时直接跳转到新浪微博
        app.get("/", function (req, res, next) {
            async.waterfall([
                function (callback) {
                    req.getSina(callback);
                },
                function (data, callback) {
                    if (data === false) {
                        fs.readFile(path.join(__dirname, "./login.html"), function (err, data) {
                            // 不处理错误了
                            res.end(data);
                        });
                    } else {
                        next();
                    }
                }
            ]);
        });
        
        app.post("/post", function (req, res, next) {
            req.getSina(function(err, data) {
                if (data === false) {
                    res.end("你还没有用微博登录！请刷新页面后重试！");
                } else {
                    next();
                }
            });
        });

        coordinator.on("getDanmu", function (req, res, danmuData, callback) {
            req.getSina(function (err, data) {
                if (data === false) {
                    // Do nothing
                } else {
                    // 又是因为异步改逻辑改傻了？！
                    danmuData.hash = data.nick;
                }
                callback(null);
            });
        });

        coordinator.on("danmuTransfer", function (data) {
            data.data.forEach(function (item) {
                item.text = "@" + item.hash + ": " + item.text;
            });
        });



    });
}