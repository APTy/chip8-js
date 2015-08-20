var ops = require('./opcodes');
var RC = require('./returnCodes');

const OP_CODE_BYTE_LENGTH = 2;

function disassemble(buffer) {
  for (var i=0; i < buffer.length; i += OP_CODE_BYTE_LENGTH) {
    var opcode = buffer.readUIntBE(i, OP_CODE_BYTE_LENGTH);
    var op = opcode >> 0xc;
    if (ops[op](opcode) == RC.OP_SKIP_NEXT_INSTRUCTION) {
      i += OP_CODE_BYTE_LENGTH;
    }
  }
}

module.exports = disassemble;
