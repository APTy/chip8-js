var express = require('express');
var chip8 = express();

chip8.use(express.static('public'));

chip8.listen(3000, function() {
  console.log('CHIP-8 server up and running!');
});
