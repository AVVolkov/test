const events = require('events');

class GE {
  constructor() {
    if (GE.instance) {
      return GE.instance;
    }

    GE.instance = this;

    this.ge = new events.EventEmitter();
  }

  inst() {
    return this.ge;
  }
}

module.exports = (new GE()).inst();
