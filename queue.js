class Queue {
  constructor(initData) {
    this.data = initData ? initData.slice() : [];
  }
  add(item) {
    const placeInQueue = this.data.findIndex(queueItem => (queueItem.fen === item.fen));
    if (placeInQueue >= 0) {
      if (this.data[placeInQueue].depth < item.depth) {
        this.data.splice(placeInQueue, 1, item);
      } else {
        // do nothing as item is in queue with good depth
      }
    } else {
      this.data.push(item);
    }
  }
  checkPlace(item) {
    const placeInQueue = this.data.findIndex(queueItem =>
      ((queueItem.fen === item.fen) && (queueItem.depth === item.depth)));
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
