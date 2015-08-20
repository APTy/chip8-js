var fs = require('fs');

const CURRENT_ROM = 'PONG';
const OP_CODE_BYTE_LENGTH = 2;
const rom = {fd: undefined, size: undefined};
const ops = [op_0, op_1, op_2, op_3, op_4, op_5, op_6, op_7,
             op_8, op_9, op_A, op_B, op_C, op_D, op_E, op_F];


rom.fd = fs.openSync(CURRENT_ROM, 'r');
rom.size = fs.fstatSync(rom.fd).size;
const buf = new Buffer(rom.size);

fs.readSync(rom.fd, buf, 0, rom.size, 0);
disassemble(buf);



function disassemble(buffer) {
  for (var i=0; i < buffer.length; i += OP_CODE_BYTE_LENGTH) {
    var opcode = buffer.readUIntBE(i, OP_CODE_BYTE_LENGTH);
    var op = opcode >> 12;
    ops[op](opcode);
  }
}

function op_0(inst) {
}
function op_1(inst) {
}
function op_2(inst) {
}
function op_3(inst) {
}
function op_4(inst) {
}
function op_5(inst) {
}
function op_6(inst) {
}
function op_7(inst) {
}
function op_8(inst) {
}
function op_9(inst) {
}
function op_A(inst) {
}
function op_B(inst) {
}
function op_C(inst) {
}
function op_D(inst) {
}
function op_E(inst) {
}
function op_F(inst) {
}
