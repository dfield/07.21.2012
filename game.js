var Player = require('./public/js/player').Player;

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
  this.clients = {};
  this.players = {};
  this.nextPlayerId = 0;
}

Game.prototype.update = function() {
  var diff = [];
  for (var clientId in this.clients) {
  }
}

Game.prototype.addClient = function(socket, opts) {
  // Make a new player.
  var playerId = this.nextPlayerId++;
  var player = new Player();
  player.name = opts["name"];
  player.monitor = new Monitor(player)
    .track("currentArticle")
    .track('name')    
  
  // Add the client to the dictionary.
  this.clients[socket.id] = socket;
  this.players[playerId] = player;
  
  // Broadcast the data.
  var dump = player.monitor.dump();
  for (var id in this.clients) {
    if (id != socket.id) {
      this.clients[id].emit('addPlayer', playerId, dump);
    }
  }
}

exports.Game = Game;