var debug = require('./debug');

var pressedKeys = {};
const HEX_KEY_MAP = new Uint16Array([0, 32, 0, 0, 0, 0, 0, 0, 0]);

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
