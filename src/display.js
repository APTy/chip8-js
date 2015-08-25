require('./memory');
var debug = require('./debug');

const CANVAS         = document.getElementById('screen');
const SCREEN         = CANVAS.getContext('2d');
const SCREEN_WIDTH   = CANVAS.width;
const SCREEN_HEIGHT  = CANVAS.height;
const WIDTH_RATIO    = Math.floor(SCREEN_WIDTH / DISPLAY_WIDTH_BYTES);
const HEIGHT_RATIO   = Math.floor(SCREEN_HEIGHT / DISPLAY_HEIGHT_BYTES);

_clearCanvas = function() {
  SCREEN.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

exports.clear = function() {
  debug.log('Clearing the display');
  _clearCanvas();
  for (var i = 0; i < display.length; i++) {
    display[i] = 0;
  }
};

exports.init = function() {
  debug.log('Initializing the display');
  exports.clear();
};

exports.paint = function() {
  _clearCanvas();
  for (var i = 0; i < display.length; i++) {
    if (display[i] === 1) {
      var x = (i % DISPLAY_WIDTH_BYTES) * WIDTH_RATIO;
      var y = Math.floor(i / DISPLAY_WIDTH_BYTES) * HEIGHT_RATIO;
      SCREEN.clearRect(x, y, WIDTH_RATIO, HEIGHT_RATIO);
    }
  }
}
