var debug = require('./debug');
var clock = require('./clock');
var display = require('./display');
var disassemble = require('./disassembler');

require('./memory');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing

(function main() {
  debug.log('## Initializing');
  loadFonts();
  display.init();
  clock.init();

  debug.log('Loading ROM into memory');
  var romSize = loadROMIntoMemory(CURRENT_ROM);

  debug.log('## Starting disassembler');
  disassemble(PROGRAM_ADDRESS_START, romSize);
})();
