const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { nanoid } = require('nanoid');

//user count
let userCount = 0;
let userInfo = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

//connection
io.on('connection', (socket) => {
  //user connect listener
  userCount++;
  io.emit('user data', { userCount: userCount }); // This will emit the event to all connected sockets
  socket.on('userLogin', (data) => {
    const idsUsed = userInfo.map((info) => info.id);
    if (!idsUsed.includes(data)) {
      console.log(data);
      const coloursUsed = userInfo.map((info) => info.colour);
      if (coloursUsed.includes('green')) {
        userInfo.push({ id: data, colour: 'red' });
        socket.emit('user id', { id: data, colour: 'red' });
      } else {
        userInfo.push({ id: data, colour: 'green' });
        socket.emit('user id', { id: data, colour: 'green' });
      }
    }
    console.log('user info: ', userInfo);
    if (userInfo.length > 2) {
      throw `Error: only two users can be connected`;
    }
  });

  //disconnect listener
  socket.on('disconnect', () => {
    userCount--;
    io.emit('user data', { userCount: userCount }); // This will emit the event to all connected sockets
  });

  //click listener
  socket.on('click handler', (msg) => {
    console.log(msg);
    io.emit('click handler', msg);
  });
  //game win
  socket.on('game over', (msg) => {
    console.log(msg);
    io.emit('game over', msg);
  });
});

//server listen
server.listen(4000, () => {
  console.log('listening on *:4000');
});
