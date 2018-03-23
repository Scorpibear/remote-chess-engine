const express = require('express');
const queue = require('./main-queue');
const analyzer = require('./analyzer');
const evaluations = require('./evaluations');
const estimator = require('./estimator');

const app = express();
const port = process.env.PORT || 9977;

app.get('/', (req, res) => {
  res.send('Check <a href="https://github.com/Scorpibear/remote-chess-engine">README</a> for supported API methods.');
});

app.get('/fen', (req, res) => {
  const data = { fen: req.query.fen, depth: req.query.depth };
  const evaluation = evaluations.get(data);
  if (evaluation.bestMove) {
    res.json(evaluation);
  } else {
    const placeInfo = queue.checkPlace(data);
    res.json({ placeInQueue: placeInfo.placeInQueue, estimatedTime: placeInfo.estimatedTime });
  }
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
  req.on('data', (chunk) => {
    try {
      const data = JSON.parse(chunk);
      queue.delete(data.fen);
      res.send();
    } catch (err) {
      console.error('DELETE /fen: ', err);
    }
  });
});

app.get('/queue', (req, res) => {
  const queueData = queue.toList();
  const queueDataEstimated = estimator.estimateQueue(queueData);
  res.send(queueDataEstimated);
});

const server = app.listen(port);

console.log(`remote chess engine started at port ${port}`);

module.exports = server;
