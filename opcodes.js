const MEMORY_BYTE_SIZE = 0x1000;
const REGISTER_BYTE_SIZE = 0x10;
const STACK_BYTE_SIZE = 0x10;

const M = new Uint8Array(MEMORY_BYTE_SIZE);           // Memory
const V = new Uint8Array(REGISTER_BYTE_SIZE);         // Register
const S = new Uint16Array(STACK_BYTE_SIZE);           // Stack

const ops = [op_0, op_1, op_2, op_3, op_4, op_5, op_6, op_7,
             op_8, op_9, op_A, op_B, op_C, op_D, op_E, op_F];

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

module.exports = ops;
