const config = require('config');
const fs = require('fs');

const serializer = require('../app/serializer');

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
    it('logs error when error occured during file read', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(fs, 'readFileSync').and.throwError('file is locked');
      serializer.serialize(serializable, 'testfile.json');
      expect(console.error).toHaveBeenCalled();
    });
    it('does not work with file if serializable is not specified', () => {
      spyOn(fs, 'existsSync');
      serializer.serialize(null, 'testfile');
      expect(fs.existsSync).not.toHaveBeenCalled();
    });
    it('logs error if passed object is not serializable', () => {
      spyOn(console, 'error').and.stub();
      serializer.serialize({ random: 'object' }, 'filename');
      expect(console.error).toHaveBeenCalled();
    });
    it('logs error when error occured during file save', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'writeFile').and.callFake((filename, data, callback) => { callback('save error'); });
      let onChange;
      spyOn(serializable, 'on').and.callFake((event, callback) => { onChange = callback; });
      serializer.serialize(serializable, 'test.json');
      onChange();
      expect(console.error).toHaveBeenCalled();
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
