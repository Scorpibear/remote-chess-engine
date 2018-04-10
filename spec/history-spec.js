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
    beforeEach(() => {
      history.clear();
    });
    it('returns data as is if it is single', () => {
      history.add({ depth: 55, time: 15 * 60 });
      expect(history.getMeanTime({ depth: 55 })).toBe(15 * 60);
    });
    it('returns mean(==avg) if 2 data', () => {
      history.add({ depth: 55, time: 5 });
      history.add({ depth: 55, time: 7 });
      expect(history.getMeanTime({ depth: 55 })).toBe(6);
    });
    it('returns middle value in case of 3 data', () => {
      history.add({ depth: 60, time: 10 });
      history.add({ depth: 60, time: 12 });
      history.add({ depth: 60, time: 42 });
      expect(history.getMeanTime({ depth: 60 })).toBe(12);
    });
    it('returns mean for 4 values', () => {
      history.add({ depth: 62, time: 1 });
      history.add({ depth: 62, time: 2 });
      history.add({ depth: 62, time: 6 });
      history.add({ depth: 62, time: 60 });
      expect(history.getMeanTime({ depth: 62 })).toBe(4);
    });
  });
  describe('add', () => {
    it('saves the data', () => {
      history.clear();
      history.add({ depth: 50, time: 1234 });
      expect(history.getAllData()).toEqual([[50, [1234]]]);
    });
    it('emits on change event');
  });
  describe('on', () => {
    it('provides possibility to subscribe');
  });
  describe('load', () => {
    it('loads history from JSON');
  });
});
