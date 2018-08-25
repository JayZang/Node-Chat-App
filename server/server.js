const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { Users } = require('./utils/users');
const { isRealString } = require('./utils/validation')
const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public' )
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connect');

  socket.on('join', (params, cb) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      cb('Name and roon name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
    // 指定某個群組
    // 另一種方法，但自己也會收到訊息：
    // io.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
    cb();
  })

  socket.on('createMessage', (msg, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(msg.text)){
      // 包括自己所有socket都會傳送
      io.to(user.room).emit('newMessage',  generateMessage(user.name, msg.text));
      callback('This is from server');

      // 除了目前 socket 的廣播
      // socket.broadcast.to(user.room).emit('newMessage', generateMessage(msg.from, msg.text))
    }
  })

  socket.on('createLocationMessage', (position, callback) => {
    var user = users.getUser(socket.id);

    if(user){
      // 包括自己所有socket都會傳送
      io.to(user.room).emit('newLocationMessage',  generateLocationMessage(users.getUser(socket.id).name, position.lat, position.lng));
      callback('This is from server');
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnect');
    var user = users.removeUser(socket.id);

    if(user)
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has leave`));
  })
})

server.listen(port, () => {
  console.log('Server is started...')
})
