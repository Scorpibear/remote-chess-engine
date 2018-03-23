class Queue {
  constructor(initData) {
    this.data = initData ? initData.slice() : [];
  }
  add({ fen, depth }) {
    const placeInQueue = this.data.findIndex(item => (item.fen === fen));
    if (placeInQueue >= 0) {
      if (this.data[placeInQueue].depth < depth) {
        this.data[placeInQueue].depth = depth;
      } else {
        // do nothing as item is in queue with good depth
      }
    } else {
      this.data.push({ fen, depth });
    }
  }
  checkPlace({ fen, depth }) {
    const placeInQueue = this.data.findIndex(item =>
      ((item.fen === fen) && (item.depth === depth)));
    return { placeInQueue };
  }

  delete(item) {
    const placeInQueue = this.data.findIndex(queueItem =>
      (queueItem.fen === item.fen));
    this.data.splice(placeInQueue, 1);
  }

  toList() {
    return this.data.slice();
  }
}

module.exports = Queue;
