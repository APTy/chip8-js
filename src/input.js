/**
* Returns a new KeyboardInput instance.
* @constructor
**/
function KeyboardInput() {
  this.AWAIT = 'await';
  this.pressed_keys = {};
  this.is_awaiting = false;
  window.onkeydown = function(e) {
    this.pressed_keys[e.keyCode] = true;
    window.dispatchEvent(new CustomEvent(this.AWAIT, {detail: e.keyCode}));
  }.bind(this);
  window.onkeyup = function(e) {
    this.pressed_keys[e.keyCode] = false;
  }.bind(this);
}

KeyboardInput.A = 65;
KeyboardInput.W = 87;
KeyboardInput.S = 83;
KeyboardInput.D = 68;

KeyboardInput.J = 74;
KeyboardInput.I = 73;
KeyboardInput.K = 75;
KeyboardInput.L = 76;

KeyboardInput.M = 77;
KeyboardInput.H = 72;
KeyboardInput.C = 67;
KeyboardInput.Z = 90;
KeyboardInput.X = 88;
KeyboardInput.B = 66;
KeyboardInput.SPACE = 32;
KeyboardInput.COMMA = 188;

KeyboardInput.HEX_KEY_MAP = new Uint16Array([
  KeyboardInput.Z, KeyboardInput.W, KeyboardInput.X, KeyboardInput.A,
  KeyboardInput.S, KeyboardInput.SPACE, KeyboardInput.H, KeyboardInput.I,
  KeyboardInput.B, KeyboardInput.J, KeyboardInput.K, KeyboardInput.COMMA,
  KeyboardInput.D, KeyboardInput.C, KeyboardInput.L, KeyboardInput.M,
]);

/**
* Returns whether a key is currently pressed.
**/
KeyboardInput.prototype.is_key_down = function(key) {
  return this.pressed_keys[KeyboardInput.HEX_KEY_MAP[key]] === true;
};

/**
* Start an asynchronous await for a keypress.
**/
KeyboardInput.prototype.await_start = function(register) {
  this.await_register = register;
  this.is_awaiting = true;
};

/**
* End an asynchronous await for a keypress, and store its value to a register.
**/
KeyboardInput.prototype.await_end = function(e) {
  window.removeEventListener(this.input.AWAIT);
  this.mm.set_register(this.input.await_register, e.detail);
  this.input.is_awaiting = false;
};


exports.KeyboardInput = KeyboardInput;
