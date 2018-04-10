const evaluations = require('../evaluations');

describe('evaluations', () => {
  describe('get', () => {
    it('returns undefined for unknown evaluations', () => {
      expect(evaluations.get({ fen: 'abc' })).toBeUndefined();
    });
  });
  describe('on', () => {
    it('provides possibilility to subscribe');
  });
  describe('load', () => {
    it('loads evaluations');
  });
  describe('save', () => {
    it('saves evaluation', () => {
      evaluations.save({
        fen: 'aaa', depth: 50, bestMove: 'Nf3', score: 0.23
      });
      expect(evaluations.get({ fen: 'aaa' })).toEqual({ depth: 50, bestMove: 'Nf3', score: 0.23 });
    });
    it('emits on change event');
  });
});
