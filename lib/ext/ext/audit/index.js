/// <reference path="../../../../typings/main.d.ts" />

'use strict';
const async = require('async');
const fs = require('fs');
const path = require('path');
const listener = require('../../../utils/event');
const utils = require('../../../utils');
const config = require('../../../../config');
let danmuQueue = {};
let danmuId = 0;
let io = null;


function Audit() {
    listener.on("socketCreated", socketObject => {
        io = socketObject;
        io.on("connection", socket => {
            socket.on("auditLogin", data => {
                let room = data.room;
                if (!config.rooms[room]) return socket.emit("auditInit", "Room Not Found");;
                let managePassword = config.rooms[room].managepassword;
                if (managePassword !== data.password) return socket.emit("auditInit", "Password Error");
                socket.join(`auditRoom${room}`);
                socket.emit("auditConnected");
                log.log(`审核页面${socket.id}已连接${room}`);

                {
                    let danmuObject = {};
                    danmuQueue[room].forEach((value, key) => danmuObject[key] = value);
                    socket.emit("auditDanmu", danmuObject);
                }

            });
            socket.on("auditPass", data => {
                log.log(`通过${data.room}(id = ${data.id})`);
                listener.emit("auditPassed", danmuQueue[data.room].get(parseInt(data.id)));
                danmuQueue[data.room].delete(data.id);
            });
            socket.on("auditFail", data => {
                log.log(`否决${data.room}(id = ${data.id})`);
                danmuQueue[data.room].delete(data.id);
                if (data.hash !== "") {
                    config.rooms[data.room].blockusers.push(data.hash);
                    log.log(`封禁用户${data.hash}成功`);
                    listener.emit("configUpdated");
                }
            });
        })


    });
    listener.on("httpBeforeRoute", app => {
        let danmuKeys = Object.keys(config.rooms);

        app.get("/audit", (req, res, next) => fs.readFile(path.join(__dirname, "./audit.html"), (err, data) => res.end(data)));

        // Remove all listeners to gotDanmu and bind to a new listener.
        let danmuEvents = listener.listeners('gotDanmu');
        listener.removeAllListeners('gotDanmu');
        danmuEvents.forEach(event => listener.on('auditPassed', event));

        danmuKeys.forEach(room => danmuQueue[room] = new Map());
        listener.on("gotDanmu", data => {
            let room = data.room;
            danmuQueue[room].set(++danmuId, data);
            io.to(`auditRoom${room}`).emit("auditDanmu", { [danmuId]: data }); // 懒得再去写队列
            log.log(`${data.room}得到待审核弹幕（${data.hash}） - ${danmuId}：${data.text}`);
        });
    });
};
module.exports = Audit;
