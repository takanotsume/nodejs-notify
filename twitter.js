var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , twitter = require('ntwitter');

server.listen(3000);

// Go to https://dev.twitter.com/apps
var twit = new twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

twit.stream('statuses/filter', { track: ['#SRCC'] }, function(stream) {
  stream.on('data', function (data) {
    io.sockets.volatile.emit('tweet', {
      user: data.user.screen_name,
      text: data.text
    });
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
