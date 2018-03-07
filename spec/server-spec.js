const request = require('supertest');
const app = require('../server');

describe('server', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  describe('POST /fen', () => {
    it('adds fen to queue for analysis', (done) => {
      const queue = require('../queue');
      spyOn(queue, 'add').and.stub();

      request(app)
        .post('/fen')
        .send({fen, depth: 40})
        .expect(200)
        .end((err, res) => {
          if(err) done(err);
          expect(queue.add).toHaveBeenCalledWith(fen, 40);
          done();
        });
    });
    it('triggers analysis from the top of the queue', (done) => {
      let analyzer = require('../analyzer');
      spyOn(analyzer, 'push').and.stub();
      request(app)
        .post('/fen')
        .send({fen, depth: 40})
        .end((err, res) => {
          if(err) done(err);
          expect(analyzer.push).toHaveBeenCalled();
          done();
        });
    });
  });
});
