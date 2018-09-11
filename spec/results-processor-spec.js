const http = require('http');

const evaluations = require('../all-evaluations');
const resultsProcessor = require('../results-processor');

describe('resultsProcessor', () => {
  describe('process', () => {
    const pingUrl = 'http://pingurl.com/api/ping';
    const fen = 'rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2';
    const bestMove = 'Nf6';
    const task = { fen, depth: 10, pingUrl };
    const score = -1.23;
    const depth = 10;
    const results = { bestmove: bestMove, info: [{ score: { value: 123 } }] };

    it('saves evaluation with adjusted score', async () => {
      spyOn(evaluations, 'save').and.stub();
      resultsProcessor.process({ task, results });
      expect(evaluations.save).toHaveBeenCalledWith({
        fen, depth: 10, bestMove, score: -1.23
      });
    });
    it('transforms extended algebraic notation to short one', () => {
      spyOn(evaluations, 'save').and.stub();
      resultsProcessor.process({ task, results: { bestmove: 'd5e4', info: results.info } });
      expect(evaluations.save).toHaveBeenCalledWith({
        fen, depth, bestMove: 'dxe4', score
      });
    });
    it('send POST request to ping url after saving analysis', () => {
      spyOn(http, 'get').and.returnValue({ on: () => {} });
      resultsProcessor.process({ task, results });
      expect(http.get).toHaveBeenCalledWith(pingUrl);
    });
    it('do not call http.get if no pingUrl', () => {
      spyOn(http, 'get').and.returnValue({ on: () => {} });
      resultsProcessor.process({ task: { fen, depth: 100 }, results });
      expect(http.get).not.toHaveBeenCalled();
    });
    it('logs error if no score object in results.info[0]', () => {
      spyOn(console, 'error').and.stub();
      resultsProcessor.process({ task, results: { bestmove: 'e4', info: [{ other: 'info' }] } });
      expect(console.error).toHaveBeenCalled();
    });
    it('logs error if no value property in score object of results.info[0]', () => {
      spyOn(console, 'error').and.stub();
      resultsProcessor.process({ task, results: { bestmove: 'e4', info: [{ score: { no: 'value' } }] } });
      expect(console.error).toHaveBeenCalled();
    });
    it('logs error if no bestmove property in results', () => {
      spyOn(console, 'error').and.stub();
      resultsProcessor.process({ task, results: { info: results.info } });
      expect(console.error).toHaveBeenCalled();
    });
    it('logs error if error occured during GET request via pingUrl', () => {
      let errorCallback = () => {};
      const clientRequest = {
        on: (event, callback) => {
          if (event === 'error') errorCallback = callback;
        }
      };
      spyOn(http, 'get').and.returnValue(clientRequest);
      spyOn(console, 'error');
      resultsProcessor.process({ task, results });
      errorCallback({ message: 'invalid url' });
      expect(console.error).toHaveBeenCalled();
    });
  });
});
