function Player() {
  this.currentArticleId = null;
}

Player.prototype = { };

if (typeof exports != 'undefined') {
  exports.Player = Player;
}