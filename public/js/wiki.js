var world = new World();
var socket = io.connect(window.location.hostname);
var loggedIn = false;

window.onclose = function() {
  socket.emit('disconnecting');
};

setInterval(function() { socket.emit('ping') }, 1000);

socket.emit('getNode', { 'node_id': 'data' });

socket.on('nodeData', function (data) {
  socket.emit('my other event', { my: 'data' });
});

socket.on('players', function(playerData) {
  for (var playerId in playerData) {
    world.players[playerId] = new Player(playerId);
  }
  world.applyPlayerDiff(playerData);
  displayPlayers();
});

socket.on('diff', function(diff) {
  world.applyPlayerDiff(diff);
  displayPlayers();
});

socket.on('articleTarget', function(articleTarget) {
  changeArticleTarget(articleTarget);
})

socket.on('articles', function(articlesData) {
  var lowerBound = -20;
  var upperBound = 20;
  
  nextRelatedPages = [];
  for (articleId in articlesData) {
    var article = new Article(articlesData[articleId].name, articleId);
    
    var x = lowerBound + (Math.random() * (upperBound - lowerBound));
    var y = lowerBound + (Math.random() * (upperBound - lowerBound));
    
    var wikiPage = new WikiPage(article, [x, y], false);
    nextRelatedPages.push(wikiPage);
  }

  // on the first receieve, the related pages array is empty
  if (relatedPages.length == 0) {
    useNewPages();
  }
});

function displayPlayers() {
  $("#players").html("");
  for (var playerId in world.players) {
    var player = world.players[playerId];
    var playerDiv = makeElement(".player");
    playerDiv.find(".name").text(player.name);
    playerDiv.find(".image").find("img").attr("src", "https://graph.facebook.com/" + player.facebookId + "/picture");
    playerDiv.find(".article").text(player.article.name);
    $("#players").append(playerDiv);
  }
  $("#players").fadeIn();
  $(".article").ellipsis();
}

function changeArticleTarget(articleTarget) {
  $("#article_target").text("Target: " + articleTarget);
}

function setArticle(article) {
  socket.emit("setArticle", article.id);
}

function login(loginData) {
  if (loggedIn) return;
  socket.emit('login', loginData)
  loggedIn = true;
  $("#fb-login").addClass("logout");
}

function logout() {
  socket.emit('logout');
  $("#players").fadeOut();
}
