const expect = require('expect');

var { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some msg';
    var message = generateMessage(from, text);

    expect(typeof message.createAt).toBe('number');
    expect(message).toMatchObject({
      from,
      text
    })    
  })
})
