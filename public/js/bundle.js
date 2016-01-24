(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* Returns a new Clock instance.
* @constructor
* @arg {MemoryManager} mm - an object with access to delay timer and sound timer registers.
* @arg {Display} display - the display on which to paint when ready
* @arg {Number} clock_frequency - the number of CPU cycles per second
**/
function Clock(clock_frequency) {
  this.frequency = clock_frequency;
  this.last_tick = Clock.current_time();
  this.users = [];
}

Clock.TIMER_HERTZ_FREQUENCY = 60;       // Allowed ticks per second

/**
* Gets the current time.
**/
Clock.current_time = function() {
  return Date.now();
};

/**
* Add an object/user that depends on the clock.
* @arg {Object} user - an object that implements an `on_tick` method.
**/
Clock.prototype.add_user = function(user) {
  this.users.push(user);
};

/**
* Run the `on_tick` method of all clock users.
**/
Clock.prototype.tick = function() {
  if (Clock.current_time() - this.last_tick > (this.frequency / Clock.TIMER_HERTZ_FREQUENCY)) {
    this.users.forEach(function(user) {
      user.on_tick();
    });
    this.last_tick = Clock.current_time();
  }
};


exports.Clock = Clock;

},{}],2:[function(require,module,exports){
/**
* Returns a new CPU instance.
* @constructor
**/
function CPU(mm, display, input, loader, clock_frequency) {
  var clock = require('./clock');
  var decoder = require('./decoder');
  var executor = require('./executor');
  clock_frequency = (!clock_frequency || clock_frequency < CPU.DEFAULT_CLOCK_FREQUENCY) ? CPU.DEFAULT_CLOCK_FREQUENCY : clock_frequency;

  this.mm = mm;
  this.input = input;
  this.loader = loader;
  this.display = display;
  this.decoder = decoder;
  this.clock = new clock.Clock(clock_frequency);
  this.executor = new executor.Executor(mm, display, input);
}

CPU.DEFAULT_CLOCK_FREQUENCY = 1000; // Cycles per second

/**
* Initialize the CPU, set it's memory, read in the ROM, and start the cycle.
* @arg {String} rom - the name of the ROM to load into memory.
**/
CPU.prototype.initialize = function(rom) {
  // Set the current ROM name
  this.current_rom = rom;

  // Add the MemoryManager and Display as dependents of the Clock
  this.clock.add_user(this.mm);
  this.clock.add_user(this.display);

  // Initialize the CPU's memory
  this.mm.initialize();

  // Retrieve the ROM from its location
  this.loader.read_rom(this.current_rom, function(rom) {

    // Load the ROM into memory after successful retrieval
    this.mm.load_into_memory(rom);

    // Start the CPU cycle, and decode a number of instructions per cycle equal to the clock frequency
    setInterval(function() {
      for(var i = 0; i < Math.floor(this.clock.frequency / CPU.DEFAULT_CLOCK_FREQUENCY); i++) {
        this.cycle();
      }
    }.bind(this), 1);
  }.bind(this));
};

/**
* Run a single cycle of the CPU's fetch-decode-execute loop.
**/
CPU.prototype.cycle = function() {
  // Verify that we are not "blocking" on some input
  if (!this.input.is_awaiting) {

    // Increment the internal clock
    this.clock.tick();

    // Fetch-Decode-Execute: Execute(Decode(Fetch()))
    this.executor.execute(this.decoder.decode(this.mm.read()));
  }
};


exports.CPU = CPU;

},{"./clock":1,"./decoder":3,"./executor":5}],3:[function(require,module,exports){
/**
* Returns a new Instruction instance.
* @constructor
* @arg {Number} raw - a 2-byte CHIP-8 instruction.
**/
function Instruction(raw) {
  this.raw = raw;
}

/**
* Read-only property to get the most significant 4 bits of an instruction (the Opcode).
**/
Object.defineProperty(Instruction.prototype, 'opcode', {
  get: function() { return this.raw >> 0xC; }
});

/**
* Read-only property to get the second most significant 4 bits of an instruction (the `X` value).
**/
Object.defineProperty(Instruction.prototype, 'x', {
  get: function() { return this.raw >> 0x8 & 0xF; }
});

/**
* Read-only property to get the third most significant 4 bits of an instruction (the `Y` value).
**/
Object.defineProperty(Instruction.prototype, 'y', {
  get: function() { return this.raw >> 0x4 & 0xF; }
});

/**
* Read-only property to get the least significant 4 bits of an instruction (the `N` value).
**/
Object.defineProperty(Instruction.prototype, 'n', {
  get: function() { return this.raw & 0xF; }
});

/**
* Read-only property to get the least significant 8 bits of an instruction (the `NN` value).
**/
Object.defineProperty(Instruction.prototype, 'nn', {
  get: function() { return this.raw & 0xFF; }
});

/**
* Read-only property to get the least significant 12 bits of an instruction (the `NNN` value).
**/
Object.defineProperty(Instruction.prototype, 'nnn', {
  get: function() { return this.raw & 0xFFF; }
});

/**
* Decode and return a new Instruction object.
**/
exports.decode = function(instr) {
  return new Instruction(instr);
};

},{}],4:[function(require,module,exports){
/**
* Returns a new Display instance.
* @constructor
* @arg {MemoryManager} mm - an object with access to delay timer and sound timer registers.
**/
function Display(mm) {
  var memory                = require('./memory');
  var canvas                = document.getElementById('screen');
  this.screen               = canvas.getContext('2d');
  this.screen_width         = canvas.width;
  this.screen_height        = canvas.height;
  this.mm                   = mm;
  this.display_width_bytes  = memory.MemoryManager.DISPLAY_WIDTH_BYTES;
  this.display_height_bytes = memory.MemoryManager.DISPLAY_HEIGHT_BYTES;
  this.width_ratio          = Math.floor(this.screen_width / this.display_width_bytes);
  this.height_ratio         = Math.floor(this.screen_height / this.display_height_bytes);
}

Display.BLANK_COLOR = '#222222';
Display.FILLED_COLOR = '#C0C0C0';

/**
* Prepare the display for use.
**/
Display.prototype.initialize = function() {
  this.clear();
}

/**
* Clear the screen and all display memory.
**/
Display.prototype.clear = function() {
  this.screen.fillStyle = Display.BLANK_COLOR;
  this.screen.fillRect(0, 0, this.screen_width, this.screen_height);
  this.mm.clear_display();
};

/**
* Paint XOR'd pixels from display memory onto the screen.
**/
Display.prototype.paint = function() {
  this.mm.for_each_display_pixel(function(pixel, index) {
    var x = (index % this.display_width_bytes) * this.width_ratio;
    var y = Math.floor(index / this.display_width_bytes) * this.height_ratio;
    if (pixel === 1) {
      this.screen.fillStyle = Display.FILLED_COLOR;
      this.screen.fillRect(x, y, this.width_ratio, this.height_ratio);
    } else {
      this.screen.fillStyle = Display.BLANK_COLOR;
      this.screen.fillRect(x, y, this.width_ratio, this.height_ratio);
    }
  }.bind(this));
}

/**
* Method to be run when the clock schedules a tick.
**/
Display.prototype.on_tick = function() {
  this.paint();
}


exports.Display = Display;

},{"./memory":10}],5:[function(require,module,exports){
/**
* Returns a new Executor instance.
* @constructor
**/
function Executor(mm, display, input) {
  this.mm = mm;
  this.display = display;
  this.input = input;
  this.ops = [
    this.OP_0, this.OP_1, this.OP_2, this.OP_3, this.OP_4, this.OP_5,
    this.OP_6, this.OP_7, this.OP_8, this.OP_9, this.OP_A, this.OP_B,
    this.OP_C, this.OP_D, this.OP_E, this.OP_F
  ];
}

/**
* Execute the instruction's opcode command.
**/
Executor.prototype.execute = function(inst) {
  this.ops[inst.opcode].call(this, inst);
};

Executor.prototype.OP_0 = function(inst) {
  switch(inst.raw) {
    case 0x00E0: // Clears the screen.
      this.display.clear();
      break;
    case 0x00EE: // Returns from a subroutine.
      this.mm.fn_return();
      break;
    default:
  }
}

// Jumps to address NNN.
Executor.prototype.OP_1 = function(inst) {
  this.mm.jump_to(inst.nnn);
}

// Calls subroutine at NNN.
Executor.prototype.OP_2 = function(inst) {
  this.mm.fn_call(inst.nnn);
}

// Skips the next instruction if VX equals NN.
Executor.prototype.OP_3 = function(inst) {
  if ((this.mm.get_register(inst.x) === (inst.nn))) {
    this.mm.skip();
  }
}

// Skips the next instruction if VX doesn't equal NN.
Executor.prototype.OP_4 = function(inst) {
  if ((this.mm.get_register(inst.x) !== (inst.nn))) {
    this.mm.skip();
  }
}

// Skips the next instruction if VX equals VY.
Executor.prototype.OP_5 = function(inst) {
  if ((this.mm.get_register(inst.x) === this.mm.get_register(inst.y))) {
    this.mm.skip();
  }
}

// Sets VX to NN.
Executor.prototype.OP_6 = function(inst) {
  this.mm.set_register(inst.x, inst.nn);
}

// Adds NN to VX.
Executor.prototype.OP_7 = function(inst) {
  var vx = this.mm.get_register(inst.x);
  this.mm.set_register(inst.x, vx + inst.nn);
}

Executor.prototype.OP_8 = function(inst) {
  switch(inst.n) {
    case 0x0:   // Sets VX to the value of VY.
      this.mm.set_register(inst.x, this.mm.get_register(inst.y));
      break;
    case 0x1:   // Sets VX to VX or VY.
      var vx = this.mm.get_register(inst.x);
      var vy = this.mm.get_register(inst.y);
      this.mm.set_register(inst.x, vx | vy);
      break;
    case 0x2:   // Sets VX to VX and VY.
      var vx = this.mm.get_register(inst.x);
      var vy = this.mm.get_register(inst.y);
      this.mm.set_register(inst.x, vx & vy);
      break;
    case 0x3:   // Sets VX to VX xor VY.
      var vx = this.mm.get_register(inst.x);
      var vy = this.mm.get_register(inst.y);
      this.mm.set_register(inst.x, vx ^ vy);
      break;
    case 0x4:   // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
      var vx = this.mm.get_register(inst.x);
      var vy = this.mm.get_register(inst.y);
      this.mm.set_register(inst.x, (vx + vy) & 0xFF);
      if (vx + vy > 0xFF)
        this.mm.set_register(0xF, 1);
      else
        this.mm.set_register(0xF, 0);
      break;
    case 0x5:   // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      var vx = this.mm.get_register(inst.x);
      var vy = this.mm.get_register(inst.y);
      this.mm.set_register(inst.x, (vx - vy) & 0xFF);
      if (vx - vy < 0)
        this.mm.set_register(0xF, 0);
      else
        this.mm.set_register(0xF, 1);
      break;
    case 0x6:   // Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.
      var vx = this.mm.get_register(inst.x);
      this.mm.set_register(0xF, vx & 0x01);
      this.mm.set_register(inst.x, vx >> 1 & 0xFF);
      break;
    case 0x7:   // Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.

      break;
    case 0xF:  // Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.
      var vx = this.mm.get_register(inst.x);
      this.mm.set_register(0xF, vx >> 7 & 0x01);
      this.mm.set_register(inst.x, vx << 1 & 0xFF);
      break;
    default:
      break;
  }
}

// Skips the next instruction if VX doesn't equal VY.
Executor.prototype.OP_9 = function(inst) {
  if (this.mm.get_register(inst.x) !== this.mm.get_register(inst.y)) {
    this.mm.skip();
  }
}

// Sets I to the address NNN.
Executor.prototype.OP_A = function(inst) {
  this.mm.set_addr_reg(inst.nnn);
}

// Jumps to the address NNN plus V0.
Executor.prototype.OP_B = function(inst) {
  this.mm.jump_to(inst.nnn + this.mm.get_register(0));
}

// CXNN: Sets VX to the result of a random number 'and' NN.
Executor.prototype.OP_C = function(inst) {
  // TODO: implement my own random function
  this.mm.set_register(inst.x, (Math.random() * 0x100 >> 0) & (inst.nn));
}

// DXYN: Draw XOR pixels onto screen from index register I
// register VF is set to 1 if a pixel is cleared, otherwise 0
Executor.prototype.OP_D = function(inst) {
  if (this.mm.draw_sprite_from_addr_reg(inst.x, inst.y, inst.n))
    this.mm.set_register(0xF, 1);
  else
    this.mm.set_register(0xF, 0);
}

Executor.prototype.OP_E = function(inst) {
  switch (inst.nn) {
    case 0x9E: // EX9E: Skips the next instruction if the key stored in VX is pressed.
      if (this.input.is_key_down(this.mm.get_register(inst.x)))
        this.mm.skip();
      break;
    case 0xA1: // EXA1: Skips the next instruction if the key stored in VX isn't pressed.
      if (!this.input.is_key_down(this.mm.get_register(inst.x)))
        this.mm.skip();
      break;
    default:
      break;
  }
}

Executor.prototype.OP_F = function(inst) {
  switch (inst.nn) {
    case 0x07:    // FX07	Sets VX to the value of the delay timer.
      this.mm.set_register(inst.x, this.mm.get_delay_tmr());
      break;
    case 0x0A:    // FX0A	A key press is awaited, and then stored in VX.
      this.input.await_start(inst.x);
      window.addEventListener(this.input.AWAIT, this.input.await_end.bind(this));
      break;
    case 0x15:    // FX15	Sets the delay timer to VX.
      this.mm.set_delay_tmr(this.mm.get_register(inst.x));
      break;
    case 0x18:    // FX18	Sets the sound timer to VX.
      this.mm.set_sound_tmr(this.mm.get_register(inst.x));
      break;
    case 0x1E:    // FX1E	Adds VX to I.
      this.mm.set_addr_reg(this.mm.get_addr_reg() + this.mm.get_register(inst.x));
      break;
    case 0x29:    // FX29	Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
      this.mm.set_addr_reg(this.mm.FONT_FIRST_ADDRESS_IN_MEMORY + this.mm.get_register(inst.x) * this.mm.FONT_BYTE_SIZE);
      break;
    case 0x33:    // FX33	Stores the Binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
      var temp = this.mm.get_register(inst.x);
      var dec = (temp - temp % 100) / 100;
      var buf = new Uint8Array(3);
      buf[0] = dec;
      temp -= dec;
      dec = (temp - temp % 10) / 10;
      buf[1] = dec;
      temp -= dec;
      buf[2] = temp;
      this.mm.load_into_memory(buf);
      break;
    case 0x55:    // FX55	Stores V0 to VX in memory starting at address I.
      var buf = new Uint8Array(inst.x)
      for (var i = 0; i < buf.length; i++) {
        buf[i] = this.mm.get_register(i);
      }
      this.mm.write_at_addr_reg(buf);
      break;
    case 0x65:    // FX65	Fills V0 to VX with values from memory starting at address I.
      var buf = this.mm.read_at_addr_reg(inst.x);
      for (var i = 0; i < buf.length; i++) {
        this.mm.set_register(i, buf[i]);
      }
      break;
  }
}

exports.Executor = Executor;

},{}],6:[function(require,module,exports){
module.exports = new Uint8Array([
  0xF0,0x90,0x90,0x90,0xF0, // 0
  0x20,0x60,0x20,0x20,0x70, // 1
  0xF0,0x10,0xF0,0x80,0xF0, // 2
  0xF0,0x10,0xF0,0x10,0xF0, // 3
  0x90,0x90,0xF0,0x10,0x10, // 4
  0xF0,0x80,0xF0,0x10,0xF0, // 5
  0xF0,0x80,0xF0,0x90,0xF0, // 6
  0xF0,0x10,0x20,0x40,0x40, // 7
  0xF0,0x90,0xF0,0x90,0xF0, // 8
  0xF0,0x90,0xF0,0x10,0xF0, // 9
  0xF0,0x90,0xF0,0x90,0x90, // A
  0xE0,0x90,0xE0,0x90,0xE0, // B
  0xF0,0x80,0x80,0x80,0xF0, // C
  0xE0,0x90,0x90,0x90,0xE0, // D
  0xF0,0x80,0xF0,0x80,0xF0, // E
  0xF0,0x80,0xF0,0x80,0x80  // F
]);

},{}],7:[function(require,module,exports){
/**
* Returns a new KeyboardInput instance.
* @constructor
**/
function KeyboardInput() {
  this.AWAIT = 'await';
  this.pressed_keys = {};
  this.is_awaiting = false;
  window.onkeydown = function(e) {
    this.pressed_keys[e.keyCode] = true;
    window.dispatchEvent(new CustomEvent(this.AWAIT, {detail: e.keyCode}));
  }.bind(this);
  window.onkeyup = function(e) {
    this.pressed_keys[e.keyCode] = false;
  }.bind(this);
}

KeyboardInput.A = 65;
KeyboardInput.W = 87;
KeyboardInput.S = 83;
KeyboardInput.D = 68;

KeyboardInput.J = 74;
KeyboardInput.I = 73;
KeyboardInput.K = 75;
KeyboardInput.L = 76;

KeyboardInput.M = 77;
KeyboardInput.H = 72;
KeyboardInput.C = 67;
KeyboardInput.Z = 90;
KeyboardInput.X = 88;
KeyboardInput.B = 66;
KeyboardInput.SPACE = 32;
KeyboardInput.COMMA = 188;

KeyboardInput.HEX_KEY_MAP = new Uint16Array([
  KeyboardInput.Z, KeyboardInput.W, KeyboardInput.X, KeyboardInput.A,
  KeyboardInput.S, KeyboardInput.SPACE, KeyboardInput.H, KeyboardInput.I,
  KeyboardInput.B, KeyboardInput.J, KeyboardInput.K, KeyboardInput.COMMA,
  KeyboardInput.D, KeyboardInput.C, KeyboardInput.L, KeyboardInput.M,
]);

/**
* Returns whether a key is currently pressed.
**/
KeyboardInput.prototype.is_key_down = function(key) {
  return this.pressed_keys[KeyboardInput.HEX_KEY_MAP[key]] === true;
};

/**
* Start an asynchronous await for a keypress.
**/
KeyboardInput.prototype.await_start = function(register) {
  this.await_register = register;
  this.is_awaiting = true;
};

/**
* End an asynchronous await for a keypress, and store its value to a register.
**/
KeyboardInput.prototype.await_end = function(e) {
  window.removeEventListener(this.input.AWAIT);
  this.mm.set_register(this.input.await_register, e.detail);
  this.input.is_awaiting = false;
};


exports.KeyboardInput = KeyboardInput;

},{}],8:[function(require,module,exports){
/**
* Returns a LoaderBase abstract base class.
* @constructor
**/
function LoaderBase() {}

/**
* Read a ROM to memory.
**/
LoaderBase.prototype.read_rom = function() {
  throw new Error('Method not implemented.');
}


/**
* Returns a new HTTPLoader instance.
* @constructor
**/
function HTTPLoader() {
  LoaderBase.call(this);
}

HTTPLoader.prototype = LoaderBase.prototype;
HTTPLoader.prototype.constructor = HTTPLoader;

/**
* Get an array buffer of ROM data from the server.
**/
HTTPLoader.prototype.get = function(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path);
  xhr.responseType = 'arraybuffer';
  xhr.send();
  xhr.onload = function(e) {
    var arrayBuffer = xhr.response;
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      callback(byteArray);
    }
  }
};

