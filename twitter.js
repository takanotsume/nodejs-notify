var config = require('./config')
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , twitter = require('ntwitter');

server.listen(3000);

var twit = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

twit.stream('statuses/filter', { track: ['@RTBFinfo'] }, function(stream) {
  stream.on('data', function (data) {
    io.sockets.volatile.emit('tweet', {
      user: data.user.screen_name,
      text: data.text,
      profile_image_url: data.user.profile_image_url
    });
  });
});

io.sockets.on('connection', function (socket) {
  socket.on('track', function (data) {
    console.log(data.track);
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
