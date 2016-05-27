var express = require('express');
var bodyParser = require('body-parser');
var chatbot = require('./chatbot');
var dicebot = require('./dicebot');

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) { 
	res.status(200).send('Hello world!') 
});

// chatbot
app.post('/hello', chatbot);

// dicebot
app.post('/roll', dicebot);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});