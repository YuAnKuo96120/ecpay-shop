const { expect } = require('chai');

const server = require('../server');


// describe block
describe('Random strings', () => {
 
  it('should exist', () => {
    const randomStr = server.RandomChar(10);
    expect(randomStr).to.exist;
  });
});
