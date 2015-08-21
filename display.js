require('./memory');
var debug = require('./debug');

const SCREEN_WIDTH   = process.stdout.columns;
const SCREEN_HEIGHT  = process.stdout.rows;
const WIDTH_RATIO    = SCREEN_WIDTH >> 0x3;
const HEIGHT_RATIO   = SCREEN_HEIGHT >> 0x3;
const PIXEL_OFF      = ' ';
const PIXEL_ON       = '+';

exports.clear = function() {
  debug.log('Clearing the display');
  for (var i = 0; i < display.length; i++) {
    display[i] = 0;
  }
  for (var i = 0; i < process.stdout.rows; i++) {
    process.stdout.write('\n');
  }
};

exports.init = function() {
  exports.clear();
};
