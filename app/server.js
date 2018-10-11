#!/usr/bin/env node

const config = require('config');
const express = require('express');
const fenAnalyzer = require('fen-analyzer');

const Analyzer = require('./master-analyzer');
const Estimator = require('./estimator');

const queue = require('./main-queue');
const evaluations = require('./all-evaluations');
const serializer = require('./serializer');

const app = express();
const port = config.get('port') || 9977;
serializer.serializeAll();

const analyzer = new Analyzer({ fenAnalyzer });
const estimator = new Estimator({ analyzer });

app.get('/', (req, res) => {
  res.send('Check <a href="https://github.com/Scorpibear/remote-chess-engine">README</a> for supported API methods.');
});

app.get('/fen', (req, res) => {
  const data = { fen: req.query.fen, depth: req.query.depth };
  console.log('GET /fen with ', data);
  const evaluation = evaluations.get(data);
  if (evaluation && evaluation.bestMove) {
    console.log('sending ready evalution: ', evaluation);
    res.json(evaluation);
  } else {
    const placeInfo = queue.checkPlace(data);
    res.json({ placeInQueue: placeInfo.placeInQueue, estimatedTime: estimator.estimate(data) });
  }
});

app.post('/fen', (req, res) => {
  req.on('data', (chunk) => {
    try {
      const data = JSON.parse(chunk);
      console.log(`POST /fen ${data.fen} depth ${data.depth} pingUrl ${data.pingUrl}`);
      const queueInfo = queue.add({ fen: data.fen, depth: data.depth, pingUrl: data.pingUrl });
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
      console.log(`DELETE /fen ${data.fen}`);
      queue.delete(data.fen);
      res.send();
    } catch (err) {
      console.error('DELETE /fen: ', err);
    }
  });
});

app.get('/queue', (req, res) => {
  console.log('GET /queue');
  const queueData = queue.toList();
  const queueDataEstimated = estimator.estimateQueue(queueData);
  res.send(queueDataEstimated);
});

const server = app.listen(port);

Object.assign(server, { analyzer, estimator });

console.log(`remote chess engine started at port ${port}`);

analyzer.push();

module.exports = server;
