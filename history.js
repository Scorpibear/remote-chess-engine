const EventEmitter = require('events');

class History extends EventEmitter {
  constructor(initData) {
    super();
    this.timeMap = new Map();
    this.load(initData);
  }

  clear() {
    this.timeMap.clear();
    this.emitChangeEvent();
  }

  getMeanTime({ depth, pieces = 32 }) {
    const timeForPieces = this.timeMap.get(depth);
    const data = timeForPieces.get(pieces);
    if (data) {
      if (data.length % 2 === 1) {
        return data[Math.floor(data.length / 2)];
      }
      return Math.ceil((data[data.length / 2] + data[(data.length / 2) - 1]) / 2);
    }
    return undefined;
  }

  getAllData() {
    const allData = [];
    this.timeMap.forEach((value, key) => {
      allData.push([key, [...value]]);
    });
    return allData;
  }

  add({ depth, pieces = 32, time }) {
    try {
      if (!this.timeMap.has(depth)) {
        this.timeMap.set(depth, new Map());
      }
      const timeForPieces = this.timeMap.get(depth);
      if (!timeForPieces.has(pieces)) {
        timeForPieces.set(pieces, []);
      }
      const timeData = timeForPieces.get(pieces);
      timeData.push(time);
      this.emitChangeEvent();
    } catch (err) {
      console.error(`could not add data ${{ depth, pieces, time }} to history`, err);
    }
  }

  emitChangeEvent() {
    this.emit('change', this.getAllData());
  }

  load(data) {
    try {
      const map = new Map(data);
      map.forEach((value, key) => {
        map.set(key, new Map(value));
      });
      this.timeMap = map;
    } catch (err) {
      console.error(`could not load history from '${data}'`, err);
    }
  }
}

module.exports = History;
