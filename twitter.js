try {

var config = require('./config')
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , twitter = require('ntwitter');

function getFormattedDate() {
    var date = new Date();
    // var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var str = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
   return str;
}

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

    twit.verifyCredentials(function (err, credential) {
      if (data.track!='stop_following') {
        console.log('Connected with ' + credential.screen_name);
        io.sockets.volatile.emit('tweet', { message: getFormattedDate() + ' Connected to Twitter Stream API' });
        io.sockets.volatile.emit('tweet', { message: getFormattedDate() + ' Following: '+ data.track });
      }
    });

    twit.stream('statuses/filter', { track: [data.track] }, function(stream) {
      stream.on('data', function (datas) {
        if (data.track=='stop_following') {
          io.sockets.volatile.emit('tweet', { message: 'Disconnected from stream' });
          stream.destroy;
        } else {
          if (datas.disconnect!=null && datas.disconnect.code==7) {
            console.log('Disconnected from stream');
            io.sockets.volatile.emit('tweet', { message: 'Disconnected from stream' });
            stream.destroy;
          } else {
            io.sockets.volatile.emit('tweet', {
              user: datas.user.screen_name,
              text: datas.text,
              profile_image_url: datas.user.profile_image_url
            });
          }
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