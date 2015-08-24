var fs = require('fs');
var debug = require('./debug');

exports.init = function() {
  debug.log('Initializing input listeners')
  process.openStdin();
};

exports.isKeyDown = function(key) {
  console.log(process.stdin);
};
