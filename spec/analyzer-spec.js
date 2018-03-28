const engine = require('uci-adapter');

const analyzer = require('../analyzer');
const queue = require('../main-queue');
const evaluations = require('../evaluations');

describe('analyzer', () => {
  describe('push', () => {
    it('asks engine to start analysis', () => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'aaa', depth: 40 });
      spyOn(engine.prototype, 'analyzeToDepth').and.stub();

      analyzer.push();

      expect(engine.prototype.analyzeToDepth).toHaveBeenCalledWith({ fen: 'aaa', depth: 40 });
    });
    it('saves evaluation', async () => {
      spyOn(engine.prototype, 'analyzeToDepth').and.returnValue(Promise.resolve({ bestmove: 'Nf3' }));
      spyOn(evaluations, 'save').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'bbb', depth: 50 });
      await analyzer.push();
      expect(evaluations.save).toHaveBeenCalledWith({ fen: 'bbb', depth: 50, bestMove: 'Nf3' });
    });
    it('starts timer before evaluation');
    it('adds to history time spent');
    it('calls analyze if it is not run yet');
  });
  describe('getCurrentAnalysisTime', () => {
    it('works');
  });
  describe('getActiveFen', () => {
    it('returns active fen while analyze is in progress');
    it('returns null if analysis finished');
  });
  describe('analyze', () => {
    it('schedules to run push in a second if queue is not empty');
  });
});
