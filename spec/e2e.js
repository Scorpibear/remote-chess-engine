const request = require('supertest');

const sample = {
  fen: 'r7/pp1b2pk/3p3p/8/2BQP1n1/2N2qP1/PP5P/1R4K1 b - - 1 1',
  expectedBestMove: 'Ne3'
};

describe('As a user', () => {
  it('is possible to post fen for analysis and get results later', (done) => {
    const req = request('http://localhost:9977');
    req.post('/fen').send({ fen: sample.fen, depth: 1 }).expect(200, done);
    req
      .get('/fen')
      .send({ fen: sample.fen, depth: 1 })
      .expect(200, {
        bestMove: sample.expectedBestMove,
        depth: 1
      }, done);
  });
});
