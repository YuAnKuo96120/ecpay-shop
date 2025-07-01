const http = require('http');

module.exports = {
  RandomChar: (num) => {
    const string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < num; i += 1) {
      str += string.charAt(Math.floor(Math.random() * string.length));
    }
    return str;
  },
  latest: (str) => {
    return new Promise((resolve, reject) => {
      if (str) {
        apiRequest(str, resolve, reject);
      }
    })
  }
}


// function
const apiRequest = (str, resolve, reject) => {
  const url = {
    host: 'api.fixer.io',
    path: '/' + str,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  http.get(url, (response) => {
    let body = [];
    response.on('data', (chunk) => {
      //console.log(chunk);
      body.push(chunk);
    });
    response.on('end', () => {
      if (response.statusCode == 200) {
        const result = Buffer.concat(body).toString();
        const newResult = JSON.parse(result);
        resolve(newResult);
      } else {
        reject('error');
      }
    })
  })
}
