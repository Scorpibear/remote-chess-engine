const Engine = require('uci-adapter');
const config = require('config');

const queue = require('./main-queue');
const history = require('./all-history');
const timer = require('./timer');
const resultsProcessor = require('./results-processor');

const PAUSE_BETWEEN_ANALYSIS = 1000; // 1000 miliseconds

class Analyzer {
  constructor() {
    this.timer = timer;
    this.task = null;
  }
  async analyze() {
    this.task = queue.getFirst();
    if (this.task) {
      this.timer.start();
      const engine = new Engine(config.get('pathToEngine'));
      try {
        await engine.setUciOptions(config.uciOptions);
        const results = await engine.analyzeToDepth(this.task.fen, this.task.depth);
        resultsProcessor.process({ task: this.task, results });
      } catch (err) {
        console.error(err);
      }
      queue.delete({ fen: this.task.fen });
      history.add({ depth: this.task.depth, time: this.timer.getTimePassed() });
      setTimeout(this.push, PAUSE_BETWEEN_ANALYSIS);
    }
    this.task = null;
  }

  async push() {
    if (this.task === null) {
      try {
        await this.analyze();
      } catch (err) {
        console.error(err);
      }
    }
  }

  get currentAnalysisTime() {
    return this.timer.getTimePassed();
  }

  get activeFen() {
    return this.task ? this.task.fen : null;
  }
}

module.exports = Analyzer;
