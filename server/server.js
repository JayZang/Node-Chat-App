const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public' )
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connect');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', (msg, callback) => {

    // 包括自己所有socket都會傳送
    io.emit('newMessage',  generateMessage(msg.from, msg.text));
    callback('This is from server');

    // 除了目前 socket 的廣播
    // socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text))
  })

  socket.on('disconnect', () => {
    console.log('User disconnect');
  })
})

server.listen(port, () => {
  console.log('Server is started...')
})
