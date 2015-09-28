/* global cache */
global.cache = null;
module.exports = {
    init: function (callback) {
        switch (config.cache.type) {
        case "memcached":
            cache = new(require('memcached'))(config.cache.host);
            break;
        case "aliyun":
            var ALY = require('aliyun-sdk');
            var PORT = config.cache.host.split(":")[1];
            var HOST = config.cache.host.split(":")[0];
            cache = ALY.MEMCACHED.createClient(PORT, HOST, {
                username: config.cache.authUser,
                password: config.cache.authPassword
            });
        }
        // 以上是懒得写了
        callback(null);
    }
}
