const serializer = require('../serializer');

describe('serializer', () => {
  describe('serialize', () => {
    let serializable;
    beforeEach(() => {
      serializable = { load: () => {}, on: () => {} };
    });
    it('does not load if file does not exist', () => {
      spyOn(serializable, 'load');
      serializer.serialize(serializable, 'not-existent-file');
      expect(serializable.load).not.toHaveBeenCalled();
    });
    it('calls load with output of file');
    it('writes to file on change');
  });
});
