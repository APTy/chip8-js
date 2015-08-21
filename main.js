var fs = require('fs');
var debug = require('./debug');
var disassemble = require('./disassembler');

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

  /*        Run the disassembler on the romBuffer        */
  debug.log('Starting disassembly');
  disassemble(romBuf);
})();
