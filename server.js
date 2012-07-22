var express = require('express')
  , http = require('http')
  , colors = require('colors')
  , markdown = require('markdown').markdown
  , fs = require('fs')
  , PORT = process.env.PORT || 8000
  ;
  
var Game = require('./game').Game;
var game = new Game();

// match app routes before serving static file of that name
var app = express();
app.use(app.router);
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.on('login', function(opts) {
    console.log("logging in");
    game.addClient(socket, opts);
    socket.emit('articles', game.getArticles())
  });
  
  socket.on('logout', function() {
    game.removeClient(socket);
  });
  
  socket.on('disconnect', function() {
    console.log("disconnection occured");
    game.removeClient(socket);
  });
  
  socket.on('setArticle', function(articleId) {
    game.setArticle(socket, articleId);
  });
});

console.log('Your highness, at your service:'.yellow
  + ' http://localhost:%d'.magenta, PORT);

server.listen(PORT);
