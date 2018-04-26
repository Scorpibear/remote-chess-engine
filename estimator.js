const history = require('./all-history');
const analyzer = require('./analyzer');

const defaultTime = 20 * 60; // 20 minutes in seconds

exports.estimate = ({ fen, depth }) => {
  let seconds = history.getMeanTime({ depth }) || defaultTime;
  if (analyzer.getActiveFen() === fen) {
    seconds -= analyzer.getCurrentAnalysisTime();
    while (seconds < 0) {
      seconds += defaultTime;
    }
  }
  return seconds;
};

exports.estimateQueue = queue => queue.map(({ fen, depth }) => (
  { fen, depth, estimatedTime: this.estimate({ fen, depth }) }
));