/**
* Download a ROM from the server.
**/
HTTPLoader.prototype.read_rom = function(rom_name, callback) {
  /*  Hit server for ROM data  */
  this.get('roms/' + rom_name + '/bin', function(rom_buffer) {
    /*  Call the next function in the init sequence  */
    callback(rom_buffer);
  });
};


exports.HTTPLoader = HTTPLoader;

},{}],9:[function(require,module,exports){
(function main() {

  var cpu = require('./cpu');
  var input = require('./input');
  var memory = require('./memory');
  var loader = require('./loader');
  var display = require('./display');

  var mm = new memory.MemoryManager();
  var display = new display.Display(mm);
  var input = new input.KeyboardInput();
  var loader = new loader.HTTPLoader();
  var cpu = new cpu.CPU(mm, display, input, loader);

  var current_rom = window.location.hash.substring(1);
  cpu.initialize(current_rom);

})();

},{"./cpu":2,"./display":4,"./input":7,"./loader":8,"./memory":10}],10:[function(require,module,exports){
/**
* Returns a new MemoryManager instance.
* @constructor
**/
function MemoryManager() {
  this.main      = new Uint8Array(MemoryManager.MEMORY_BYTE_SIZE);      // Main Memory
  this.registers = new Uint8Array(MemoryManager.REGISTER_BYTE_SIZE);    // Register
  this.stack     = new Array();                                         // Stack
  this.addr_reg  = 0;                                                   // Address Register
  this.instr_ptr = 0;                                                   // Program Counter
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
* Method to be run when the clock schedules a tick.
**/
MemoryManager.prototype.on_tick = function() {
  if (this.delay_tmr > 0) {
    this.delay_tmr -= 1;
  }
  if (this.sound_tmr > 0) {
    this.sound_tmr -= 1;
  }
}


exports.MemoryManager = MemoryManager;

},{"./fonts":6}]},{},[1,2,3,4,5,6,7,8,9,10]);
