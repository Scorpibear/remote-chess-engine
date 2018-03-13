const express = require('express');
const queue = require('./queue');
const analyzer = require('./analyzer');

const app = express();
const port = process.env.PORT || 9977;

app.get('/', (req, res) => {
  res.send('Check <a href="https://github.com/Scorpibear/remote-chess-engine">README</a> for supported API methods.');
});

app.get('/fen', (req, res) => {
  res.send(JSON.stringify({ bestMove: undefined, estimatedTime: undefined }));
});

app.post('/fen', (req, res) => {
  req.on('data', (chunk) => {
    try {
      const data = JSON.parse(chunk);
      const queueInfo = queue.add(data.fen, data.depth);
      res.send(queueInfo);
      analyzer.push();
    } catch (err) {
      console.error('POST /fen: ', err);
    }
  });
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
