function Player() {
  this.article = 0;
}

Player.prototype = { };

if (typeof exports != 'undefined') {
  exports.Player = Player;
}