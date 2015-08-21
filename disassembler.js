require('./memory');
require('./returnCodes');
var ops = require('./opcodes');

/* CHIP-8 has 35 opcodes, which are all two bytes long and stored Big-endian. */
const OP_CODE_BYTE_LENGTH = 2;

function disassemble(buffer) {
  while (PC < buffer.length) {

    /*        Read in the next 2 bytes of data        */
    var instruction = buffer.readUIntBE(PC, OP_CODE_BYTE_LENGTH);
    PC += OP_CODE_BYTE_LENGTH;

    /*        The opcode is located at the 4 most significant bytes
              of each instruction. Shifting off the 12 least
              significant bytes will isolate the opcode.          */
    var op = instruction >> 0xC;

    /*        Lookup the op function in the ops table and send it
              the requisite instruction. If the function returns
              OP_SKIP_NEXT_INSTRUCTION, then we'll increment the
              counter `i` to do so.        */
    if (ops[op](instruction) == OP_SKIP_NEXT_INSTRUCTION) {
      debug.log('Skipping instruction %s: %s', PC, buffer.readUIntBE(PC, OP_CODE_BYTE_LENGTH));
      PC += OP_CODE_BYTE_LENGTH;
    }
  }
}

module.exports = disassemble;
