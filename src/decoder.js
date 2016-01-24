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
