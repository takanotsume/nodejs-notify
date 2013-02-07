Twitter notify
==============

Twitter notify implemented with Express 3.x and Socket.io.

## Installation

Clone GIT repository and install dependencies.

``` shell
git clone https://github.com/takanotsume/nodejs-notify.git
cd nodejs-notify
npm install
```

### Setup Twitter Keys 

Rename the file config.sample.js into config.js

``` shell
cp config.sample.js config.js 
```

The keys listed below can be obtained from [dev.twitter.com](http://dev.twitter.com) after [setting up a new App](https://dev.twitter.com/apps/new).

``` config.js
// Go to https://dev.twitter.com/apps
config.twitter.consumer_key = '',
config.twitter.consumer_secret = '',
config.twitter.access_token_key = '',
config.twitter.access_token_secret = ''
```

## Running

``` shell
node twitter.js
```

The app will be running on port 3000
