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
  this.facebookIds = {};
  this.articleTarget = new Article("Greylock", 2052339);
  this.articleTargetIndex = 0;
  this.articleTargets = [
    new Article("Baegun_Station", 548001),
    new Article("Anguk_Station", 378759)
  ];
  this.nextPlayerId = 0;
}

Game.prototype.update = function() {
  // Calculate the diff between the new world and this one.
  var playersDiff = {};
  for (var playerId in this.world.players) {
    playersDiff[playerId] = this.world.players[playerId].monitor.diff();
  }
  
  // Now broadcast the change to all the clients.
  for (var id in this.clients) {
    this.clients[id].emit('diff', playersDiff);
  }
}

Game.prototype.getPlayers = function() {
  var playerDump = {};
  for (var playerId in this.world.players) {
    var player = this.world.players[playerId];
    var dump = player.monitor.dump();
    playerDump[playerId] = dump;
  }
  return playerDump;
}

Game.prototype.addClient = function(socket, opts) {
  if (socket.id in this.clients) {
    return;
  }
  
  // If the same facebook user is logging in, we need a hack to refresh this user.
  if (opts["facebookId"] in this.facebookIds) {
    var client = this.clients[socket.id];
    var player = this.facebookIds[opts["facebookId"]];
    delete this.world.players[player.id];
    delete this.clients[socket.id];
  }
  
  // Make a new player.
  var playerId = this.nextPlayerId++;
  socket.playerId = playerId;
  var player = new Player();
  player.name = opts["name"];
  player.facebookId = opts["facebookId"];
  player.id = playerId;
  player.monitor = new Monitor(player)
    .track("article.name")
    .track("article.id")
    .track("facebookId") 
    .track("name")
  
  // Add the client to the dictionary.
  this.clients[socket.id] = socket;
  this.world.players[playerId] = player;
  this.facebookIds[player.facebookId] = player;
  
  // Broadcast the data to the existing clients.
  var playerData = this.getPlayers();
  for (var id in this.clients) {
    this.clients[id].emit('players', playerData);
  }
}

Game.prototype.removeClient = function(socket) {
  delete this.world.players[socket.playerId];
  delete this.clients[socket.id];
  
  // Broadcast the data.
  var playerData = this.getPlayers();
  for (var id in this.clients) {
    this.clients[id].emit('players', playerData);
  }
}

Game.prototype.setArticle = function(playerId, articleId) {
  var player = this.world.players[playerId];
  (function(self) {
    var currentArticle = self.redis.get(articleId, function(err, reply) {
      var currentArticle = JSON.parse(reply);
      player.article = new Article(currentArticle.page_title, articleId);
      if (player.article.id = self.articleTarget.id) {
        for (var clientId in self.clients) {
          self.clients[clientId].emit("articleTarget", "A new target yo.");
        }
      }
      self.update();
    });
  })(this);
}

Game.prototype.getArticles = function(socket, callback) { 
  var player = this.world.players[socket.playerId];
  var currentArticleId = player.article.id;
  var articlesData = {};
  this.redis.get(currentArticleId, function (err, reply) {
    var currentArticle = JSON.parse(reply);
    var connectedArticles = currentArticle.page_links;
    for (var i = 0; i < connectedArticles.length && i < 10; i++) {
      var article = connectedArticles[i];
      var articleData = {"id": article.id, "name": article.title};
      articlesData[article.id] = articleData;
    }
    callback(articlesData);
  });
}

exports.Game = Game;