class Queue {
  constructor() {
    this.data = [];
  }
  add(item) {
    const placeInQueue = this.data.findIndex(queueItem => (queueItem.fen === item.fen));
    if (placeInQueue >= 0 && this.data[placeInQueue].depth < item.depth) {
      this.data.splice(placeInQueue, 1, item);
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
