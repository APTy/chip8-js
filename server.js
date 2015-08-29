var fs = require('fs');
var url = require('url');
var express = require('express');
var chip8 = express();

const ROM_DIRECTORY = './ROM/';

chip8.get('/roms', function(req, res) {
  var romQuery = url.parse(req.url, true).query;
  var romName = romQuery.name;
  var romURI = ROM_DIRECTORY + romName.toUpperCase();
  var romData = fs.readFile(romURI, function(err, data) {
    if (err) {
      console.log('Couldn\'t find rom data');
      return res.status(404).send();
    }
    console.log('Sending PONG rom data');
    return res.status(200).send(data);
  });
});

chip8.use(express.static('public'));

chip8.listen(3000, function() {
  console.log('CHIP-8 server up and running!');
});
