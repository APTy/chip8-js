var debug = require('./debug');
var clock = require('./clock');
var input = require('./input');
var display = require('./display');
var disassemble = require('./disassembler');

require('./memory');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing

(function main() {
  debug.log('## Initializing');
  loadFonts();
  display.init();
  clock.init();
  input.init();

  debug.log('Loading ROM into memory');
  var romSize = loadROMIntoMemory(CURRENT_ROM, function(romSize) {

    debug.log('## Starting disassembler');
    disassemble(PROGRAM_ADDRESS_START, romSize);

  });
})();
