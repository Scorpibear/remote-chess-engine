import Engine from 'uci-adapter';
import Analyzer from './analyzer';
import { getFirst, delete as deleteFromQueue } from '../main-queue';

const config = require('config');
const history = require('../all-history');
const resultsProcessor = require('../results-processor');

const PAUSE_BETWEEN_ANALYSIS = 1000; // 1000 miliseconds

/**
 * analyze with local uci engine
 */
class LocalAnalyzer extends Analyzer {
  async analyze() {
    this.task = getFirst();
    if (this.task) {
      this.timer.start();
      const engine = new Engine(config.get('pathToEngine'));
      await engine.setUciOptions(config.uciOptions);
      await engine.analyzeToDepth(this.task.fen, this.task.depth)
        .then(results => resultsProcessor.process({ task: this.task, results }))
        .catch(err => console.error(err))
        .finally(() => {
          deleteFromQueue({ fen: this.task.fen });
          history.add({
            depth: this.task.depth,
            time: this.timer.getTimePassed(),
            pieces: this.fenAnalyzer.getPiecesCount(this.task.fen)
          });
          setTimeout(() => {
            this.push();
          }, PAUSE_BETWEEN_ANALYSIS);
        });
    }
    this.task = null;
  }
}

export default LocalAnalyzer;
