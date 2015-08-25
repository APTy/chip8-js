require('./memory');
var debug = require('./debug');

const TIMER_HERTZ_FREQUENCY = 60;
const SOUND_ALERT_CODE = '\007';

var lastTick = 0;

function updateTimers() {
  if (DT > 0) {
    DT -= 1;
  }
  if (ST > 0) {
    // process.stdout.write('\007');
    ST -= 1;
  }
};

exports.tick = function() {
  if (Date.now() - lastTick > 1000 / TIMER_HERTZ_FREQUENCY) {
    updateTimers();
    lastTick = Date.now();
  }
};

exports.init = function() {
  debug.log('Initializing the clock');
  lastTick = Date.now();
};
