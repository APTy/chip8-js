var ops = require('./opcodes');
var debug = require('./debug');
var clock = require('./clock');
var input = require('./input');
var display = require('./display');

require('./memory');

/* CHIP-8 has 35 opcodes, which are all two bytes long and stored Big-endian. */
const OP_CODE_BYTE_LENGTH = 2;

/* Set current ROM for testing */
const CURRENT_ROM = 'PONG';

(function main() {

  debug.log('## Initializing');
  memInit();
  display.init();
  clock.init();
  input.init();

  /*  Load ROM into memory  */
  var romSize = loadROMIntoMemory(CURRENT_ROM, function(romSize) {
    debug.log('## Fetching first instruction');
    PC = PROGRAM_ADDRESS_START;

    /*  Start instruction cycle and continue every 1ms  */
    var disassembly = setInterval(cycle, 1);
  });

})();

function cycle() {
  /*  Increment the clock  */
  clock.tick();

  /*  Read in the next 2 bytes of data  */
  var instruction = (M[PC] << 8) + M[PC+1];
  PC += OP_CODE_BYTE_LENGTH;

  /*  The opcode is located at the 4 most significant bytes
            of each instruction. Shifting off the 12 least
            significant bytes will isolate the opcode.  */
  var op = instruction >> 0xC;

  /*  Send the instruction to the correct opcode, save opreturn  */
  var opReturn = ops[op](instruction);

  /*  Skip instruction if opreturn tells us to  */
  if (opReturn == OP_SKIP_NEXT_INSTRUCTION) {
    debug.log('Skipping instruction at address %s', PC);
    PC += OP_CODE_BYTE_LENGTH;
  } else if (opReturn == OP_ERROR_NOT_IMPLEMENTED) {
    console.error('Error: instruction %s not implemented', instruction.toString(16));
    clearInterval(disassembly);
  }
}
