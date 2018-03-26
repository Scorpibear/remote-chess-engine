const defaultTime = 20 * 60; // in seconds
let data = [];
const timeMap = new Map();

exports.clear = () => {
  data = [];
  timeMap.clear();
};

exports.getMeanTime = ({ depth }) => {
  const timeInfo = timeMap.get(depth);
  if (timeInfo) {
    return Math.ceil(timeInfo.sum / timeInfo.count);
  }
  return defaultTime;
};

exports.getAllData = () => data.slice();

exports.add = ({ depth, time }) => {
  data.push({ depth, time });
  if (timeMap.has(depth)) {
    const timeData = timeMap.get(depth);
    timeData.sum += time;
    timeData.count += 1;
  } else {
    timeMap.set(depth, { sum: time, count: 1 });
  }
};
