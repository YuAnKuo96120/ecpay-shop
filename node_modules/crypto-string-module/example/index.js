const server = require('../server');

// RandomChar function
console.log(server.RandomChar(12));

// fixer function
server.latest('2018-02-27').then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
