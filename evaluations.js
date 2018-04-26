const EventEmitter = require('events');

class Evaluations extends EventEmitter {
  constructor(init) {
    super();
    this.data = new Map(init);
  }

  get({ fen }) {
    return this.data.get(fen);
  }

  save({
    fen, depth, bestMove, score
  }) {
    console.log(`save evaluation for '${fen}': depth: ${depth}, bestMove: ${bestMove}, score: ${score}`);
    this.data.set(fen, { depth, bestMove, score });
  }
}

module.exports = Evaluations;
