const Base = require('./Base')
const className = 'danmu'
const _ = require('ramda')
const register = _.curry(Base.register)(className)
const registerCallbackable = _.curry(Base.registerCallbackable)(className)
const ban = register('ban')
const transfer = register('transfer')
const del = register('del')
const get = register('get')
const received = registerCallbackable('received')
const search = registerCallbackable('search')
class Danmu extends Base {
  static get className () {
    return className
  }
  /**
   * 封禁弹幕
   **/
  static get ban () {
    return ban
  }
  /**
   * 传输弹幕到客户端
   **/
  static get transfer () {
    return transfer
  }
  /**
   * 从客户端删除弹幕
   **/
  static get del () {
    return del
  }
  /**
   * 得到格式化后的弹幕
   **/
  static get get () {
    return get
  }
  /**
   * 收到用户刚刚发送的弹幕
   **/
  static get received () {
    return received
  }
  /**
   * 搜索弹幕
   **/
  static get search () {
    return search
  }
}
module.exports = Danmu
