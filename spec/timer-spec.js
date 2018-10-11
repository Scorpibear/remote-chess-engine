const timer = require('../app/timer');

describe('timer', () => {
  describe('getTimePassed', () => {
    it('substracts current time with time of start', () => {
      spyOn(Date, 'now').and.returnValues(100 * 1000, 150 * 1000);
      timer.start();
      expect(timer.getTimePassed()).toEqual(50);
    });
  });
  describe('start', () => {
    it('calls Date.now()', () => {
      spyOn(Date, 'now');
      timer.start();
      expect(Date.now).toHaveBeenCalled();
    });
  });
});
