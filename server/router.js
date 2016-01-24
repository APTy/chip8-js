var fs = require('fs');
var router = require('express').Router();
var rom_info = require('./rom_info');

const ROM_DIRECTORY = './ROM/';
const CH8_EXTENSION = '.ch8';

/**
* Reponds to a request for a list of all ROMs.
**/
router.route('/roms')
.get(function(req, res) {
  return res.status(200).send(rom_info);
});

/**
* Responds to a request for a specified ROM's JSON metadata.
**/
router.route('/roms/:rom_name/json')
.get(function(req, res) {
  // Verify that we have the ROM
  if (!rom_info.hasOwnProperty(req.params.rom_name)) return res.status(404).send();

  // Respond with the ROM JSON detail
  return res.status(200).send(rom_info[req.params.rom_name]);
});

/**
* Responds to a request for a specified ROM's binary data.
**/
router.route('/roms/:rom_name/bin')
.get(function(req, res) {
  var rom_uri = ROM_DIRECTORY + req.params.rom_name + CH8_EXTENSION;
  var romData = fs.readFile(rom_uri, function(err, data) {
    // Verify that we found the file
    if (err) return res.status(404).send();

    // Respond with the ROM binary data
    return res.status(200).send(data);
  });
});

module.exports = router;
