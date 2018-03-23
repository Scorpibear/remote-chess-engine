describe('history', () => {
  describe('getMeanTime', () => {
    it('returns 20 min if no data at all');
    it('returns data as is if it is single');
    it('returns mean(==avg) if 2 data');
    it('returns middle value in case of 3 data');
    it('returns mean for 4 values');
  });
  describe('add', () => {
    it('saves the data');
  });
});
