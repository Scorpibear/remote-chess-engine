const estimator = require('../estimator');
const history = require('../history');

describe('estimator', () => {
  describe('estimateQueue', () => {
    it('checks history of analysis to specified depth', () => {
      spyOn(history, 'getMeanTime').and.stub();
      estimator.estimateQueue([{ depth: 40 }]);
      expect(history.getMeanTime).toHaveBeenCalledWith({ depth: 40 });
    });
    it('consider time when the analysis of the first position in queue started');
    it('removes from mean time calculation the shorted if the time has passed');
  });
});
