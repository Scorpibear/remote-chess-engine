const Engine = require('uci-adapter');
const config = require('config');

const queue = require('./main-queue');
const evaluations = require('./evaluations');
const history = require('./history');
const timer = require('./timer');

const PAUSE_BETWEEN_ANALYSIS = 1000; // 1000 miliseconds

let task = null;

exports.analyze = async () => {
  task = queue.getFirst();
  if (task) {
    timer.start();
    const engine = new Engine(config.get('pathToEngine'));
    try {
      const result = await engine.analyzeToDepth(task);
      if (result) {
        evaluations.save({ fen: task.fen, depth: task.depth, bestMove: result.bestmove });
      }
    } catch (err) {
      console.error(err);
    }
    history.add({ depth: task.depth, time: timer.getTimePassed() });
    setTimeout(this.push, PAUSE_BETWEEN_ANALYSIS);
  }
  task = null;
};

exports.push = async () => {
  if (task === null) {
    await this.analyze();
  }
};

exports.getCurrentAnalysisTime = () => timer.getTimePassed();

exports.getActiveFen = () => (task ? task.fen : null);
