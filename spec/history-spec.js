const history = require('../history');

describe('history', () => {
  beforeEach(() => {
    history.clear();
  });
  describe('clear', () => {
    it('clears history', () => {
      history.add({ depth: 55, time: 12345 });
      history.clear();
      expect(history.getAllData()).toEqual([]);
    });
  });
  describe('getMeanTime', () => {
    it('returns 20 min if no data at all');
    it('returns data as is if it is single');
    it('returns mean(==avg) if 2 data');
    it('returns middle value in case of 3 data');
    it('returns mean for 4 values');
  });
  describe('add', () => {
    it('saves the data', () => {
      history.clear();
      history.add({ depth: 50, time: 1234 });
      expect(history.getAllData()).toEqual([{ depth: 50, time: 1234 }]);
    });
  });
});
