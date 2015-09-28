/* global async */
/* global config */
/* global log */
/* global coordinator */
var SECONDS_IN_DAY = 24 * 60 * 60 * 1000;
var mongodb = require('mongodb');
var server = new mongodb.Server(config.database.server, config.database.port, {
    auto_reconnect: true
});
var db = null;
var errorCounter = 0;
var firstErrorTime = new Date();

var getConnection = function (callback) {
    db = new mongodb.Db(config.database.db, server, {
        w: 1
    });
    db.open(function (err) {
        if (err !== null) {
            log.log("数据库连接错误");
            throw err;
        }

        if (config.database.username !== "") {
            db.authenticate(config.database.username, config.database.password, function (err, result) {
                if (err !== null) {
                    log.log("数据库验证错误");
                    throw err;
                }
                callback.apply(callback, arguments);
            });
        }

        callback.apply(callback, arguments);
        log.log("数据库连接成功");
    });
    //callback(null);
};

module.exports = {
    init: function (callback) {

        getConnection(callback);

        coordinator.on("gotDanmu", function (data) {

            var room = data.room;
            db.collection(config.rooms[room].table).insert({
                user: data.hash,
                text: data.text,
                publish: Math.round(new Date().getTime() / 1000),
                ip: data.ip,
                ua: data.ua
            }, function (err, results) {
                if (err !== null) {
                    log.log("数据库写入出错");
                    console.log(err);
                }
            });

        });

        coordinator.on("searchDanmu", function (data) {

            var room = data.room;
            db.collection(config.rooms[room].table).find({
                text: {
                    $regex: ".*?" + preg_quote(data.key) + ".*?"
                }
            }, null, null).toArray(function (err, results) {
                if (err === null) {
                    results.map(function (object) {
                        object.id = object._id;
                    });
                    coordinator.emit("gotSearchDanmu", JSON.stringify(results));
                } else {
                    log.log("数据库搜索出错");
                    console.log(err);
                    coordinator.emit("gotSearchDanmu", "[]");
                }
            });

        });


    }
};


function preg_quote(str, delimiter) {
    //  discuss at: http://phpjs.org/functions/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //   example 1: preg_quote("$40");
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?");
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

    return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}
