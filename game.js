var Player = require('./public/js/player').Player;
var Article = require('./public/js/article').Article;
var World = require('./public/js/world').World;

/**
  * Monitor class takes care of diffs in the world.
  */
function Monitor(obj) {
  this.obj = obj;
  this.paths = {};
  this.oldValues = {};
}

Monitor.prototype.track = function(path) {
  this.paths[path] = new Function('obj', 'return obj.' + path);
  return this;
};

Monitor.prototype.dump = function() {
  var dump = {};
  for (var path in this.paths) {
    dump[path] = this.paths[path](this.obj);
  }
  return dump;
};

Monitor.prototype.diff = function() {
  var diff = {}, isEmpty = true;
  for (var path in this.paths) {
    var oldValue = this.oldValues[path];
    var newValue = this.paths[path](this.obj);
    if (newValue != oldValue) {
      diff[path] = this.oldValues[path] = newValue;
      isEmpty = false;
    }
  }
  return isEmpty ? null : diff;
};

/**
  * Game model.
  */
function Game() {
  this.world = new World();
  this.clients = {};
  this.articles = {1: new Article("Tala Huhe - Man of the Year"), 2: new Article("Devin Finzer - One cool dude")};
  this.players = {};
  this.nextPlayerId = 0;
}

Game.prototype.update = function() {
  // Calculate the diff between the new world and this one.
  var playersDiff = {};
  for (var playerId in this.players) {
    playersDiff[playerId] = this.players[playerId].monitor.diff();
  }
  
  // Now broadcast the change to all the clients.
  for (var id in this.clients) {
    this.clients[id].emit('diff', playersDiff);
  }
}

Game.prototype.getPlayers = function() {
  var playerDump = {};
  for (var playerId in this.players) {
    var player = this.players[playerId];
    var dump = player.monitor.dump();
    playerDump[playerId] = dump;
  }
  return playerDump;
}

Game.prototype.addClient = function(socket, opts) {
  if (socket.id in this.clients) {
    return;
  }
  
  // Make a new player.
  var playerId = this.nextPlayerId++;
  socket.playerId = playerId;
  var player = new Player();
  player.name = opts["name"];
  player.facebookId = opts["facebookId"];
  player.monitor = new Monitor(player)
    .track("article")
    .track("facebookId") 
    .track("name")    
  
  // Add the client to the dictionary.
  this.clients[socket.id] = socket;
  this.players[playerId] = player;
  
  // Broadcast the data to the existing clients.
  var playerData = this.getPlayers();
  for (var id in this.clients) {
    this.clients[id].emit('players', playerData);
  }
}

Game.prototype.removeClient = function(socket) {
  delete this.players[socket.playerId];
  delete this.clients[socket.id];
  
  // Broadcast the data.
  var playerData = this.getPlayers();
  for (var id in this.clients) {
    this.clients[id].emit('players', playerData);
  }
}

Game.prototype.setArticle = function(socket, articleId) {
  var player = this.players[socket.playerId];
  player.article = this.articles[articleId];
  this.update();
}

Game.prototype.newArticleTarget = function() {
  
}

exports.Game = Game;