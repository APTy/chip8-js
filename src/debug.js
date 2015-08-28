const DEBUG = true;

exports.log = function() {
  if (DEBUG) console.log.apply(console, arguments);
}
