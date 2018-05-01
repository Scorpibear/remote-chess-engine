const Evaluations = require('../evaluations');

describe('evaluations', () => {
  const evaluations = new Evaluations();
  describe('get', () => {
    it('returns undefined for unknown evaluations', () => {
      expect(evaluations.get({ fen: 'abc' })).toBeUndefined();
    });
  });
  describe('load', () => {
    it('loads evaluations', () => {
      const data1 = { depth: 100, bestMove: 'e4', score: 1.23 };
      evaluations.load([['abc', data1]]);
      expect(evaluations.getAllData()).toEqual([['abc', data1]]);
    });
  });
  describe('save', () => {
    it('saves evaluation', () => {
      evaluations.save({
        fen: 'aaa', depth: 50, bestMove: 'Nf3', score: 0.23
      });
      expect(evaluations.get({ fen: 'aaa' })).toEqual({ depth: 50, bestMove: 'Nf3', score: 0.23 });
    });
    it('emits change event', () => {
      spyOn(evaluations, 'emitChangeEvent');
      evaluations.save({
        fen: 'aaa', depth: 100, bestMove: 'Nf3', score: 0.23
      });
      expect(evaluations.emitChangeEvent).toHaveBeenCalled();
    });
  });
});
