var debug = require('./debug');

const MEMORY_BYTE_SIZE                  = 0x1000;
const RESERVED_MEMORY_BYTE_SIZE         = 0x200;
const REGISTER_BYTE_SIZE                = 0x10;
const STACK_BYTE_SIZE                   = 0x10;

global.FONT_FIRST_ADDRESS_IN_MEMORY     = 0x0000;
global.PROGRAM_ADDRESS_START            = 0x200;

global.M  = new Uint8Array(MEMORY_BYTE_SIZE);           // Memory
global.V  = new Uint8Array(REGISTER_BYTE_SIZE);         // Register
global.S  = new Uint16Array(STACK_BYTE_SIZE);           // Stack
global.I  = 0x0000;                                     // Address Register
global.PC = 0x0000;                                     // Program Counter
global.SP = 0x00;                                       // Stack Pointer
global.DT = 0x0000;                                     // Delay Timer
global.ST = 0x0000;                                     // Sound Timer

var _nextAvailableAddress = RESERVED_MEMORY_BYTE_SIZE;

global.loadROMIntoMemory = function(ROM) {
  var fs = require('fs');

  /*        Open the ROM and get its size        */
  debug.log('Opening ROM');
  const romFd = fs.openSync(ROM, 'r');
  const romSize = fs.fstatSync(romFd).size;

  /*        Read the ROM into a Buffer object as hexadecimal        */
  debug.log('Loading ROM to buffer');
  const romBuf = new Buffer(romSize);
  fs.readSync(romFd, romBuf, 0, romSize, 0);

  /*        Load the buffer into memory so that we can forget about it        */
  debug.log('Copying ROM to memory');
  M.set(romBuf, _nextAvailableAddress);

  return romSize;
};

global.loadFonts = function() {
  debug.log('Loading fonts into memory');
  var fonts = require('./fonts');
  fonts.forEach(function(font, index) {
    M.set(font, FONT_FIRST_ADDRESS_IN_MEMORY + font.length * index);
  });
}
