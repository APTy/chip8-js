var fs = require('fs');
var disassemble = require('./disassembler');

const CURRENT_ROM = 'PONG';
const rom = {fd: undefined, size: undefined};

(function main() {
  rom.fd = fs.openSync(CURRENT_ROM, 'r');
  rom.size = fs.fstatSync(rom.fd).size;
  const buf = new Buffer(rom.size);

  fs.readSync(rom.fd, buf, 0, rom.size, 0);
  disassemble(buf);
})();
