// var util = require('util');

const DEBUG = true;

exports.log = function() {
  // if (DEBUG) util.log.apply(console, arguments);
  if (DEBUG) console.log.apply(console, arguments);
}
