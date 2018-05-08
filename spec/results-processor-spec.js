const http = require('http');

const evaluations = require('../all-evaluations');
const resultsProcessor = require('../results-processor');
const queue = require('../main-queue');

describe('resultsProcessor', () => {
  describe('process', () => {
    it('saves evaluation', async () => {
      const results = { bestmove: 'Nf3', info: [{ score: { value: 123 } }] };
      const task = { fen: 'bbb', depth: 50 };
      spyOn(evaluations, 'save').and.stub();
      resultsProcessor.process({ task, results });
      expect(evaluations.save).toHaveBeenCalledWith({
        fen: 'bbb', depth: 50, bestMove: 'Nf3', score: 123
      });
    });
    it('send POST request to ping url after saving analysis', () => {
      const pingUrl = 'http://pingurl.com/api/ping';
      const task = { fen: 'ccc', depth: 10, pingUrl };
      spyOn(http, 'get').and.returnValue({ on: () => {} });
      spyOn(queue, 'getFirst').and.returnValue(task);
      resultsProcessor.process({ task, results: { info: [{ score: { value: 12 } }] } });
      expect(http.get).toHaveBeenCalledWith(pingUrl);
    });
    it('logs error if no score object in results.info[0]');
  });
});
