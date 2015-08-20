var fs = require('fs');
var disassemble = require('./disassembler');

const CURRENT_ROM = 'PONG';   // Set current ROM for testing
const ROM = {fd: undefined, size: undefined};

(function main() {
  /*        Open the ROM and read get its size        */
  ROM.fd = fs.openSync(CURRENT_ROM, 'r');
  ROM.size = fs.fstatSync(ROM.fd).size;

  /*        Read the ROM into a buffer object as hexadecimal        */
  const buf = new Buffer(ROM.size);
  fs.readSync(ROM.fd, buf, 0, ROM.size, 0);

  /*        Run the disassembler on the buffer        */
  disassemble(buf);
})();
