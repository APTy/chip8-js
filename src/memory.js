/**
* Returns a new MemoryManager instance.
* @constructor
**/
function MemoryManager() {
  this.main      = new Uint8Array(MemoryManager.MEMORY_BYTE_SIZE);      // Main Memory
  this.registers = new Uint8Array(MemoryManager.REGISTER_BYTE_SIZE);    // Register
  this.stack     = new Array();                                         // Stack
  this.addr_reg  = 0;                                                   // Address Register
  this.instr_ptr  = 0;                                                   // Program Counter
  this.stack_ptr = 0;                                                   // Stack Pointer
  this.delay_tmr = 0;                                                   // Delay Timer
  this.sound_tmr = 0;                                                   // Sound Timer
  this.display   = new Uint8Array(MemoryManager.DISPLAY_WIDTH_BYTES * MemoryManager.DISPLAY_HEIGHT_BYTES);  // Display Area
}

MemoryManager.MEMORY_BYTE_SIZE               = 0x1000;
MemoryManager.RESERVED_MEMORY_BYTE_SIZE      = 0x0200;
MemoryManager.PROGRAM_ADDRESS_START          = 0x0200;
MemoryManager.FONT_FIRST_ADDRESS_IN_MEMORY   = 0x0000;
MemoryManager.REGISTER_BYTE_SIZE             = 0x10;
MemoryManager.STACK_BYTE_SIZE                = 0x10;
MemoryManager.FONT_BYTE_SIZE                 = 0x05;
MemoryManager.DISPLAY_WIDTH_BYTES            = 0x40;
MemoryManager.DISPLAY_HEIGHT_BYTES           = 0x20;
MemoryManager.OP_CODE_BYTE_LENGTH            = 0x02;

/**
* Load initial memory and set pointers to initial values for applications.
**/
MemoryManager.prototype.initialize = function() {
  var fonts = require('./fonts');
  this.load_fonts(fonts);
  this.addr_reg = MemoryManager.PROGRAM_ADDRESS_START;
  this.instr_ptr = MemoryManager.PROGRAM_ADDRESS_START;
};


///////////////////////////////////////////////////////////////////////////////
//////                       Main Memory Management                      //////
///////////////////////////////////////////////////////////////////////////////

/**
* Loads an arraybuffer into memory at the memory pointer's location.
* @arg {Uint8Array} buffer - data to load
**/
MemoryManager.prototype.load_into_memory = function(buffer) {
  this.main.set(buffer, this.addr_reg);
  this.addr_reg += buffer.length;
};

/**
* Loads preset fonts into memory.
* @arg {Uint8Array} fonts - font data to load
**/
MemoryManager.prototype.load_fonts = function(fonts) {
  this.addr_reg = MemoryManager.FONT_FIRST_ADDRESS_IN_MEMORY;
  this.load_into_memory(fonts);
}

/**
* Copy `n` bytes from memory at the address register to location `x`, `y`.
* @arg {Number} x - the x-coordinate at which to draw the sprite
* @arg {Number} x - the y-coordinate at which to draw the sprite
* @arg {Number} n - the number of bytes to be drawn
*
* Each byte contains 8 bits of information, which can be used to draw 8 pixels
* (only one bit of information is needed to draw in a black/white system).
*
*     e.g: 0xE7 == 0b11100111
*
* This number will draw three light pixels, followed by two dark pixels,
* followed by three light pixels (eight total), displayed horizontally. This
* is the storage/display system for fonts as well as user-defined sprites.
*
**/
MemoryManager.prototype.draw_sprite_from_addr_reg = function(x, y, n) {
  var clearedPixel = false;
  var sprite = this.read_at_addr_reg(n);
  x = this.registers[x];
  y = this.registers[y];
  for (var j = 0; j < n; j++) {
    for (var i = 7; i >= 0; i--) {
      this.display[x + (y + j) * MemoryManager.DISPLAY_WIDTH_BYTES + 7 - i] ^= sprite[j] >> i & 1;
      if (this.display[x + (y + j) * MemoryManager.DISPLAY_WIDTH_BYTES + 7 - i] === 0 && (sprite[j] >> i & 1) === 1)
        clearedPixel = true; // Check if pixel was cleared
    }
  }
  return clearedPixel // Return whether a pixel was cleared during the op
};

