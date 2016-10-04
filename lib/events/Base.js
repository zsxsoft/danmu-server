const events = require('events')
const eventEmitter = new events.EventEmitter()
const callbackObject = {}
class Base {
  static get className () {
    return 'base'
  }
  static register (className, fieldName) {
    const eventName = `${className}/${fieldName}`
    return {
      eventName,
      once: eventEmitter.once.bind(eventEmitter, eventName),
      listen: eventEmitter.on.bind(eventEmitter, eventName),
      emit: eventEmitter.emit.bind(eventEmitter, eventName),
      listeners: () => eventEmitter.listeners(eventName),
      removeAllListeners: () => eventEmitter.removeAllListeners(eventName)
    }
  }
  static registerCallbackable (className, fieldName) {
    const eventName = `${className}/${fieldName}`
    if (callbackObject[eventName]) return callbackObject[eventName]
    let callback = resolve => resolve()
    callbackObject[eventName] = {
      listen: fun => {
        callback = fun
      },
      wait: function () {
        return new Promise((resolve, reject) => {
          callback(resolve, ...arguments)
        })
      }
    }
    return callbackObject[eventName]
  }
}
module.exports = Base
