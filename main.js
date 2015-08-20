var fs = require('fs');

const CURRENT_ROM = 'PONG';
const OP_CODE_BYTE_LENGTH = 2;
const rom = {fd: undefined, size: undefined};

rom.fd = fs.openSync(CURRENT_ROM, 'r');
rom.size = fs.fstatSync(rom.fd).size;
const buf = new Buffer(rom.size);

fs.readSync(rom.fd, buf, 0, rom.size, 0);
disassemble(buf);

function disassemble(buffer) {
  for (var i=0; i < buffer.length; i += OP_CODE_BYTE_LENGTH) {
    var x = buffer.readUIntBE(i, OP_CODE_BYTE_LENGTH);
    console.log(x);
  }
}
