const MEMORY_BYTE_SIZE = 0x1000;
const REGISTER_BYTE_SIZE = 0x10;
const STACK_BYTE_SIZE = 0x10;

global.M = new Uint8Array(MEMORY_BYTE_SIZE);           // Memory
global.V = new Uint8Array(REGISTER_BYTE_SIZE);         // Register
global.S = new Uint16Array(STACK_BYTE_SIZE);           // Stack
global.I = 0x0000;                                     // Address Register
