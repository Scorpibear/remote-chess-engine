const History = require('../history');

describe('history', () => {
  let history;
  beforeEach(() => {
    history = new History();
  });
  describe('clear', () => {
    it('clears history', () => {
      history.add({ depth: 55, time: 12345 });
      history.clear();
      expect(history.getAllData()).toEqual([]);
    });
  });
  describe('getAllData', () => {
    it('empty array if no data', () => {
      expect(history.getAllData()).toEqual([]);
    });
    it('contains depth, pieces, time', () => {
      history.add({ depth: 100, pieces: 30, time: 5 });
      expect(history.getAllData()).toEqual([[100, [[30, [5]]]]]);
    });
    it('multidimentional', () => {
      history.add({ depth: 40, pieces: 30, time: 5 });
      history.add({ depth: 40, pieces: 30, time: 6 });
      history.add({ depth: 40, pieces: 32, time: 7 });
      history.add({ depth: 100, pieces: 30, time: 8 });
      expect(history.getAllData()).toEqual([[40, [[30, [5, 6]], [32, [7]]]], [100, [[30, [8]]]]]);
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
    it('considers # of pieces in position', () => {
      history.add({ depth: 50, pieces: 30, time: 10 });
      history.add({ depth: 50, pieces: 10, time: 2 });
      expect(history.getMeanTime({ depth: 50, pieces: 30 })).toBe(10);
    });
    it('uses mean of neighbor pieces time if no data for specific # of pieces');
  });
  describe('add', () => {
    it('saves the data', () => {
      history.clear();
      history.add({ depth: 50, pieces: 30, time: 1234 });
      expect(history.getAllData()).toEqual([[50, [[30, [1234]]]]]);
    });
    it('emits on change event', () => {
      spyOn(history, 'emitChangeEvent');
      history.add({ depth: 100, time: 3 });
      expect(history.emitChangeEvent).toHaveBeenCalled();
    });
  });
  describe('load', () => {
    it('loads history from JSON', () => {
      history.load([[52, [[32, [12345]]]]]);
      expect(history.getAllData()).toEqual([[52, [[32, [12345]]]]]);
    });
  });
});
