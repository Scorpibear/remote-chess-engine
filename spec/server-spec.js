describe('server', () => {
  let app = require('../server');
  let request = require('supertest');
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  describe('POST /fen', () => {
    it('adds fen to queue for analysis', done => {
      let queue = require('../queue');
      spyOn(queue, 'add').and.stub();

      request(app)
        .post('/fen')
        .send({fen, depth: 40})
        .expect(200)
        .end(function(err, res) {
          if (err) done(err);
          expect(queue.add).toHaveBeenCalledWith(fen, 40);
          done();
        });
    });
  });
});
