const express = require('express');
const queue = require('./queue');
const analyzer = require('./analyzer');

const app = express();
const port = process.env.PORT || 9977;

app.get('/', (req, res) => {
  res.send('This remote chess engine supports <a href="https://github.com/Scorpibear/ricpa-specification/releases/tag/v0.1">RICPA specification</a>. Check it for supported API methods.');
});

app.get('/fen', (req, res) => {
  res.send(JSON.stringify({ bestmove: undefined, estimatedTime: undefined }));
});

app.post('/fen', (req, res) => {
  req.on('data', (chunk) => {
    try {
      const data = JSON.parse(chunk);
      queue.add(data.fen, data.depth);
      analyzer.push();
    } catch (err) {
      console.error('POST /fen: ', err);
    }
  });
  res.send({ placeInQueue: 0, estimatedTime: undefined });
});

app.delete('/fen', (req, res) => {
  res.send('Not implemented yet');
});

app.get('/queue', (req, res) => {
  res.send('Not implemented yet');
});

const server = app.listen(port);

console.log(`remote chess engine started at port ${port}`);

module.exports = server;
