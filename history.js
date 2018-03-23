let data = [];

exports.clear = () => {
  data = [];
};

exports.getMeanTime = () => {
};

exports.getAllData = () => data.slice();

exports.add = info => data.push(info);
