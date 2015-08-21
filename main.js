var fs = require('fs');
var debug = require('./debug');
var disassemble = require('./disassembler');

require('./memory');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing

(function main() {
  /*        Open the ROM and get its size        */
  debug.log('Opening ROM');
  const romFd = fs.openSync(CURRENT_ROM, 'r');
  const romSize = fs.fstatSync(romFd).size;
  debug.log('ROM File size:', romSize);

  /*        Read the ROM into a Buffer object as hexadecimal        */
  const romBuf = new Buffer(romSize);
  fs.readSync(romFd, romBuf, 0, romSize, 0);
  debug.log('Loaded ROM to buffer');

  /*        Load the ROM into memory so that we can forget about it        */
  debug.log('Loading ROM into memory');
  loadIntoMemory(romBuf);

  /*        Run the disassembler on the romBuffer        */
  debug.log('Starting disassembler');
  disassemble(PROGRAM_ADDRESS_START, romBuf.length);
})();
