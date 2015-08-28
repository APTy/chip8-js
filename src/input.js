var debug = require('./debug');

const A = 65;
const W = 87;
const S = 83;
const D = 68;

const J = 74;
const I = 73;
const K = 75;
const L = 76;

var pressedKeys = {};
const HEX_KEY_MAP = new Uint16Array([0, W, 0, 0, S, 0, 0, 0,
                                     0, 0, 0, 0, I, K, 0, 0]);

exports.init = function() {
  debug.log('Initializing input listeners');
  window.onkeydown = function(e) {
    pressedKeys[e.keyCode] = true;
  }
  window.onkeyup = function(e) {
    pressedKeys[e.keyCode] = false;
  }
};

exports.isKeyDown = function(key) {
  return pressedKeys[HEX_KEY_MAP[key]] === true;
};
