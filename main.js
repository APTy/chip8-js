var debug = require('./debug');
var disassemble = require('./disassembler');

require('./memory');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing

(function main() {
  debug.log('## Initializing');
  loadFonts();

  debug.log('Loading ROM into memory');
  var romSize = loadROMIntoMemory(CURRENT_ROM);

  debug.log('## Starting disassembler');
  disassemble(PROGRAM_ADDRESS_START, romSize);
})();
