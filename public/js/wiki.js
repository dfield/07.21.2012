var socket = io.connect('http://localhost:7000');
socket.on('news', function (data) {
  socket.emit('my other event', { my: 'data' });
});
