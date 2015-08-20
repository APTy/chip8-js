var ops = require('./opcodes');

const OP_CODE_BYTE_LENGTH = 2;

function disassemble(buffer) {
  for (var i=0; i < buffer.length; i += OP_CODE_BYTE_LENGTH) {
    var opcode = buffer.readUIntBE(i, OP_CODE_BYTE_LENGTH);
    var op = opcode >> 0xc;
    ops[op](opcode);
  }
}

module.exports = disassemble;