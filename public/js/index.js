var socket = io();

socket.on('connect', function() {
  console.log('Connect');
})

socket.on('newMessage', function(msg) {
  var template = $("#message-template").html();
  var time = moment(msg.createAt).format('h:mm a');
  var html = Mustache.render(template, {
    time,
    from: msg.from,
    text: msg.text
  })

  $("#messages").append(html);
})

socket.on('newLocationMessage', function(msg) {
  var template = $("#location-message-template").html();
  var time = moment(msg.createAt).format('h:mm a');
  var html = Mustache.render(template, {
    time,
    from: msg.from,
    url: msg.url
  })

  $("#messages").append(html);
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
