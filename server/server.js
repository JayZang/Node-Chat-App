const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { isRealString } = require('./utils/validation')
const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public' )
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connect');

  socket.on('join', (params, cb) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      cb('Name and roon name are required');
    }

    socket.join(params.room);
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
    // 指定某個群組
    // 另一種方法，但自己也會收到訊息：
    // io.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
    cb();
  })

  socket.on('createMessage', (msg, callback) => {

    // 包括自己所有socket都會傳送
    io.emit('newMessage',  generateMessage(msg.from, msg.text));
    callback('This is from server');

    // 除了目前 socket 的廣播
    // socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text))
  })

  socket.on('createLocationMessage', (position, callback) => {

    // 包括自己所有socket都會傳送
    io.emit('newLocationMessage',  generateLocationMessage('Admin', position.lat, position.lng));
    callback('This is from server');
  })

  socket.on('disconnect', () => {
    console.log('User disconnect');
  })
})

server.listen(port, () => {
  console.log('Server is started...')
})
