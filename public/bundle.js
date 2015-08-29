(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./memory');
var debug = require('./debug');
var display = require('./display');

const TIMER_HERTZ_FREQUENCY = 60;
const SOUND_ALERT_CODE = '\007';

var lastTick = 0;

function updateTimers() {
  if (DT > 0) {
    DT -= 1;
  }
  if (ST > 0) {
    // process.stdout.write('\007');
    ST -= 1;
  }
};

exports.tick = function() {
  if (Date.now() - lastTick > 1000 / TIMER_HERTZ_FREQUENCY) {
    display.paint();
    updateTimers();
    lastTick = Date.now();
  }
};

exports.init = function() {
  debug.log('Initializing the clock');
  lastTick = Date.now();
};

},{"./debug":2,"./display":3,"./memory":8}],2:[function(require,module,exports){
// var util = require('util');

const DEBUG = true;

exports.log = function() {
  // if (DEBUG) util.log.apply(console, arguments);
  if (DEBUG) console.log.apply(console, arguments);
}

},{}],3:[function(require,module,exports){
require('./memory');
var debug = require('./debug');

const CANVAS         = document.getElementById('screen');
const SCREEN         = CANVAS.getContext('2d');
const SCREEN_WIDTH   = CANVAS.width;
const SCREEN_HEIGHT  = CANVAS.height;
const WIDTH_RATIO    = Math.floor(SCREEN_WIDTH / DISPLAY_WIDTH_BYTES);
const HEIGHT_RATIO   = Math.floor(SCREEN_HEIGHT / DISPLAY_HEIGHT_BYTES);

_clearCanvas = function() {
  SCREEN.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

exports.clear = function() {
  debug.log('Clearing the display');
  _clearCanvas();
  for (var i = 0; i < display.length; i++) {
    display[i] = 0;
  }
};

exports.init = function() {
  debug.log('Initializing the display');
  exports.clear();
};

exports.paint = function() {
  for (var i = 0; i < display.length; i++) {
    if (display[i] === 1) {
      var x = (i % DISPLAY_WIDTH_BYTES) * WIDTH_RATIO;
      var y = Math.floor(i / DISPLAY_WIDTH_BYTES) * HEIGHT_RATIO;
      SCREEN.clearRect(x, y, WIDTH_RATIO, HEIGHT_RATIO);
    } else if (display[i] === 0) {
      var x = (i % DISPLAY_WIDTH_BYTES) * WIDTH_RATIO;
      var y = Math.floor(i / DISPLAY_WIDTH_BYTES) * HEIGHT_RATIO;
      SCREEN.fillRect(x, y, WIDTH_RATIO, HEIGHT_RATIO);
    }
  }
}

},{"./debug":2,"./memory":8}],4:[function(require,module,exports){
var f_0 = new Uint8Array([0xF0,0x90,0x90,0x90,0xF0]);
var f_1 = new Uint8Array([0x20,0x60,0x20,0x20,0x70]);
var f_2 = new Uint8Array([0xF0,0x10,0xF0,0x80,0xF0]);
var f_3 = new Uint8Array([0xF0,0x10,0xF0,0x10,0xF0]);
var f_4 = new Uint8Array([0x90,0x90,0xF0,0x10,0x10]);
var f_5 = new Uint8Array([0xF0,0x80,0xF0,0x10,0xF0]);
var f_6 = new Uint8Array([0xF0,0x80,0xF0,0x90,0xF0]);
var f_7 = new Uint8Array([0xF0,0x10,0x20,0x40,0x40]);
var f_8 = new Uint8Array([0xF0,0x90,0xF0,0x90,0xF0]);
var f_9 = new Uint8Array([0xF0,0x90,0xF0,0x10,0xF0]);
var f_A = new Uint8Array([0xF0,0x90,0xF0,0x90,0x90]);
var f_B = new Uint8Array([0xE0,0x90,0xE0,0x90,0xE0]);
var f_C = new Uint8Array([0xF0,0x80,0x80,0x80,0xF0]);
var f_D = new Uint8Array([0xE0,0x90,0x90,0x90,0xE0]);
var f_E = new Uint8Array([0xF0,0x80,0xF0,0x80,0xF0]);
var f_F = new Uint8Array([0xF0,0x80,0xF0,0x80,0x80]);

const fonts = [f_0, f_1, f_2, f_3, f_4, f_5, f_6, f_7,
               f_8, f_9, f_A, f_B, f_C, f_D, f_E, f_F];

module.exports = fonts;

},{}],5:[function(require,module,exports){
/*  Get an array buffer of ROM data from the server  */
exports.get = function(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://localhost:3000/" + path);
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

},{}],6:[function(require,module,exports){
var debug = require('./debug');

const A = 65;
const W = 87;
const S = 83;
const D = 68;

const J = 74;
const I = 73;
const K = 75;
const L = 76;

var pressedKeys = {};
const HEX_KEY_MAP = new Uint16Array([0, W, 0, 0, S, 0, 0, 0,
                                     0, 0, 0, 0, I, K, 0, 0]);

exports.init = function() {
  debug.log('Initializing input listeners');
  window.onkeydown = function(e) {
    pressedKeys[e.keyCode] = true;
  }
  window.onkeyup = function(e) {
    pressedKeys[e.keyCode] = false;
  }
};

exports.isKeyDown = function(key) {
  return pressedKeys[HEX_KEY_MAP[key]] === true;
};

},{"./debug":2}],7:[function(require,module,exports){
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

  /*  Shift off 12 least significant bytes to the the opcode  */
  var op = instruction >> 0xC;

  /*  Send the instruction to the correct opcode, save the op return  */
  var opReturn = ops[op](instruction);

  /*  Skip instruction if the op return tells us to  */
  if (opReturn == OP_SKIP_NEXT_INSTRUCTION) {
    debug.log('Skipping instruction at address %s', PC);
    PC += OP_CODE_BYTE_LENGTH;
  } else if (opReturn == OP_ERROR_NOT_IMPLEMENTED) {
    console.error('Error: instruction %s not implemented', instruction.toString(16));
    clearInterval(disassembly);
  }
}

},{"./clock":1,"./debug":2,"./display":3,"./input":6,"./memory":8,"./opcodes":9}],8:[function(require,module,exports){
(function (global){
var debug = require('./debug');

/*  Local constants  */
const MEMORY_BYTE_SIZE               = 0x1000;
const RESERVED_MEMORY_BYTE_SIZE      = 0x200;
const REGISTER_BYTE_SIZE             = 0x10;
const STACK_BYTE_SIZE                = 0x10;

/*  Global constants  */
global.FONT_FIRST_ADDRESS_IN_MEMORY  = 0x0000;
global.FONT_BYTE_SIZE                = 0x5;
global.PROGRAM_ADDRESS_START         = 0x200;
global.DISPLAY_WIDTH_BYTES           = 0X40;
global.DISPLAY_HEIGHT_BYTES          = 0X20;

/*  Op Return Codes  */
global.OP_SUCCESS                    = 0x00;
global.OP_ERROR                      = 0x01;
global.OP_SKIP_NEXT_INSTRUCTION      = 0x02;
global.OP_ERROR_NOT_IMPLEMENTED      = 0x04;

/*  Memory Allocation  */
global.M       = new Uint8Array(MEMORY_BYTE_SIZE);      // Main Memory
global.V       = new Uint8Array(REGISTER_BYTE_SIZE);    // Register
global.S       = new Uint16Array(STACK_BYTE_SIZE);      // Stack
global.I       = 0x0000;                                // Address Register
global.PC      = 0x0000;                                // Program Counter
global.SP      = 0x00;                                  // Stack Pointer
global.DT      = 0x0000;                                // Delay Timer
global.ST      = 0x0000;                                // Sound Timer
global.display = new Uint8Array(DISPLAY_WIDTH_BYTES *
                                DISPLAY_HEIGHT_BYTES);  // Display Area


/*  Get ROM from server and load into memory  */
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

/*  Add one byte of information (8 pixels) onto the display */
global.addSpriteToDisplay = function(sprite, x, y) {
  for (var i = 7; i >= 0; i--) {
    display[x + y * DISPLAY_WIDTH_BYTES + 7 - i] ^= sprite >> i & 1;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":2,"./fonts":4,"./http":5}],9:[function(require,module,exports){
var debug = require('./debug');
var input = require('./input');
var display = require('./display');

require('./memory');

const ops = [op_0, op_1, op_2, op_3, op_4, op_5, op_6, op_7,
             op_8, op_9, op_A, op_B, op_C, op_D, op_E, op_F];

function op_0(inst) {
  switch(inst) {
    case 0x00E0: // Clears the screen.
      display.clear();
      break;
    case 0x00EE: // Returns from a subroutine.
      PC = S[--SP];
      debug.log('%s: Returning from subroutine to address', inst.toString(16), PC);
      return OP_SUCCESS;
    default:
  }
}

// Jumps to address NNN.
function op_1(inst) {
  debug.log('%s: Jumping to address', inst.toString(16), (inst & 0xFFF).toString(16));
  PC = inst & 0xFFF;
  return OP_SUCCESS;
}

// Calls subroutine at NNN.
function op_2(inst) {
  debug.log('%s: Calling subroutine at', inst.toString(16), (inst & 0xFFF).toString(16));
  S[SP++] = PC;
  PC = inst & 0xFFF;
  return OP_SUCCESS;
}

// Skips the next instruction if VX equals NN.
function op_3(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ (inst & 0xFF)) == 0x0) {
    return OP_SKIP_NEXT_INSTRUCTION;
  } else {
    return OP_SUCCESS;
  }
}

// Skips the next instruction if VX doesn't equal NN.
function op_4(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ (inst & 0xFF)) != 0x0) {
    return OP_SKIP_NEXT_INSTRUCTION;
  } else {
    return OP_SUCCESS;
  }
}

// Skips the next instruction if VX equals VY.
function op_5(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF]) == 0x0) {
    return OP_SKIP_NEXT_INSTRUCTION;
  } else {
    return OP_SUCCESS;
  }
}

