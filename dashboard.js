require('babel-register')({
  only: [
      // /node_modules\/mozaik[^/]*\/src/,
      /src\/extensions\/[^/]*/,
      /server\/[^/]*/,
      /server.js/,
  ]
});

require('./src/server');
