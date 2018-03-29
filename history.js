const timeMap = new Map(); // depth => [time1, time2, ...]

exports.clear = () => {
  timeMap.clear();
};

exports.getMeanTime = ({ depth }) => {
  const data = timeMap.get(depth);
  if (data) {
    if (data.length % 2 === 1) {
      return data[Math.floor(data.length / 2)];
    }
    return Math.ceil((data[data.length / 2] + data[(data.length / 2) - 1]) / 2);
  }
  return undefined;
};

exports.getAllData = () => Array.from(timeMap);

exports.add = ({ depth, time }) => {
  if (timeMap.has(depth)) {
    const timeData = timeMap.get(depth);
    timeData.push(time);
  } else {
    timeMap.set(depth, [time]);
  }
};