// Sets VX to NN.
function op_6(inst) {
  debug.log('%s: Setting V%s to %s', inst.toString(16), (inst >> 0x8 & 0xF).toString(16), inst & 0xFF);
  V[inst >> 0x8 & 0xF] = inst & 0xFF;
  return OP_SUCCESS;
}

// Adds NN to VX. FIXME: implement with bitwise operators
function op_7(inst) {
  debug.log('%s: Adding %s to V%s', inst.toString(16), inst & 0xFF, (inst >> 0x8 & 0xF).toString(16));
  V[inst >> 0x8 & 0xF] += inst & 0xFF;
  return OP_SUCCESS;
}

function op_8(inst) {
  switch(inst & 0xF) {
    case 0x0:   // Sets VX to the value of VY.
      V[inst >> 0x8 & 0xF] = V[inst >> 0x4 & 0xF];
      break;
    case 0x1:   // Sets VX to VX or VY.
      V[inst >> 0x8 & 0xF] |= V[inst >> 0x4 & 0xF];
      break;
    case 0x2:   // Sets VX to VX and VY.
      V[inst >> 0x8 & 0xF] &= V[inst >> 0x4 & 0xF];
      break;
    case 0x3:   // Sets VX to VX xor VY.
      V[inst >> 0x8 & 0xF] ^= V[inst >> 0x4 & 0xF];
      break;
    case 0x4:   // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
      var carry = V[inst >> 0x8 & 0xF] & V[inst >> 0x4 & 0xF];
      var result = V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF];
      if (carry != 0) {
        V[0xF] = 1;
        while (carry != 0) {
          var shiftedcarry = carry << 1;
          carry = result & shiftedcarry;
          result ^= shiftedcarry;
        }
      } else {
        V[0xF] = 0;
      }
      V[inst >> 0x8 & 0xF] = result;
      break;
    case 0x5:   // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      var carry = -V[inst >> 0x8 & 0xF] & V[inst >> 0x4 & 0xF];
      var result = -V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF];
      if (carry != 0) {
        V[0xF] = 1;
        while (carry != 0) {
          var shiftedcarry = carry << 1;
          carry = result & shiftedcarry;
          result ^= shiftedcarry;
        }
      } else {
        V[0xF] = 0;
      }
      V[inst >> 0x8 & 0xF] = result;
      break;
    case 0x6:   // Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    case 0x7:   // Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    case 0xF:  // Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    default:
      return OP_ERROR_NOT_IMPLEMENTED;
  }
  return OP_SUCCESS;
}

