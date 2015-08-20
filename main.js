var fs = require('fs');
var disassemble = require('./disassembler');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing

(function main() {
  /*        Open the ROM and get its size        */
  const romFd = fs.openSync(CURRENT_ROM, 'r');
  const romSize = fs.fstatSync(romFd).size;

  /*        Read the ROM into a Buffer object as hexadecimal        */
  const romBuf = new Buffer(romSize);
  fs.readSync(romFd, romBuf, 0, romSize, 0);

  /*        Run the disassembler on the romBuffer        */
  disassemble(romBuf);
})();
