var debug = require('./debug');

const MEMORY_BYTE_SIZE               = 0x1000;
const RESERVED_MEMORY_BYTE_SIZE      = 0x200;
const REGISTER_BYTE_SIZE             = 0x10;
const STACK_BYTE_SIZE                = 0x10;

global.FONT_FIRST_ADDRESS_IN_MEMORY  = 0x0000;
global.FONT_BYTE_SIZE                = 0x5;
global.PROGRAM_ADDRESS_START         = 0x200;
global.DISPLAY_WIDTH_BYTES           = 0X40;
global.DISPLAY_HEIGHT_BYTES          = 0X20;

global.OP_SUCCESS                    = 0x00;
global.OP_ERROR                      = 0x01;
global.OP_SKIP_NEXT_INSTRUCTION      = 0x02;
global.OP_ERROR_NOT_IMPLEMENTED      = 0x04;

global.M  = new Uint8Array(MEMORY_BYTE_SIZE);      // Main Memory
global.V  = new Uint8Array(REGISTER_BYTE_SIZE);    // Register
global.S  = new Uint16Array(STACK_BYTE_SIZE);      // Stack
global.I  = 0x0000;                                // Address Register
global.PC = 0x0000;                                // Program Counter
global.SP = 0x00;                                  // Stack Pointer
global.DT = 0x0000;                                // Delay Timer
global.ST = 0x0000;                                // Sound Timer

global.display      = new Uint8Array(DISPLAY_WIDTH_BYTES *
                                     DISPLAY_HEIGHT_BYTES);  // Display Area

global.loadROMIntoMemory = function(ROM, callback) {
  var http = require('./http');

  /*  Hit server for ROM data  */
  debug.log('Getting ROM from server');
  http.get(ROM, function(rom) {

    /*  Load the rom uint8array into memory  */
    debug.log('Copying ROM to memory');
    M.set(rom, PROGRAM_ADDRESS_START);

    /*  Call the next function in the init sequence  */
    callback(rom.length);

  });

};

global.memInit = function() {
  debug.log('Loading fonts into memory');
  var fonts = require('./fonts');
  fonts.forEach(function(font, index) {
    M.set(font, FONT_FIRST_ADDRESS_IN_MEMORY + font.length * index);
  });
};

global.addSpriteToDisplay = function(sprite, x, y) {
  for (var i = 7; i >= 0; i--) {
    display[x + y * DISPLAY_WIDTH_BYTES + 7 - i] ^= sprite >> i & 1;
  }
};
