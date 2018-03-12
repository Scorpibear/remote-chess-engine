const request = require('supertest');
const app = require('../server');
const queue = require('../queue');
const analyzer = require('../analyzer');

describe('server', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  describe('POST /fen', () => {
    it('adds fen to queue for analysis', (done) => {
      spyOn(queue, 'add').and.stub();

      request(app)
        .post('/fen')
        .send({ fen, depth: 40 })
        .expect(200)
        .end((err) => {
          if (err) done(err);
          expect(queue.add).toHaveBeenCalledWith(fen, 40);
          done();
        });
    });
    it('triggers analysis from the top of the queue', (done) => {
      spyOn(analyzer, 'push').and.stub();
      request(app)
        .post('/fen')
        .send({ fen, depth: 40 })
        .end((err) => {
          if (err) done(err);
          expect(analyzer.push).toHaveBeenCalled();
          done();
        });
    });
    it('returns place in queue', (done) => {
      spyOn(queue, 'add').and.returnValue({ placeInQueue: 3 });
      request(app)
        .post('/fen').send({ fen, depth: 40 })
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.placeInQueue).toBe(3);
          done();
        });
    });
    it('returns estimated time to analyze', (done) => {
      spyOn(queue, 'add').and.returnValue({ estimatedTime: 1234567 });
      request(app)
        .post('/fen').send({ fen, depth: 5 })
        .end((err, res) => {
          expect(res.body.estimatedTime).toBe(1234567);
          done();
        });
    });
  });
});
