var players = {};
var socket = io.connect('http://localhost:7000');

socket.emit('getNode', { 'node_id': 'data' });

socket.on('nodeData', function (data) {
  socket.emit('my other event', { my: 'data' });
});

socket.on('players', function(playerData) {
  players = playerData;
  displayPlayers();
});

function displayPlayers() {
  $("#players").html("");
  for (var playerId in players) {
    var player = players[playerId];
    var playerDiv = makeElement(".player");
    playerDiv.find(".name").text(player.name);
    playerDiv.find(".image").find("img").attr("src", "https://graph.facebook.com/" + player.facebookId + "/picture")
    $("#players").append(playerDiv);
  }
}

function login(loginData) {
  socket.emit('login', loginData)
}

function logout() {
  socket.emit('logout')
}