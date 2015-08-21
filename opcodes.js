require('./memory');
require('./returnCodes');
var debug = require('./debug');

const ops = [op_0, op_1, op_2, op_3, op_4, op_5, op_6, op_7,
             op_8, op_9, op_A, op_B, op_C, op_D, op_E, op_F];

function op_0(inst) {
  switch(inst) {
    case 0x00E0: // Clears the screen.
      return OP_ERROR_NOT_IMPLEMENTED;
      break;
    case 0x00EE: // Returns from a subroutine.
      PC = SP;
      SP--;
      break;
    default:
  }
}

// Jumps to address NNN.
function op_1(inst) {
  debug.log('Jumping to address', (0xFFF).toString(16));
  PC = inst & 0xFFF;
}

// Calls subroutine at NNN.
function op_2(inst) {
  debug.log('Calling subroutine at', (0xFFF).toString(16));
  SP++;
  PC = SP;
  PC = inst & 0xFFF;
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
  debug.log('Setting V%s to %s', (inst >> 0x8 & 0xF).toString(16), inst & 0xFF);
  V[inst >> 0x8 & 0xF] = inst & 0xFF;
  return OP_SUCCESS;
}

// Adds NN to VX. FIXME: implement with bitwise operators
function op_7(inst) {
  debug.log('Adding V%s to %s', (inst >> 0x8 & 0xF).toString(16), inst & 0xFF);
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
  debug.log('Setting I to', (inst & 0xFFF).toString(16));
  I = inst & 0xFFF;
  return OP_SUCCESS;
}

// Jumps to the address NNN plus V0.
function op_B(inst) {
  debug.log('Jumping to address', inst & 0xFFF + V[0]);
  PC = inst & 0xFFF + V[0];
}

function op_C(inst) {
  return OP_ERROR_NOT_IMPLEMENTED;
}
function op_D(inst) {
  // inst >> 0x8 & 0xF  // X
  // inst >> 0x4 & 0xF  // Y
  // inst & 0xF         // N
  console.log(M[I]);
  return OP_ERROR_NOT_IMPLEMENTED;
}
function op_E(inst) {
  return OP_ERROR_NOT_IMPLEMENTED;
}
function op_F(inst) {
  return OP_ERROR_NOT_IMPLEMENTED;
}

module.exports = ops;
