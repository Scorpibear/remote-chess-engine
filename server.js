var express = require('express'),
app = express(),
port = process.env.PORT || 9977;

app.get('/', (req, res) => {
  res.send('<a href="https://raw.githubusercontent.com/Scorpibear/ricpa-specification/master/README.md">Please, check specification for supported API methods</a>');
});

app.get('/fen', (req, res) => {
  res.send(JSON.stringify({"status": "Not implemented yet"}));
});

app.get('/queue', (req, res) => {
  res.send('Not implemented yet')
});

app.put('/fen', (req, res) => {
  res.send('Not implemented yet')
});

app.listen(port);

console.log('remote chess engine start at port ' + port);