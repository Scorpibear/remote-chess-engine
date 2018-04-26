const EventEmitter = require('events');

class History extends EventEmitter {
  constructor(initData) {
    super();
    this.timeMap = new Map(initData); // depth => [time1, time2, ...]
  }

  clear() {
    this.timeMap.clear();
    this.emitChangeEvent();
  }

  getMeanTime({ depth }) {
    const data = this.timeMap.get(depth);
    if (data) {
      if (data.length % 2 === 1) {
        return data[Math.floor(data.length / 2)];
      }
      return Math.ceil((data[data.length / 2] + data[(data.length / 2) - 1]) / 2);
    }
    return undefined;
  }

  getAllData() {
    return Array.from(this.timeMap);
  }

  add({ depth, time }) {
    if (this.timeMap.has(depth)) {
      const timeData = this.timeMap.get(depth);
      timeData.push(time);
    } else {
      this.timeMap.set(depth, [time]);
    }
    this.emitChangeEvent();
  }

  emitChangeEvent() {
    this.emit('change', this.getAllData());
  }

  load(data) {
    this.timeMap = new Map(data);
  }
}

module.exports = History;
