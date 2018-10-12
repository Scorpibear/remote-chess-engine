const Engine = require('uci-adapter');

const Analyzer = require('../app/master-analyzer');

const queue = require('../app/main-queue');
const timer = require('../app/timer');
const history = require('../app/all-history');
const resultsProcessor = require('../app/results-processor');

describe('master analyzer', () => {
  let analyzer;
  const results = { info: [{ score: { value: 10 } }] };
  const engine = { analyzeToDepth: () => (results), setUciOptions: () => {} };
  const uciOptions = [{ name: 'Threads', value: 3 }, { name: 'Hash', value: 4096 }];
  const task = { fen: 'some', depth: 100, pingUrl: 'http://some.url' };
  const fenAnalyzer = { getPiecesCount: () => 32 };

  beforeEach(() => {
    analyzer = new Analyzer({ fenAnalyzer });
    spyOn(Engine.prototype, 'analyzeToDepth').and.callFake(engine.analyzeToDepth);
  });

  describe('push', () => {
    it('asks engine to start analysis', async () => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'aaa', depth: 40 });
      await analyzer.push();
      expect(Engine.prototype.analyzeToDepth).toHaveBeenCalledWith('aaa', 40);
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
    it('logs error if analysis failed', async () => {
      spyOn(console, 'error').and.stub();
      spyOn(analyzer, 'analyze').and.returnValue(Promise.reject(new Error('error')));
      await analyzer.push();
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe('getCurrentAnalysisTime', () => {
    it('returns time passed from analysis', () => {
      spyOn(timer, 'getTimePassed').and.returnValue(1);
      expect(analyzer.currentAnalysisTime).toBe(1);
    });
  });
  describe('getActiveFen', () => {
    it('returns null by default', () => {
      expect(analyzer.activeFen).toBeNull();
    });
    it('returns active fen while analyze is in progress', (done) => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'prp' });
      const promise = analyzer.analyze();
      expect(analyzer.activeFen).toBe('prp');
      promise.then(done);
    });
    it('returns null if analysis finished', async () => {
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'qkr' });
      await analyzer.analyze();
      expect(analyzer.activeFen).toBeNull();
    });
  });
  describe('analyze', () => {
    it('schedules to run push in a second if queue is not empty', (done) => {
      spyOn(global, 'setTimeout').and.callFake(callback => callback());
      spyOn(analyzer, 'push').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ fen: 'abc', depth: 100 });
      analyzer.analyze().then(() => {
        expect(global.setTimeout).toHaveBeenCalledWith(jasmine.anything(), 1000);
        expect(analyzer.push).toHaveBeenCalled();
        done();
      });
    });
    it('adds to history time spent', async () => {
      spyOn(history, 'add').and.stub();
      spyOn(queue, 'getFirst').and.returnValue({ depth: 50, fen: 'abc' });
      spyOn(fenAnalyzer, 'getPiecesCount').and.returnValue(18);
      spyOn(timer, 'getTimePassed').and.returnValue(600);
      await analyzer.analyze();
      expect(history.add).toHaveBeenCalledWith({ depth: 50, time: 600, pieces: 18 });
    });
    it('deletes fen from queue after analysis', async () => {
      spyOn(queue, 'getFirst').and.returnValue({ depth: 51, fen: 'b' });
      spyOn(queue, 'delete').and.stub();
      spyOn(engine, 'analyzeToDepth').and.returnValue({ bestMove: 'Nf3' });
      await analyzer.analyze();
      expect(queue.delete).toHaveBeenCalledWith({ fen: 'b' });
    });
    it('process results', (done) => {
      spyOn(queue, 'getFirst').and.returnValue(task);
      spyOn(resultsProcessor, 'process').and.stub();
      analyzer.analyze().then(() => {
        expect(resultsProcessor.process).toHaveBeenCalledWith({ task, results });
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('sets uci options', async () => {
      spyOn(Engine.prototype, 'setUciOptions').and.stub();
      spyOn(queue, 'getFirst').and.returnValue(task);
      await analyzer.analyze();
      expect(Engine.prototype.setUciOptions).toHaveBeenCalledWith(uciOptions);
    });
    it('logs error if analysis failed', async () => {
      spyOn(console, 'error').and.stub();
      spyOn(queue, 'getFirst').and.returnValue(task);
      spyOn(resultsProcessor, 'process').and.throwError('error');
      await analyzer.analyze();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
