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

  var messageBox = $('input[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageBox.val()
  }, function() {
    messageBox.val('');
  })
})

var locationBtn = $("#sendGeolacation");
locationBtn.on("click", function() {
  if(!navigator.geolocation){
    return alert('Geolacation is not supported by your your browser.');
  }

  locationBtn.prop('disabled', true).text('Sending location...');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationBtn.prop('disabled', false).text('Send location');
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }, function() {

    })
  }, function () {
    locationBtn.prop('disabled', false).text('Send location');
    alert('Unable to fetch location.')
  })
})
