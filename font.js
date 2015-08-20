const FONT_FIRST_ADDRESS_IN_MEMORY = 0x0000;

const fonts = [f_0, f_1, f_2, f_3, f_4, f_5, f_6, f_7,
               f_8, f_9, f_A, f_B, f_C, f_D, f_E, f_F];,

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

module.exports = fonts;
