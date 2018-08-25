var generateMessage = (from, text) => {
  return {
    from,
    text,
    createAt: new Date().getTime()
  }
}

var generateLocationMessage = function(from, lat, lng) {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}
