const config = require('config');
const fs = require('fs');

const evaluations = require('./evaluations');
const history = require('./history');
const queue = require('./main-queue');

module.exports.serialize = (serializable, fileName) => {
  if (serializable) {
    if (fs.existsSync(fileName) && serializable.load) {
      try {
        const data = fs.readFileSync(fileName);
        serializable.load(JSON.parse(data));
      } catch (err) {
        console.error(`Could not load from '${fileName}':`, err);
      }
    }
    if (serializable.on) {
      serializable.on('change', (data) => {
        try {
          fs.writeFile(fileName, JSON.stringify(data, 2));
        } catch (err) {
          console.error(`Could not save to '${fileName}':`, err);
        }
      });
    }
  }
};

module.exports.serializeAll = () => {
  this.serialize(evaluations, config.get('evaluationsFile'));
  this.serialize(history, config.get('historyFile'));
  this.serialize(queue, config.get('queueFile'));
};