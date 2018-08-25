var socket = io();

socket.on('connect', function() {
  console.log('Connect');

  // socket.emit('createMessage', {
  //   from: 'jen',
  //   text: 'Hello'
  // })
})

socket.on('newMessage', function(msg) {
  console.log('newMessage', msg)
})
