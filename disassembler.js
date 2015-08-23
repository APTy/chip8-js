require('./memory');
require('./returnCodes');
var ops = require('./opcodes');
var clock = require('./clock');
var debug = require('./debug');

/* CHIP-8 has 35 opcodes, which are all two bytes long and stored Big-endian. */
const OP_CODE_BYTE_LENGTH = 2;

function disassemble(startAddress, programLength) {

  PC = startAddress;

  while (PC < startAddress + programLength) {

    /*        We should leave some room to handle other
              events that the processor needs to make from
              time to time. FIXME: add this as part of 'main'
              or a separate 'processor' as it's not
              heavily related to disassembly        */
    doEvents();

    /*        Read in the next 2 bytes of data        */
    var instruction = (M[PC] << 8) + M[PC+1];
    PC += OP_CODE_BYTE_LENGTH;

    /*        The opcode is located at the 4 most significant bytes
              of each instruction. Shifting off the 12 least
              significant bytes will isolate the opcode.          */
    var op = instruction >> 0xC;
    // console.log('OPCODE:', instruction.toString(16));

    /*        Lookup the op function in the ops table and send it
              the requisite instruction. If the function returns
              OP_SKIP_NEXT_INSTRUCTION, then we'll increment the
              counter `i` to do so.        */
    var opReturn = ops[op](instruction);

    if (opReturn == OP_SKIP_NEXT_INSTRUCTION) {
      debug.log('Skipping instruction at address %s', PC);
      PC += OP_CODE_BYTE_LENGTH;
      continue;
    } else if (opReturn == OP_ERROR_NOT_IMPLEMENTED) {
      console.error('Error: instruction %s not implemented', instruction.toString(16));
      break;
    }
  }
}

function doEvents() {
  clock.tick();
}

module.exports = disassemble;
