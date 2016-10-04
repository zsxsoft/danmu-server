const event = require('./')
class Base {
  static get className () {
    return 'base'
  }
  static register (fieldName) {
    const eventName = `${this.className}/${fieldName}`
    return {
      once: event.once.bind(this, eventName),
      listen: event.on.bind(this, eventName),
      emit: event.emit.bind(this, eventName),
      emitAsync: event.emitAsync.bind(this, eventName)
    }
  }
}
module.exports = Base
