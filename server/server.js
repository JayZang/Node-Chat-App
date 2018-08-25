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
    from: 'John',
    text: "My name is John",
    createdAt: 1231234
  })

  socket.on('createMessage', function(msg) {
    console.log('Create Msg:', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnect');
  })
})

server.listen(port, () => {
  console.log('Server is started...')
})