// Skips the next instruction if VX doesn't equal VY.
function op_9(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF]) != 0x0) {
    return OP_SKIP_NEXT_INSTRUCTION;
  } else {
    return OP_SUCCESS;
  }
}

// Sets I to the address NNN.
function op_A(inst) {
  debug.log('%s: Setting I to', inst.toString(16), (inst & 0xFFF).toString(16));
  I = inst & 0xFFF;
  return OP_SUCCESS;
}

// Jumps to the address NNN plus V0.
function op_B(inst) {
  debug.log('%s: Jumping to address', inst.toString(16), inst & 0xFFF + V[0]);
  PC = inst & 0xFFF + V[0];
  return OP_SUCCESS;
}

// CXNN: Sets VX to the result of a random number 'and' NN.
function op_C(inst) {
  // TODO: implement my own random function
  V[inst >> 0x8 & 0xFF] = (Math.random()*256 >> 0) & (inst & 0xFF);
  return OP_SUCCESS;
}

// DXYN: Draw XOR pixels onto screen from index register I
function op_D(inst) {
  debug.log('%s: Drawing from I to (%s, %s) %s', inst.toString(16), inst >> 0x8 & 0xF, inst >> 0x4 & 0xF, inst & 0xF);
  for (var i = 0; i < (inst & 0xF); i++) {
    addSpriteToDisplay(M[I+i], V[inst >> 0x8 & 0xF], V[(inst >> 0x4 & 0xF)] + i);
  }
  return OP_SUCCESS;
}

