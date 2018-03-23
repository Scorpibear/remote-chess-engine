const Queue = require('../queue');

describe('queue', () => {
  const task = { fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', depth: 56 };
  describe('constructor', () => {
    it('initializes queue from input list', () => {
      const queue = new Queue([task]);
      expect(queue.toList()).toEqual([task]);
    });
  });
  describe('add', () => {
    it('add fen with depth to the queue', () => {
      const queue = new Queue();
      queue.add(task);
      expect(queue.toList()).toEqual([task]);
    });
    it('replaces existent task if new request have the same fen but greater depth', () => {
      const queue = new Queue();
      queue.add(task);
      queue.add({ fen: task.fen, depth: task.depth + 2 });
      expect(queue.toList()).toEqual([{ fen: task.fen, depth: task.depth + 2 }]);
    });
    it('does not change queue if the request is already in it', () => {
      const queue = new Queue([task]);
      queue.add(task);
      expect(queue.toList()).toEqual([task]);
    });
  });
  describe('toList', () => {
    it('output modification does not modify queue content', () => {
      const queue = new Queue();
      queue.toList().push({ fen: 'new' });
      expect(queue.toList()).toEqual([]);
    });
  });
  describe('delete', () => {
    it('removes a fen', () => {
      const queue = new Queue([{ fen: 'aaaa', depth: 50 }, { fen: 'bbbb', depth: 50 }]);
      queue.delete({ fen: 'aaaa' });
      expect(queue.toList()).toEqual([{ fen: 'bbbb', depth: 50 }]);
    });
  });
  describe('checkPlace', () => {
    it('checkPlace of specified fen with depth', () => {
      const queue = new Queue([{ fen: 'asdf', depth: 5 }]);
      const placeInfo = queue.checkPlace({ fen: 'asdf', depth: 5 });
      expect(placeInfo.placeInQueue).toBe(0);
    });
    it('returns 1 for the second place', () => {
      const queue = new Queue();
      queue.add({ fen: 'aaaa', depth: 50 });
      queue.add({ fen: 'bbbb', depth: 50 });
      const placeInfo = queue.checkPlace({ fen: 'bbbb', depth: 50 });
      expect(placeInfo.placeInQueue).toEqual(1);
    });
  });
});
