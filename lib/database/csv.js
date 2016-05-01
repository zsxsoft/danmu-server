/* global config */
/* global log */
/* global coordinator */
'use strict';
let fs = require("fs");
let path = require("path");

function formatContent(content) {
    return '"' + content.toString().replace(/"/g, '""') + '"';
}
module.exports = {};
module.exports.init = function (callback) {
    let savePath = path.resolve(config.database.savedir);
    log.log("保存位置：" + savePath);
    callback(null);
    coordinator.on("gotDanmu", (data) => {
        let date = new Date();
        let joinArray = [];
        joinArray.push(formatContent(Math.round(new Date().getTime() / 1000)));
        joinArray.push(formatContent(data.hash));
        joinArray.push(formatContent(data.ip));
        joinArray.push(formatContent(data.ua));
        joinArray.push(formatContent(data.text));
        joinArray.push("\r\n");
        fs.appendFile(path.resolve(savePath, data.room + '.csv'), joinArray.join(","));
    });

    coordinator.on("searchDanmu", (data) => {
        coordinator.emit("gotSearchDanmu", '[{"user": "ERROR", "text": "Not yet supported", "publish": ""}]');
    });
};
