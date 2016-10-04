const Base = require('./Base')
const className = 'danmu'
const addSingle = Base.registerCallbackable(className, 'addSingle')
const ban = Base.register(className, 'ban')
const transfer = Base.register(className, 'transfer')
const removeSingle = Base.register(className, 'removeSingle')
const removing = Base.register(className, 'removing')
const get = Base.register(className, 'get')
const httpReceived = Base.registerCallbackable(className, 'httpReceived')
const search = Base.registerCallbackable(className, 'search')
class Danmu extends Base {
  static get className () {
    return className
  }
  /**
   * 新增一条未经处理的弹幕
   */
  static get addSingle () {
    return addSingle
  }
  /**
   * 封禁弹幕
   **/
  static get ban () {
    return ban
  }
  /**
   * 收到用户刚刚发送的弹幕（通过HTTP）
   **/
  static get httpReceived () {
    return httpReceived
  }
  /**
   * 得到格式化后的弹幕
   **/
  static get get () {
    return get
  }
  /**
   * 删除单条弹幕事件
   * @param {object} data
   * @param {boolean?} blockUser false
   **/
  static get removeSingle () {
    return removeSingle
  }
  /**
   * 正在删除事件（即准备删除但还未动手）
   **/
  static get removing () {
    return removing
  }
  /**
   * 搜索弹幕
   **/
  static get search () {
    return search
  }
  /**
   * 传输弹幕到客户端
   **/
  static get transfer () {
    return transfer
  }
}
module.exports = Danmu
