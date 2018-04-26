const estimator = require('../estimator');
const history = require('../all-history');
const analyzer = require('../analyzer');

describe('estimator', () => {
  describe('estimateQueue', () => {
    it('checks history of analysis to specified depth', () => {
      spyOn(history, 'getMeanTime').and.stub();
      estimator.estimateQueue([{ depth: 40 }]);
      expect(history.getMeanTime).toHaveBeenCalledWith({ depth: 40 });
    });
    it('calls estimate with specified fen and depth', () => {
      spyOn(estimator, 'estimate').and.stub();
      estimator.estimateQueue([{ fen: 'qqq', depth: 50 }]);
      expect(estimator.estimate).toHaveBeenCalledWith({ fen: 'qqq', depth: 50 });
    });
  });
  describe('estimate', () => {
    it('does not allow negative estimations', () => {
      spyOn(history, 'getMeanTime').and.returnValue(70);
      spyOn(analyzer, 'getActiveFen').and.returnValue('abc');
      spyOn(analyzer, 'getCurrentAnalysisTime').and.returnValue(80);
      expect(estimator.estimate({ depth: 40, fen: 'abc' })).toBeGreaterThan(0);
    });
    it('uses getMeanTime', () => {
      spyOn(history, 'getMeanTime').and.returnValue(65);
      expect(estimator.estimate({ fen: 'cdf', depth: 40 })).toEqual(65);
    });
    it('consider time when the analysis of the first position in queue started', () => {
      spyOn(history, 'getMeanTime').and.returnValue(90);
      spyOn(analyzer, 'getCurrentAnalysisTime').and.returnValue(30);
      spyOn(analyzer, 'getActiveFen').and.returnValue('abc');
      expect(estimator.estimate({ fen: 'abc', depth: 40 })).toEqual(60);
    });
    it('returns 20 min if no data at all', () => {
      spyOn(history, 'getMeanTime').and.returnValue(undefined);
      expect(estimator.estimate({ fen: 'abc', depth: 50 })).toBe(20 * 60);
    });
  });
});
