const config = require('config');
const fs = require('fs');
const stringifier = require('smart-stringifier');
const json5 = require('json5');

const evaluations = require('./all-evaluations');
const history = require('./all-history');
const queue = require('./main-queue');

module.exports.serialize = (serializable, fileName) => {
  if (serializable) {
    if (fs.existsSync(fileName) && serializable.load) {
      try {
        const data = fs.readFileSync(fileName);
        try {
          serializable.load(json5.parse(data));
        } catch (err) {
          console.error(`Could not parse ${fileName} content: ${data}`);
        }
      } catch (err) {
        console.error(`Could not load from '${fileName}':`, err);
      }
    }
    if (serializable.on) {
      serializable.on('change', (data) => {
        fs.writeFile(fileName, stringifier.stringify(data, 2), (err) => {
          if (err) {
            console.error(`Could not save to '${fileName}':`, err);
          }
        });
      });
    }
  }
};

module.exports.serializeAll = () => {
  this.serialize(evaluations, config.get('evaluationsFile'));
  this.serialize(history, config.get('historyFile'));
  this.serialize(queue, config.get('queueFile'));
};
