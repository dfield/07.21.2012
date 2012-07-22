function World() {
  this.players = {};
  this.articleTarget = 1;
}

World.prototype.applyPlayerDiff = function(diff) {
  for (var playerId in diff) {
    var playerDiff = diff[playerId];
    var player = this.players[playerId];
    _applyDiff(player, playerDiff);
  }
}

// Map of paths to functions that modify the variable at that path
var diffCache = {};

function _applyDiff(obj, diff) {
  for (var path in diff) {
    if (!(path in diffCache)) {
      // Make sure path is reasonable
      if (!(/^\w+(\.\w+)*$/.test(path))) continue;
      diffCache[path] = new Function('obj', 'value', 'obj.' + path + ' = value');
    }
    diffCache[path](obj, diff[path]);
  }
}

if (typeof exports != 'undefined') {
  exports.World = World;
}