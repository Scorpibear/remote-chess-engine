const Engine = require('uci-adapter');
const config = require('config');

const queue = require('./main-queue');
const evaluations = require('./evaluations');

exports.push = async () => {
  const engine = new Engine(config.get('pathToEngine'));
  const task = queue.getFirst();
  if (task) {
    let result = null;
    try {
      result = await engine.analyzeToDepth(task);
    } catch (err) {
      console.error(err);
    }
    if (result) {
      evaluations.save({ fen: task.fen, depth: task.depth, bestMove: result.bestmove });
    }
  }
};
