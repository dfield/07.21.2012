var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , colors = require('colors')
  , markdown = require('markdown').markdown
  , fs = require('fs')
  , PORT = 8000
  ;

var node_one = {"title": "George bush", "connections": [2, 3]}
var graph = [];

// match app routes before serving static file of that name
app.use(app.router);
app.use(express.static(__dirname + '/public'));

//
// These routes only work if a static file has not already been served.
//
app.post('/', function(req, res, next) {
  if (req.query.input) {
    say('Your highness, ' + req.query.input + ' here and forever at your'
       + ' service.');
    res.end();
  }
});

io.sockets.on('connection', function (socket) {
  console.log("here");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log('Your highness, at your service:'.yellow
  + ' http://localhost:%d'.magenta, PORT);

app.listen(PORT);
