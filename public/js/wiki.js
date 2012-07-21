var socket = io.connect('http://localhost:7000');
socket.emit('getNode', { 'node_id': 'data' });
socket.on('nodeData', function (data) {
  socket.emit('my other event', { my: 'data' });
});

socket.on('players')

function addPlayer(userId) {
  socket.emit('addPlayer', {'user_id': userId})
}