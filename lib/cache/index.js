global.cache = null;
module.exports = {
    init: function (callback) {
        switch (config.cache.type) {
            case "memcached":
                cache = new (require('memcached'))(config.cache.host);
                break;
        }
        callback(null);
    }
}