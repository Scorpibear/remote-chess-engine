var express = require('express'),
app = express(),
port = process.env.PORT || 9977;

app.get('/', (req, res) => {
  res.send('This remote chess engine supports <a href="https://github.com/Scorpibear/ricpa-specification/releases/tag/v0.1">RICPA specification</a>. Check it for supported API methods.');
});

app.get('/fen', (req, res) => {
  res.send(JSON.stringify({"bestmove": undefined, "estimatedTime": undefined}));
});

app.post('/fen', (req, res) => {
  res.send('Not implemented yet');
});

app.delete('/fen', (req, res) => {
  res.send('Not implemented yet');
});

app.get('/queue', (req, res) => {
  res.send('Not implemented yet');
});

app.listen(port);

console.log('remote chess engine start at port ' + port);