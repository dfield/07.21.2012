if (typeof require != 'undefined') {
  var Article = require('./article').Article;
}

function Player() {
  this.article = new Article("Tala's great adventure omg what a long article!!!", 1);
}

Player.prototype = { };

if (typeof exports != 'undefined') {
  exports.Player = Player;
}