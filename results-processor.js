const http = require('http');

const evaluations = require('./all-evaluations');

/**
 * process results of engine analysis
 * 
 * @param {*} task - object with { fen, depth, pingUrl }
 * @param {*} results - output of engine.analyzeToDepth
 */
module.exports.process = ({ task, results }) => {
  if (results && results.info && results.info.length) {
    evaluations.save({
      fen: task.fen,
      depth: task.depth,
      bestMove: results.bestmove,
      score: results.info[results.info.length - 1].score.value
    });
    if (task.pingUrl) {
      http.get(task.pingUrl).on('error', (err) => {
        console.error(`Got error while pinging via '${task.pingUrl}': ${err.message}`);
      });
    }
  }
};
