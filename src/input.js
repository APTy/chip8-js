var debug = require('./debug');

const A = 65;
const W = 87;
const S = 83;
const D = 68;

const J = 74;
const I = 73;
const K = 75;
const L = 76;

const Z = 90
const X = 88
const C = 67
const V = 86

const B = 66
const N = 78
const M = 77
const COMMA = 188

var pressedKeys = {};
const HEX_KEY_MAP = new Uint16Array([Z, W, X, A, S, D, C, V,
                                     B, N, M, COMMA, I, K, J, L]);

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
