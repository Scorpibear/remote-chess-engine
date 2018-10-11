const Serializable = require('../app/serializable');

describe('Serializable', () => {
  let serializable;
  beforeEach(() => {
    serializable = new Serializable();
  });

  it('allows to subscribe on change event', () => {
    const listener = { onchange: () => {} };
    spyOn(listener, 'onchange');
    serializable.on('change', listener.onchange);
    serializable.emitChangeEvent();
    expect(listener.onchange).toHaveBeenCalled();
  });
  it('uses getAllData during emitChangeEvent', () => {
    const data = { some: 'data' };
    spyOn(serializable, 'getAllData').and.returnValue(data);
    spyOn(serializable, 'emit');
    serializable.emitChangeEvent();
    expect(serializable.emit).toHaveBeenCalledWith('change', data);
  });
});