function op_E(inst) {
  switch (inst & 0xFF) {
    case 0x9E: // EX9E: Skips the next instruction if the key stored in VX is pressed.
      debug.log('%s: Checking if key %s is pressed', inst.toString(16), V[inst >> 0x8 & 0xF]);
      if (input.isKeyDown(V[inst >> 0x8 & 0xF]))
        return OP_SKIP_NEXT_INSTRUCTION;
      break;
    case 0xA1: // EXA1: Skips the next instruction if the key stored in VX isn't pressed.
      debug.log('%s: Checking if key %s is not pressed', inst.toString(16), V[inst >> 0x8 & 0xF]);
      if (!input.isKeyDown(V[inst >> 0x8 & 0xF]))
        return OP_SKIP_NEXT_INSTRUCTION;
      break;
    default:
      return OP_ERROR_NOT_IMPLEMENTED;
  }
}

function op_F(inst) {
  switch (inst & 0xFF) {
    case 0x07:    // FX07	Sets VX to the value of the delay timer.
      debug.log('%s: Setting V%s to %s', inst.toString(16), inst >> 0x8 & 0xF, DT);
      V[inst >> 0x8 & 0xF] = DT;
      break;
    case 0x0A:    // FX0A	A key press is awaited, and then stored in VX.
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    case 0x15:    // FX15	Sets the delay timer to VX.
      debug.log('%s: Setting DT to %s', inst.toString(16), V[inst >> 0x8 & 0xF]);
      DT = V[inst >> 0x8 & 0xF];
      break;
    case 0x18:    // FX18	Sets the sound timer to VX.
      debug.log('%s: Setting ST to %s', inst.toString(16), V[inst >> 0x8 * 0xF]);
      ST = V[inst >> 0x8 & 0xF];
      break;
    case 0x1E:    // FX1E	Adds VX to I.
      debug.log('%s: Addint %s to I', inst.toString(16), V[inst >> 0x8 * 0xF]);
      I += V[inst >> 0x8 & 0xF];
      break;
    case 0x29:    // FX29	Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
      I = FONT_FIRST_ADDRESS_IN_MEMORY + (inst >> 0x8 & 0xF) * FONT_BYTE_SIZE;
      debug.log('%s: Setting I to %s', inst.toString(16), I);
      break;
    case 0x33:    // FX33	Stores the Binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
      var temp = V[inst >> 0x8 & 0xF];
      var dec = (temp - temp % 100) / 100;
      M[I] = dec;
      temp -= dec;
      dec = (temp - temp % 10) / 10;
      M[I+1] = dec;
      temp -= dec;
      M[I+2] = temp;
      debug.log('%s: Storing %s %s %s at address I', inst.toString(16), M[I], M[I+1], M[I+2]);
      break;
    case 0x55:    // FX55	Stores V0 to VX in memory starting at address I.
      for (var i = 0; i < (inst >> 0x8 & 0xF); i++) {
        I[i] = V[i];
      }
      debug.log('%s: Storing V0 to V%s to I', inst.toString(16), (inst >> 0x8 & 0xF).toString(16));
      break;
    case 0x65:    // FX65	Fills V0 to VX with values from memory starting at address I.
      for (var i = 0; i < (inst >> 0x8 & 0xF); i++) {
        V[i] = I[i];
      }
      debug.log('%s: Filling V0 to V%s with values from I', inst.toString(16), (inst >> 0x8 & 0xF).toString(16));
      break;
  }
  return OP_SUCCESS;
}

module.exports = ops;

},{"./debug":2,"./display":3,"./input":6,"./memory":8}]},{},[7]);
