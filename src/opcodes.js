require('./memory');
require('./returnCodes');
var debug = require('./debug');
var input = require('./input');
var display = require('./display');

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
  if ((V[inst >> 0x8 & 0xF] ^ (inst & 0xFF)) == 0x0)
    return OP_SKIP_NEXT_INSTRUCTION;
  return OP_SUCCESS;
}

// Skips the next instruction if VX doesn't equal NN.
function op_4(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ (inst & 0xFF)) != 0x0)
    return OP_SKIP_NEXT_INSTRUCTION;
  return OP_SUCCESS;
}

// Skips the next instruction if VX equals VY.
function op_5(inst) {
  if ((V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF]) == 0x0)
    return OP_SKIP_NEXT_INSTRUCTION;
  return OP_SUCCESS;
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
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    case 0x5:   // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      return OP_ERROR_NOT_IMPLEMENTED;
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
  if ((V[inst >> 0x8 & 0xF] ^ V[inst >> 0x4 & 0xF]) != 0x0)
    return OP_SKIP_NEXT_INSTRUCTION;
  return OP_SUCCESS;
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
function op_D(inst) {
  debug.log('%s: Drawing from I to (%s, %s) %s', inst.toString(16), inst >> 0x8 & 0xF, inst >> 0x4 & 0xF, inst & 0xF);
  for (var i = 0; i < (inst & 0xF); i++) {
    addSpriteToDisplay(M[I+i], V[inst >> 0x8 & 0xF], V[(inst >> 0x4 & 0xF)] + i);
  }
  display.paint();
  return OP_SUCCESS;
}
function op_E(inst) {
  // EX9E: Skips the next instruction if the key stored in VX is pressed.
  debug.log('%s: Checking if key %s is pressed', inst.toString(16), V[inst >> 0x8 & 0xF]);
  input.isKeyDown(V[inst >> 0x8 & 0xF]);
  return OP_SUCCESS;
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
