var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , colors = require('colors')
  , markdown = require('markdown').markdown
  , fs = require('fs')
  , PORT = process.env.PORT || 8000
  ;

var graph = {};
var fileContents = fs.readFileSync("graphData.json",'utf8'); 
graph = JSON.parse(fileContents);

var Game = require('./game').Game;
var game = new Game();
game.graph = graph;

// Configure redis.
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}
game.redis = redis;

for (var id in graph) {
  var articleData = JSON.stringify(graph[id]);
  redis.set(id, articleData);
}

// match app routes before serving static file of that name
app.use(app.router);
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  socket.on('login', function(opts) {
    game.addClient(socket, opts);
    game.getArticles(socket, function(data) {
      socket.emit('articles', data);
    });
    socket.emit('articleTarget', game.articleTarget.name);
    socket.emit('currentArticle', game.world.players[socket.playerId].article.name)
  });
  
  socket.on('logout', function() {
    game.removeClient(socket);
  });
  
  socket.on('disconnect', function() {
    game.removeClient(socket);
  });
  
  socket.on('setArticle', function(articleId) {
    game.setArticle(socket.playerId, articleId);
    game.getArticles(socket, function(data) {
      socket.emit('articles', data);
    });
  });

});

console.log('Your highness, at your service:'.yellow
  + ' http://localhost:%d'.magenta, PORT);

app.listen(PORT);
