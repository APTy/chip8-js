/**
* Returns a new Instruction instance.
* @constructor
* @arg {Number} raw - a 2-byte CHIP-8 instruction.
**/
function Instruction(raw) {
  this.raw = raw;
  this.opcode = raw >> 0xC;
  this.x = raw >> 0x8 & 0xF;
  this.y = raw >> 0x4 & 0xF;
  this.n = raw & 0xF;
  this.nn = raw & 0xFF;
  this.nnn = raw & 0xFFF;
}

/**
* Decode and return a new Instruction object.
**/
exports.decode = function(instr) {
  return new Instruction(instr);
};