/**
* Read in the next instruction (2 bytes of data) and increment the instruction pointer.
**/
MemoryManager.prototype.read = function() {
  var instruction = (this.main[this.instr_ptr] << 8) + this.main[this.instr_ptr + 1];
  this.instr_ptr += MemoryManager.OP_CODE_BYTE_LENGTH;
  return instruction;
};

/**
* Skip in the next instruction (2 bytes of data).
**/
MemoryManager.prototype.skip = function() {
  this.read();
};

/**
* Jump to an address.
**/
MemoryManager.prototype.jump_to = function(addr) {
  this.instr_ptr = addr;
};

/**
* Jump to an address and save the current execution address to the call stack.
**/
MemoryManager.prototype.fn_call = function(addr) {
  this.stack.push(this.instr_ptr);
  this.jump_to(addr);
};

/**
* Return to the address at the top of the call stack.
**/
MemoryManager.prototype.fn_return = function(addr) {
  this.instr_ptr = this.stack.pop();
};

/**
* Iterate over the entire display memory store.
**/
MemoryManager.prototype.for_each_display_pixel = function(callback) {
  for(var i = 0; i < this.display.length; i++) {
    callback(this.display[i], i);
  }
};

/**
* Clear the values of the entire display memory store.
**/
MemoryManager.prototype.clear_display = function() {
  for(var i = 0; i < this.display.length; i++) {
    this.display[i] = 0;
  }
};

///////////////////////////////////////////////////////////////////////////////
//////                        Register Management                        //////
///////////////////////////////////////////////////////////////////////////////

/**
* Get the value of a standard register.
**/
MemoryManager.prototype.get_register = function(register) {
  return this.registers[register];
};

/**
* Set the value of a standard register.
**/
MemoryManager.prototype.set_register = function(register, val) {
  this.registers[register] = val;
};

/**
* Read `bytes` number of bytes from the memory at the address register I.
**/
MemoryManager.prototype.read_at_addr_reg = function(bytes) {
  var buf = new Uint8Array(bytes);
  for (var i = 0; i < bytes; i++) {
    buf[i] = this.main[this.addr_reg + i];
  }
  return buf;
};

/**
* Write a buffer to the memory at address register I.
**/
MemoryManager.prototype.write_at_addr_reg = function(buffer) {
  this.main.set(buffer, this.addr_reg);
};

/**
* Set the address stored in address register I.
**/
MemoryManager.prototype.set_addr_reg = function(val) {
  this.addr_reg = val;
};

/**
* Get the address stored in address register I.
**/
MemoryManager.prototype.get_addr_reg = function() {
  return this.addr_reg;
};

///////////////////////////////////////////////////////////////////////////////
//////                              Timers                               //////
///////////////////////////////////////////////////////////////////////////////

/**
* Get the current value of the delay timer.
**/
MemoryManager.prototype.get_delay_tmr = function() {
  return this.delay_tmr;
};

/**
* Set the current value of the delay timer.
**/
MemoryManager.prototype.set_delay_tmr = function(val) {
  this.delay_tmr = val;
};

/**
* Get the current value of the sound timer.
**/
MemoryManager.prototype.get_sound_tmr = function() {
  return this.sound_tmr;
};

/**
* Set the current value of the sound timer.
**/
MemoryManager.prototype.set_sound_tmr = function(val) {
  this.sound_tmr = val;
};

/**
* Convenience function to decrement the delay timer.
**/
MemoryManager.prototype.reduce_delay_timer = function() {
  if (this.delay_tmr > 0) {
    this.delay_tmr -= 1;
  }
};

/**
* Convenience function to decrement the sound timer.
**/
MemoryManager.prototype.reduce_sound_timer = function() {
  if (this.sound_tmr > 0) {
    this.sound_tmr -= 1;
  }
};


exports.MemoryManager = MemoryManager;
