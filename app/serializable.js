const EventEmitter = require('events');

class Serializable extends EventEmitter {
  constructor(init) {
    super();
    this.load(init);
  }

  emitChangeEvent() {
    this.emit('change', this.getAllData());
  }

  load() {
    console.error('load() is not implemented in ', this);
  }

  getAllData() {
    console.error('getAllData() is not implemented in ', this);
  }
}

module.exports = Serializable;
