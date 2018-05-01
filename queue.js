const Serializable = require('./serializable');

class Queue extends Serializable {
  add({ fen, depth }) {
    console.log('adding ', { fen, depth });
    if (fen && depth) {
      const placeInQueue = this.data.findIndex(item => (item.fen === fen));
      if (placeInQueue >= 0) {
        if (this.data[placeInQueue].depth < depth) {
          this.data[placeInQueue].depth = depth;
          this.emitChangeEvent();
        } else {
          // do nothing as item is in queue with good depth
        }
      } else {
        this.data.push({ fen, depth });
        this.emitChangeEvent();
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
      this.emitChangeEvent();
    }
  }

  getFirst() {
    return this.data.length ? this.data[0] : null;
  }

  load(data) {
    this.data = data ? data.slice() : [];
  }

  toList() {
    return this.getAllData();
  }

  getAllData() {
    return this.data.slice();
  }
}

module.exports = Queue;
