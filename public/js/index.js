var socket = io();

socket.on('connect', function() {
  console.log('Connect');
})

socket.on('newMessage', function(msg) {
  var li = $("<li/>");
  li.text(`${msg.from}: ${msg.text}`);

  $("#messages").append(li);
})

socket.on('newLocationMessage', function(msg) {
  var li = $("<li/>");
  var a = $("<a target='_blank'>My Current location</a>").attr("href", msg.url);
  li.text(`${msg.from}: `);
  li.append(a);

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

$("#sendGeolacation").on("click", function() {
  if(!navigator.geolocation)
    return alert('Geolacation is not supported by your your browser.');

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }, function() {

    })
  }, function () {
    alert('Unable to fetch location.')
  })
})
