const EventEmitter = require('events');

class Queue extends EventEmitter {
  constructor(initData) {
    super();
    this.data = initData ? initData.slice() : [];
  }
  add({ fen, depth }) {
    console.log('adding ', { fen, depth });
    if (fen && depth) {
      const placeInQueue = this.data.findIndex(item => (item.fen === fen));
      if (placeInQueue >= 0) {
        if (this.data[placeInQueue].depth < depth) {
          this.data[placeInQueue].depth = depth;
          this.emitChange();
        } else {
          // do nothing as item is in queue with good depth
        }
      } else {
        this.data.push({ fen, depth });
        this.emitChange();
      }
    }
    return this.checkPlace({ fen, depth });
  }
  checkPlace({ fen, depth }) {
    let placeInQueue = this.data.findIndex(item =>
      ((item.fen === fen) && (item.depth >= depth)));
    if (placeInQueue === -1) {
      placeInQueue = undefined;
    }
    return { placeInQueue };
  }

  delete({ fen }) {
    const placeInQueue = this.data.findIndex(item => (item.fen === fen));
    if (this.data.splice(placeInQueue, 1)) {
      this.emitChange();
    }
  }

  emitChange() {
    this.emit('change', this.data);
  }

  getFirst() {
    return this.data.length ? this.data[0] : null;
  }

  load(data) {
    this.data = data ? data.slice() : [];
  }

  toList() {
    return this.data.slice();
  }
}

module.exports = Queue;
