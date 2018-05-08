const Engine = require('uci-adapter');
const config = require('config');

const queue = require('./main-queue');
const history = require('./all-history');
const timer = require('./timer');
const resultsProcessor = require('./results-processor');

const PAUSE_BETWEEN_ANALYSIS = 1000; // 1000 miliseconds

let task = null;

exports.analyze = async () => {
  task = queue.getFirst();
  if (task) {
    timer.start();
    const engine = new Engine(config.get('pathToEngine'));
    try {
      const results = await engine.analyzeToDepth(task.fen, task.depth);
      resultsProcessor.process({ task, results });
    } catch (err) {
      console.error(err);
    }
    queue.delete({ fen: task.fen });
    history.add({ depth: task.depth, time: timer.getTimePassed() });
    setTimeout(this.push, PAUSE_BETWEEN_ANALYSIS);
  }
  task = null;
};

exports.push = async () => {
  if (task === null) {
    try {
      await this.analyze();
    } catch (err) {
      console.error(err);
    }
  }
};

exports.getCurrentAnalysisTime = () => timer.getTimePassed();

exports.getActiveFen = () => (task ? task.fen : null);
