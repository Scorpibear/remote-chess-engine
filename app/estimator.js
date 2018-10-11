const history = require('./all-history');

const defaultTime = 20 * 60; // 20 minutes in seconds

class Estimator {
  constructor({ analyzer }) {
    this.analyzer = analyzer;
  }
  estimate({ fen, depth }) {
    let seconds = history.getMeanTime({ depth }) || defaultTime;
    if (this.analyzer.activeFen === fen) {
      seconds -= this.analyzer.currentAnalysisTime;
      while (seconds < 0) {
        seconds += defaultTime;
      }
    }
    return seconds;
  }

  estimateQueue(queue) {
    return queue.map(({ fen, depth }) => (
      { fen, depth, estimatedTime: this.estimate({ fen, depth }) }
    ));
  }
}

module.exports = Estimator;

