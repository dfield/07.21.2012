function Player() {
  this.article = null;
}

Player.prototype = { };

if (typeof exports != 'undefined') {
  exports.Player = Player;
}