import timer from '../timer';

/**
 * Abstract analyzer
 */
class Analyzer {
  constructor({ fenAnalyzer }) {
    this.fenAnalyzer = fenAnalyzer;
    this.timer = timer;
    this.task = null;
  }
}

export default Analyzer;
