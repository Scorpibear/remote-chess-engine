const history = require('./history');

exports.estimateQueue = queue => queue.map(({ fen, depth }) => (
  { fen, depth, estimatedTime: history.getMeanTime({ depth }) }
));
