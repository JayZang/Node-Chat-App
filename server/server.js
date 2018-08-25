const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public' )
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connect');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app'
  })

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createAt: new Date().getTime()
  })

  socket.on('createMessage', function(msg) {

    // 包括自己所有socket都會傳送
    // io.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // })

    // 除了目前 socket 的廣播
    // socket.broadcast.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('disconnect', () => {
    console.log('User disconnect');
  })
})

server.listen(port, () => {
  console.log('Server is started...')
})
