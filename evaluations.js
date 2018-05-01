const Serializable = require('./serializable');

class Evaluations extends Serializable {
  get({ fen }) {
    return this.data.get(fen);
  }

  load(data) {
    this.data = new Map(data);
  }

  save({
    fen, depth, bestMove, score
  }) {
    console.log(`save evaluation for '${fen}': depth: ${depth}, bestMove: ${bestMove}, score: ${score}`);
    this.data.set(fen, { depth, bestMove, score });
    this.emitChangeEvent();
  }

  getAllData() {
    return [...this.data];
  }
}

module.exports = Evaluations;
