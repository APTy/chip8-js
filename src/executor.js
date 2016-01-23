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
