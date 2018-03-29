const request = require('supertest');
const app = require('../server');
const queue = require('../main-queue');
const analyzer = require('../analyzer');
const evaluations = require('../evaluations');
const estimator = require('../estimator');

describe('server', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  describe('GET /fen', () => {
    it('returns bestMove and depth for evaluated fens', (done) => {
      spyOn(evaluations, 'get').and.returnValue({ bestMove: 'e4', depth: 35 });
      request(app)
        .get('/fen')
        .send({ fen, depth: 33 })
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.bestMove).toBe('e4');
          expect(res.body.depth).toBe(35);
          done();
        });
    });
    it('returns placeInQueue and estimatedTime if not evaluated yet', (done) => {
      spyOn(evaluations, 'get').and.returnValue({ bestMove: undefined });
      spyOn(queue, 'checkPlace').and.returnValue({ placeInQueue: 1, estimatedTime: 200000 });
      request(app)
        .get('/fen')
        .send({ fen, depth: 33 })
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.bestMove).toBeUndefined();
          expect(res.body.placeInQueue).toBe(1);
          expect(res.body.estimatedTime).toBe(200000);
          done();
        });
    });
    it('returns placeInQueue undefined if not added to queue for analysis yet', (done) => {
      spyOn(evaluations, 'get').and.returnValue({ bestMove: undefined });
      spyOn(queue, 'checkPlace').and.returnValue({ placeInQueue: undefined, estimatedTime: undefined });
      request(app)
        .get('/fen')
        .send({ fen, depth: 33 })
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.placeInQueue).toBeUndefined();
          done();
        });
    });
  });

  describe('POST /fen', () => {
    it('adds fen to queue for analysis', (done) => {
      spyOn(queue, 'add').and.stub();

      request(app)
        .post('/fen')
        .send({ fen, depth: 40 })
        .expect(200)
        .end((err) => {
          if (err) done(err);
          expect(queue.add).toHaveBeenCalledWith({ fen, depth: 40 });
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
  describe('DELETE /fen', () => {
    it('delete specified fen from the queue', (done) => {
      spyOn(queue, 'delete');
      request(app)
        .delete('/fen').send({ fen })
        .expect(200)
        .end((err) => {
          if (err) done(err);
          expect(queue.delete).toHaveBeenCalledWith(fen);
          done();
        });
    });
  });
  describe('GET /queue', () => {
    it('gets queue as [{fen, depth, estimatedTime}, ...]', (done) => {
      const queueData = [{ fen, depth: 50 }];
      const queueDataEstimated = [{ fen, depth: 50, estimatedTime: '0:05:34' }];
      spyOn(queue, 'toList').and.returnValue(queueData);
      spyOn(estimator, 'estimateQueue').and.returnValue(queueDataEstimated);
      request(app)
        .get('/queue')
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).toEqual(queueDataEstimated);
          expect(estimator.estimateQueue).toHaveBeenCalledWith(queueData);
          done();
        });
    });
  });
});
