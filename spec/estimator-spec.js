const fenAnalyzer = require('fen-analyzer');

const Estimator = require('../app/estimator');

const history = require('../app/all-history');

describe('estimator', () => {
  let estimator = null;
  const fen = 'abc';
  const depth = 100;
  const pieces = 30;
  const analyzer = { get currentAnalysisTime() { return 80; }, get activeFen() { return null; } };

  beforeEach(() => {
    estimator = new Estimator({ analyzer });
  });

  describe('estimateQueue', () => {
    it('checks history of analysis to specified depth', () => {
      spyOn(history, 'getMeanTime').and.stub();
      spyOn(fenAnalyzer, 'getPiecesCount').and.returnValue(pieces);
      estimator.estimateQueue([{ depth: 40 }]);
      expect(history.getMeanTime).toHaveBeenCalledWith({ depth: 40, pieces });
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
      spyOnProperty(analyzer, 'currentAnalysisTime').and.returnValue(80);
      spyOnProperty(analyzer, 'activeFen').and.returnValue(fen);
      expect(estimator.estimate({ depth: 40, fen })).toBeGreaterThan(0);
    });
    it('uses getMeanTime', () => {
      spyOn(history, 'getMeanTime').and.returnValue(65);
      expect(estimator.estimate({ fen, depth: 40 })).toEqual(65);
    });
    it('consider time when the analysis of the first position in queue started', () => {
      spyOn(history, 'getMeanTime').and.returnValue(90);
      spyOnProperty(analyzer, 'currentAnalysisTime').and.returnValue(30);
      spyOnProperty(analyzer, 'activeFen').and.returnValue(fen);
      expect(estimator.estimate({ fen, depth: 40 })).toEqual(60);
    });
    it('returns 20 min if no data at all', () => {
      spyOn(history, 'getMeanTime').and.returnValue(undefined);
      expect(estimator.estimate({ fen, depth: 50 })).toBe(20 * 60);
    });
    it('specify number of pieces while getting mean time', () => {
      spyOn(history, 'getMeanTime').and.stub();
      spyOn(fenAnalyzer, 'getPiecesCount').and.returnValue(pieces);
      estimator.estimate({ fen, depth });
      expect(history.getMeanTime).toHaveBeenCalledWith({ depth, pieces });
    });
  });
});
