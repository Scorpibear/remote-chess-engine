const history = require('./history');
const analyzer = require('./analyzer');

const defaultTime = 20 * 60; // 20 minutes in seconds

exports.estimate = ({ fen, depth }) => {
  let seconds = history.getMeanTime({ depth });
  if (seconds) {
    if (analyzer.getActiveFen() === fen) {
      seconds -= analyzer.getCurrentAnalysisTime();
      while (seconds < 0) {
        seconds += defaultTime;
      }
    }
    return seconds;
  }
  return defaultTime;
};

exports.estimateQueue = queue => queue.map(({ fen, depth }) => (
  { fen, depth, estimatedTime: this.estimate({ depth }) }
));
