if (typeof require != 'undefined') {
  var Article = require('./article').Article;
}

function Player() {
  this.article = new Article("Starting article, yo.", 1482587);
}

Player.prototype = { };

if (typeof exports != 'undefined') {
  exports.Player = Player;
}