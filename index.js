const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));


io.on('connection', (socket) => {
  //init user
  console.log('a user connected');
  //disconnect listener
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  //event emitter
  socket.on('click listener', (msg) => {
    console.log(msg)
    io.emit('click listener', 'they are clicking')
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
