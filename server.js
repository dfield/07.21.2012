var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , colors = require('colors')
  , markdown = require('markdown').markdown
  , fs = require('fs')
  , PORT = process.env.PORT || 8000
  ;
  
var Game = require('./game').Game;
var game = new Game();

// match app routes before serving static file of that name
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.on('login', function(opts) {
    game.addClient(socket, opts);
    socket.emit('articles', game.getArticles())
  });
  
  socket.on('logout', function() {
    game.removeClient(socket);
  });
  
  socket.on('disconnect', function() {
    game.removeClient(socket);
  });
  
  socket.on('setArticle', function(articleId) {
    game.setArticle(socket, articleId);
  });
});

console.log('Your highness, at your service:'.yellow
  + ' http://localhost:%d'.magenta, PORT);

app.listen(PORT);
