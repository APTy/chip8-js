require('./memory');
var debug = require('./debug');

const SCREEN_WIDTH   = process.stdout.columns;
const SCREEN_HEIGHT  = process.stdout.rows;
const WIDTH_RATIO    = SCREEN_WIDTH / DISPLAY_WIDTH_BYTES;
const HEIGHT_RATIO   = SCREEN_HEIGHT / DISPLAY_HEIGHT_BYTES;
const PIXEL_OFF      = ' ';
const PIXEL_ON       = '+';

_clearLines = function() {
  for (var i = 0; i < process.stdout.rows; i++) {
    process.stdout.write('\n');
  }
};

exports.clear = function() {
  debug.log('Clearing the display');
  _clearLines();
  for (var i = 0; i < display.length; i++) {
    display[i] = 0;
  }
};

exports.init = function() {
  debug.log('Initializing the display');
  exports.clear();
};

exports.paint = function() {
  _clearLines();
  var printRow = '';
  for (var i = 0; i < display.length; i++) {

    if (i % DISPLAY_WIDTH_BYTES === 0) {
      printToScreen(printRow);
      printRow = '';
    }

    if (display[i] === 1)
      printRow = fillPixel(printRow, PIXEL_ON);
    else
      printRow = fillPixel(printRow, PIXEL_OFF);
  }
}

function fillPixel(str, char) {
  // for (var i = 0; i < WIDTH_RATIO; i++)
  str += char;
  return str;
}

function printToScreen(str) {
  for (var i = 0; i < HEIGHT_RATIO; i++)
    process.stdout.write(str + '\n');
}
