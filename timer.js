let started;

exports.getTimePassed = () => Math.ceil((Date.now() - started) / 1000);
exports.start = () => {
  started = Date.now();
};
