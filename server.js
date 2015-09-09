var fs = require('fs');
var url = require('url');
var express = require('express');
var chip8 = express();

const ROM_DIRECTORY = './ROM/';
const CH8_EXTENSION = '.ch8';
var romList = null;

chip8.get('/roms', function(req, res) {
  var romQuery = url.parse(req.url, true).query;
  var romName = romQuery.name;
  var romURI = ROM_DIRECTORY + romName + CH8_EXTENSION;
  var romData = fs.readFile(romURI, function(err, data) {
    if (err) {
      console.log('Couldn\'t find rom data');
      return res.status(404).send();
    }
    console.log('Sending PONG rom data');
    return res.status(200).send(data);
  });
});

chip8.get('/list', function(req, res) {
  if (romList === null) {
    return res.send(404).send();
  }
  return res.status(200).send(romList);
});

chip8.use(express.static('public'));

chip8.listen(3000, function() {
  console.log('CHIP-8 server up and running!');
});

// Get current list of roms
fs.readdir(ROM_DIRECTORY, function(err, data) {
  if (err) {
    console.log('Couldn\'t get list of roms');
  }
  console.log('Retrieved list of roms');
  romList = data.map(function(rom) {
    // Return the rom without its extension
    return rom.split('.')[0];
  });
});
