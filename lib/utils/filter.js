// / <reference path="../../typings/main.d.ts" />
'use strict'
let listener = require('./event')
let _ = require('ramda')
let config = require('../../config')

let cachedFilters = {}
/**
 * 检测用户是否被封禁
 */
let checkUserIsBlocked = _.curry((blockUsers, hash) => {
  return (blockUsers.indexOf(hash)) > -1
})
/**
 * 检测文字是否和谐
 */
let validateText = _.curry((ignoreRegEx, checkRegEx, str) => {
  checkRegEx.lastIndex = 0
  let testStr = str.replace(ignoreRegEx, '')
  return !checkRegEx.test(testStr)
})
/**
 * 替换关键字
 */
let replaceKeyword = _.curry((regex, str) => {
  return str.replace(regex, '***')
})

function initialize (roomName, forceUpdate) {
  if (cachedFilters[roomName] && !forceUpdate) {
    return cachedFilters[roomName]
  }
  let room = config.rooms[roomName]
  if (typeof room.keyword.block === 'string') {
    console.error('请升级你的配置，将所有字符串类型关键词转换为正则类型关键词。')
    throw 'Init RegExp Error'
  }
  let ret = {
    checkUserIsBlocked: checkUserIsBlocked(room.blockusers),
    validateText: validateText(room.keyword.ignore)(room.keyword.block),
    replaceKeyword: replaceKeyword(room.keyword.replacement)
  }
  cachedFilters[roomName] = null // Release Memory
  cachedFilters[roomName] = ret
  return ret
};

// 正则缓存更新
listener.on('configUpdated', () => {
  Object.keys(config.rooms).forEach(room => initialize(room, true))
})
module.exports = initialize
