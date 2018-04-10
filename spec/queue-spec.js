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
    it('does not allow to add empty fen', () => {
      const queue = new Queue();
      queue.add({ depth: 50 });
      expect(queue.toList()).toEqual([]);
    });
    it('does not allow to add empty depth', () => {
      const queue = new Queue();
      queue.add({ fen: 'something' });
      expect(queue.toList()).toEqual([]);
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
    it('returns the placeInQueue', () => {
      const queue = new Queue([task, { fen: 'aaa', depth: 50 }]);
      expect(queue.add({ fen: 'bcd', depth: 52 })).toEqual({ placeInQueue: 2 });
    });
    it('emits on change event');
  });
  describe('load', () => {
    it('loads new queue');
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
    it('works if depth in queue is higher', () => {
      const queue = new Queue([{ fen: 'sss', depth: 50 }]);
      expect(queue.checkPlace({ fen: 'sss', depth: 40 }).placeInQueue).toEqual(0);
    });
    it('skips if depth in queue is lower', () => {
      const queue = new Queue([{ fen: 'ddd', depth: 40 }]);
      expect(queue.checkPlace({ fen: 'ddd', depth: 50 }).placeInQueue).toBeUndefined();
    });
  });
  describe('getFirst', () => {
    it('returns the first element from the queue', () => {
      const queue = new Queue([{ fen: 'aaa', depth: 50 }]);
      expect(queue.getFirst()).toEqual({ fen: 'aaa', depth: 50 });
    });
  });
});
