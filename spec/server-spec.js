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
    it('returns place in queue starting from 0', (done) => {
      request(app)
        .post('/fen').send({ fen, depth: 40 })
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.placeInQueue).toBe(0);
          done();
        });
    });
    it('returns estimated time to analyze', (done) => {
      request(app)
        .post('/fen').send({ fen, depth: 5 })
        .end((err, res) => {
          expect(res.body.estimatedTime).toBeUndefined();
          done();
        });
    });
  });
});
