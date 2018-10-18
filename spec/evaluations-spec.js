const Evaluations = require('../app/evaluations');

describe('evaluations', () => {
  let evaluations;
  const fen = 'abc';
  const depth = 100;
  const bestMove = 'Nf6';
  const score = -0.2;
  const data = {
    fen, depth, bestMove, score
  };
  beforeEach(() => {
    evaluations = new Evaluations();
  });
  describe('get', () => {
    it('returns undefined for unknown evaluations', () => {
      expect(evaluations.get({ fen })).toBeUndefined();
    });
    it('returns undefined for higher depth', () => {
      evaluations.save(data);
      expect(evaluations.get({ fen, depth: depth + 2 })).toBeUndefined();
    });
  });
  describe('load', () => {
    it('loads evaluations', () => {
      const data1 = { depth, bestMove, score };
      evaluations.load([[fen, data1]]);
      expect(evaluations.getAllData()).toEqual([[fen, data1]]);
    });
  });
  describe('save', () => {
    it('saves evaluation', () => {
      evaluations.save(data);
      expect(evaluations.get({ fen })).toEqual({ depth, bestMove, score });
    });
    it('emits change event', () => {
      spyOn(evaluations, 'emitChangeEvent');
      evaluations.save(data);
      expect(evaluations.emitChangeEvent).toHaveBeenCalled();
    });
    it('leaves current data if trying to save with lower depth', () => {
      evaluations.save(data);
      evaluations.save({
        fen, depth: depth - 2, bestMove, score
      });
      expect(evaluations.get({ fen })).toEqual({ depth, bestMove, score });
    });
  });
});
