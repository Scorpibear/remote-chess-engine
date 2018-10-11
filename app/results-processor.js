const http = require('http');

const evaluations = require('./all-evaluations');
const { Chess } = require('chess.js');
const fenAnalyzer = require('fen-analyzer');

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
    const score = this.adjustScore(results.info[results.info.length - 1].score.value, task.fen);
    const bestMove = this.shortenMoveNotation(results.bestmove, task.fen);
    evaluations.save({
      fen: task.fen,
      depth: task.depth,
      bestMove,
      score
    });
    if (task.pingUrl) {
      console.log(`try to ping on ${task.pingUrl}`);
      http.get(task.pingUrl).on('error', (err) => {
        console.error(`Got error while pinging via '${task.pingUrl}': ${err.message}`);
      });
    }
  } else {
    console.error(`Incorrect format of results, got '${results}', expected '{ bestmove, info: [{ score: { value }}]}'`);
  }
};

module.exports.adjustScore = (scoreInCentipawns, fen) =>
  scoreInCentipawns / ((fenAnalyzer.isBlack(fen) && scoreInCentipawns > 0) ? -100 : 100);

module.exports.shortenMoveNotation = (move, fen) => {
  try {
    const chess = new Chess(fen);
    return chess.move(move, { sloppy: true }).san;
  } catch (err) {
    console.error(`Incorrect move/fen combination: move - '${move}', fen - '${fen}'`, err);
    return move;
  }
};
