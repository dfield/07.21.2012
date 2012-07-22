var world = new World();
var socket = io.connect(window.location.hostname);
var loggedIn = false;

window.onclose = function() {
  socket.emit('disconnecting');
};

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
});

socket.on('articles', function(articlesData) {
  var lowestBoundX = -28;
  var uppestBoundX = 18;
  var lowestBoundY = -3;
  var uppestBoundY = 15; 

  nextRelatedPages = [];
  var grid = {rows: 2, cols: 5};
  var cellHeight = Math.ceil((uppestBoundY - lowestBoundY) / grid.rows);
  var cellWidth = Math.ceil((uppestBoundX - lowestBoundX) / grid.cols);
  var i = 0;
  var row = 0;
  var col = 0;
  var doItHigh = 0; // 0 or 1

  for (articleId in articlesData) {
    var article = new Article(articlesData[articleId].name, articleId);
    row = Math.floor(i/grid.cols);
    col = i % grid.cols;
    doItHigh = row % 2 ? i % 2 : (i + 1) % 2;
    var lowerBoundX = lowestBoundX + col * cellWidth + cellWidth/4;
    var upperBoundX = lowerBoundX + cellWidth/2;
    if (doItHigh) {
      var lowerBoundY = lowestBoundY + row * cellHeight + cellHeight/2;
      var upperBoundY = lowerBoundY + cellHeight/2;
    }
    else {
      var lowerBoundY = lowestBoundY + row * cellHeight;
      var upperBoundY = lowerBoundY + cellHeight/2;
    }
    var x = lowerBoundX + (Math.random() * (upperBoundX - lowerBoundX));
    var y = lowerBoundY + (Math.random() * (upperBoundY - lowerBoundY));
    var wikiPage = new WikiPage(article, [x, y], false);
    nextRelatedPages.push(wikiPage);
    i++;
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
  $("#article-target").html(articleTarget);
}

function setArticle(article) {
  socket.emit("setArticle", article.id);
}

function login(loginData) {
  if (loggedIn) return;
  socket.emit('login', loginData)
  loggedIn = true;
  $("#fb-login").addClass("logout");
  $("#target-wrapper").fadeIn();
  $("#splash").fadeOut();
}

function logout() {
  socket.emit('logout');
  $("#players").fadeOut();
  $("#target-wrapper").fadeOut();
}
