try {

var config = require('./config')
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , twitter = require('ntwitter');

server.listen(3000);

io.sockets.on('connection', function (socket) {

  socket.on('track', function (data) {

    console.log(data.track);

    var twit = new twitter({
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.consumer_secret,
      access_token_key: config.twitter.access_token_key,
      access_token_secret: config.twitter.access_token_secret
    });

    twit.verifyCredentials(function (err, data) {
      console.log('Connected with ' + data.screen_name);
    });

    twit.stream('statuses/filter', { track: [data.track] }, function(stream) {
      stream.on('data', function (datas) {
        if (datas.disconnect!=null && datas.disconnect.code==7) {
          console.log('Disconnected from stream');
          stream.destroy;
        } else {
          io.sockets.volatile.emit('tweet', {
            user: datas.user.screen_name,
            text: datas.text,
            profile_image_url: datas.user.profile_image_url
          });
        }
      });
      setTimeout(stream.destroy, 60000);
    });

    /*
  	twit.search(data.track, {}, function(err, data) {
  	  data.results.forEach(function(item){
  	    io.sockets.volatile.emit('tweet', {
  	      user: item.from_user_name,
  	      text: item.text,
  	      profile_image_url: item.profile_image_url
  	    });
  	  });
  	});
    */

  });

});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

} catch (e) {
  console.log(e);
}