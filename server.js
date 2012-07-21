var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(7000)
  , colors = require('colors')
  , markdown = require('markdown').markdown
  , fs = require('fs')
  , PORT = process.env.PORT || 8000
  ;
  
var game = require('./game').game;

// match app routes before serving static file of that name
app.use(app.router);
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  socket.on('getNode', function (data) {
    socket.emit("nodeData", {"title": "Tala Huhe - Emperor of China"})
  });
});

console.log('Your highness, at your service:'.yellow
  + ' http://localhost:%d'.magenta, PORT);

app.listen(PORT);
