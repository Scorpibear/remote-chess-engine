const estimator = require('../estimator');
const history = require('../history');
const analyzer = require('../analyzer');

describe('estimator', () => {
  describe('estimateQueue', () => {
    it('checks history of analysis to specified depth', () => {
      spyOn(history, 'getMeanTime').and.stub();
      estimator.estimateQueue([{ depth: 40 }]);
      expect(history.getMeanTime).toHaveBeenCalledWith({ depth: 40 });
    });
    it('consider time when the analysis of the first position in queue started', () => {
      spyOn(history, 'getMeanTime').and.returnValue(90);
      spyOn(analyzer, 'getCurrentAnalysisTime').and.returnValue(30);
      expect(estimator.estimate({ depth: 40 })).toEqual(60);
    });
    it('removes from mean time calculation the shorted if the time has passed');
  });
  describe('estimate', () => {
    it('uses getMeanTime', () => {
      spyOn(history, 'getMeanTime').and.returnValue(65);
      expect(estimator.estimate({ fen: 'abc', depth: 40 })).toEqual(65);
    });
    it('returns 20 min if no data at all', () => {
      spyOn(history, 'getMeanTime').and.returnValue(undefined);
      expect(estimator.estimate({ fen: 'abc', depth: 50 })).toBe(20 * 60);
    });
  });
});