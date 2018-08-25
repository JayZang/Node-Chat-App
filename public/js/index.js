var socket = io();

socket.on('connect', function() {
  console.log('Connect');
})

socket.on('newMessage', function(msg) {
  console.log('newMessage', msg);
  var li = $("<li/>");
  li.text(`${msg.from}: ${msg.text}`);

  $("#messages").append(li);
})

$("#message-form").on("submit", function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('input[name=message]').val()
  }, function() {

  })
})
