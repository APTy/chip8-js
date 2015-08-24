var fs = require('fs');
var express = require('express');
var chip8 = express();

const ROM_DIRECTORY = './ROM/';

chip8.get('/pong', function(req, res) {
  console.log('Opening PONG rom');
  var romURI = ROM_DIRECTORY + 'pong'.toUpperCase();
  var opts = {encoding: 'base64'}
  var romData = fs.readFile(romURI, opts, function(err, data) {
    console.log('Sending PONG rom data');
    res.status(200).send(data);
  });
});

chip8.use(express.static('public'));

chip8.listen(3000, function() {
  console.log('CHIP-8 server up and running!');
});
