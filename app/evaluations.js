const Serializable = require('./serializable');

class Evaluations extends Serializable {
  get({ fen, depth }) {
    const data = this.data.get(fen);
    if (depth) {
      return data && data.depth >= depth ? data : undefined;
    }
    return data;
  }

  load(data) {
    this.data = new Map(data);
  }

  save({
    fen, depth, bestMove, score
  }) {
    const fenData = this.data.get(fen);
    if (!fenData || (fenData.depth < depth)) {
      console.log(`save evaluation for '${fen}': depth: ${depth}, bestMove: ${bestMove}, score: ${score}`);
      this.data.set(fen, { depth, bestMove, score });
      this.emitChangeEvent();
    }
  }

  getAllData() {
    return [...this.data];
  }
}

module.exports = Evaluations;
