var fs = require('fs');
var smalloc = require('smalloc');

const CURRENT_ROM = 'PONG';
const rom = {fd: undefined, size: undefined};

rom.fd = fs.openSync(CURRENT_ROM, 'r');
rom.size = fs.fstatSync(rom.fd).size;

var buf = new Buffer(rom.size);
var game = fs.readSync(rom.fd, buf, 0, rom.size, 0);
var opcodes = buf.toString('hex');
var i;

for (i=0; i < buf.length; i += 4) {
  console.log(opcodes.substring(i, i+4));
}
