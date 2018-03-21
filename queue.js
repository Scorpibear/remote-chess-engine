class Queue {
  constructor() {
    this.data = [];
  }
  add(item) {
    this.data.push(item);
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
}

module.exports = Queue;
