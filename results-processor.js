const http = require('http');

const evaluations = require('./all-evaluations');

/**
 * process results of engine analysis
 *
 * @param {*} data  - { task: { fen, depth, pingUrl },
 *   results: { bestmove, info: [{ score: { value }}]}
 */
module.exports.process = ({ task, results }) => {
  if (results && results.bestmove && results.info && results.info.length &&
    results.info[results.info.length - 1].score &&
    'value' in results.info[results.info.length - 1].score
  ) {
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
  } else {
    console.error(`Incorrect format of results, got '${results}', expected '{ bestmove, info: [{ score: { value }}]}'`);
  }
};
