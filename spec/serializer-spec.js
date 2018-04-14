const config = require('config');
const fs = require('fs');

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
    it('calls load with output of file as object', () => {
      spyOn(fs, 'readFileSync').and.returnValue('{"a":70}');
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(serializable, 'load');
      serializer.serialize(serializable, 'some-file');
      expect(serializable.load).toHaveBeenCalledWith({ a: 70 });
    });
    it('writes to file on change', () => {
      spyOn(fs, 'writeFile').and.stub();
      let onChange;
      spyOn(serializable, 'on').and.callFake((event, callback) => { onChange = callback; });
      serializer.serialize(serializable, 'test-file');

      onChange();

      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
  describe('serializeAll', () => {
    it('calls serialize()', () => {
      spyOn(config, 'get').and.returnValue('filename.json');
      spyOn(serializer, 'serialize').and.stub();
      serializer.serializeAll();
      expect(serializer.serialize).toHaveBeenCalledWith(jasmine.anything(), 'filename.json');
    });
  });
});
