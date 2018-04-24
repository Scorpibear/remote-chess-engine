const engine = require('uci-adapter');

const analyzer = require('../analyzer');
const queue = require('../main-queue');
const evaluations = require('../evaluations');
const timer = require('../timer');
const history = require('../history');

describe('analyzer', () => {
  describe('push', () => {
    beforeEach(() => {
      spyOn(engine.prototype, 'analyzeToDepth').and.stub();
    });
    it('asks engine to start analysis', () => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'aaa', depth: 40 });

      analyzer.push();

      expect(engine.prototype.analyzeToDepth).toHaveBeenCalledWith('aaa', 40);
    });
    it('starts timer before evaluation', (done) => {
      spyOn(timer, 'start').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'aaa', depth: 100 });
      const promise = analyzer.analyze();
      expect(timer.start).toHaveBeenCalled();
      promise.then(done);
    });
    it('calls analyze if it is not run yet', () => {
      spyOn(analyzer, 'analyze');
      analyzer.push();
      expect(analyzer.analyze).toHaveBeenCalled();
    });
    it('do nothing if analysis is in progress', async (done) => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'do', depth: 99 });
      const promise = analyzer.analyze();
      spyOn(analyzer, 'analyze');
      await analyzer.push();
      expect(analyzer.analyze).not.toHaveBeenCalled();
      promise.then(done);
    });
  });
  describe('getCurrentAnalysisTime', () => {
    it('returns time passed from analysis', () => {
      spyOn(timer, 'getTimePassed').and.returnValue(1);
      expect(analyzer.getCurrentAnalysisTime()).toBe(1);
    });
  });
  describe('getActiveFen', () => {
    it('returns null by default', () => {
      expect(analyzer.getActiveFen()).toBeNull();
    });
    it('returns active fen while analyze is in progress', (done) => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'prp' });
      const promise = analyzer.analyze();
      expect(analyzer.getActiveFen()).toBe('prp');
      promise.then(done);
    });
    it('returns null if analysis finished', async () => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'qkr' });
      await analyzer.analyze();
      expect(analyzer.getActiveFen()).toBeNull();
    });
  });
  describe('analyze', () => {
    it('schedules to run push in a second if queue is not empty', (done) => {
      spyOn(global, 'setTimeout').and.stub();
      spyOn(analyzer, 'push').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'abc', depth: 100 });
      analyzer.analyze().then(() => {
        expect(global.setTimeout).toHaveBeenCalledWith(analyzer.push, 1000);
        done();
      });
    });
    it('adds to history time spent', async () => {
      spyOn(history, 'add').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ depth: 50, fen: 'abc' });
      spyOn(timer, 'getTimePassed').and.returnValue(600);
      spyOn(engine.prototype, 'analyzeToDepth').and.stub();
      await analyzer.analyze();
      expect(history.add).toHaveBeenCalledWith({ depth: 50, time: 600 });
    });
    it('deletes fen from queue after analysis', async () => {
      spyOn(queue, 'getFirst').and.returnValue({ depth: 51, fen: 'b' });
      spyOn(queue, 'delete').and.stub();
      spyOn(engine.prototype, 'analyzeToDepth').and.returnValue({ bestMove: 'Nf3' });
      await analyzer.analyze();
      expect(queue.delete).toHaveBeenCalledWith({ fen: 'b' });
    });
    it('saves evaluation', async () => {
      spyOn(engine.prototype, 'analyzeToDepth').and.returnValue(Promise.resolve({ bestmove: 'Nf3', info: [{ score: { value: 123 } }] }));
      spyOn(evaluations, 'save').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'bbb', depth: 50 });
      await analyzer.analyze();
      expect(evaluations.save).toHaveBeenCalledWith({
        fen: 'bbb', depth: 50, bestMove: 'Nf3', score: 123
      });
    });
    it('send POST request to ping url after saving analysis');
  });
});
