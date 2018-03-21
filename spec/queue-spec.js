const Queue = require('../queue');

describe('queue', () => {
  describe('add', () => {
    it('add fen with depth to the queue');
    it('replaces existent fen if new request have greater depth');
    it('does not change queue if the request is already in it');
  });
  describe('delete', () => {
    it('delete fen from queue');
  });
  describe('checkPlace', () => {
    it('checkPlace of specified fen with depth', () => {
      const queue = new Queue();
      queue.add({ fen: 'asdf', depth: 5 });
      const placeInfo = queue.checkPlace({ fen: 'asdf', depth: 5 });
      expect(placeInfo.placeInQueue).toBe(0);
    });
    it('returns {placeInQueue, estimatedTime}');
  });
});
