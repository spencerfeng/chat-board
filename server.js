const http = require('http');
const app = require('./server/app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('new-channel-added', channel => {
    socket.broadcast.emit('new-channel-added-broadcast-from-server', channel);
  });

  socket.on('new-message-added', message => {
    socket.broadcast.emit('new-message-added-broadcast-from-server', message);
  });

  socket.on('message-deleted', message => {
    socket.broadcast.emit('message-deleted-broadcast-from-server', message);
  });

  socket.on('channel-deleted', data => {
    socket.broadcast.emit('channel-deleted-broadcast-from-server', data);
  });
});

server.listen(port);