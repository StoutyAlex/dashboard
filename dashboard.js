require('babel-register')({
  only: [
      // /node_modules\/mozaik[^/]*\/src/,
      /src\/extensions\/[^/]*/,
      /server\/[^/]*/,
  ]
});

require('./server/index');
