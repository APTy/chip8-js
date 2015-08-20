var fs = require('fs');

const CURRENT_ROM = 'PONG';
const rom = {fd: undefined, size: undefined};

rom.fd = fs.openSync(CURRENT_ROM, 'r');
rom.size = fs.fstatSync(rom.fd).size;
const buf = new Buffer(rom.size);

fs.readSync(rom.fd, buf, 0, rom.size, 0);
const opcodes = buf.toString('hex');

for (var i=0; i < buf.length; i += 4) {
  console.log(opcodes.substring(i, i+4));
}
