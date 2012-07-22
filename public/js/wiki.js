var world = new World();
var socket = io.connect(window.location.hostname);

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

socket.on('articles', function(articlesData) {
  relatedPages = [];
  for (articleId in articlesData) {
    console.log(articlesData[articleId]);
    var article = new Article(articleId);
    article.name = articlesData[articleId].name;
    console.log(article);
    var wikiPage = new WikiPage(article, [10, 10], false);
    console.log(wikiPage);
    relatedPages.push(wikiPage);
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
    playerDiv.find(".article").ellipsis();
  }
}

function setArticle(article) {
  socket.emit("setArticle", article.id);
}

function login(loginData) {
  socket.emit('login', loginData)
}

function logout() {
  socket.emit('logout')
}
