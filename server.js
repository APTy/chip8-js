var express = require('express');
var router = require('./server/router');
var chip8 = express();

chip8.use(router);
chip8.use(express.static(__dirname + '/public'));
chip8.listen(process.env.PORT || 3000, function() {
  console.log('CHIP-8 server up and running!');
});
