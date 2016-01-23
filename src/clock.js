/**
* Returns a new Clock instance.
* @constructor
* @arg {MemoryManager} mm - an object with access to delay timer and sound timer registers.
* @arg {Display} display - the display on which to paint when ready
* @arg {Number} clock_frequency - the number of CPU cycles per second
**/
function Clock(mm, display, clock_frequency) {
  this.mm = mm;
  this.display = display;
  this.frequency = clock_frequency;
  this.last_tick = Clock.current_time();
}

Clock.TIMER_HERTZ_FREQUENCY = 60;       // Allowed ticks per second
Clock.SOUND_ALERT_CODE      = '\007';   // 'Beep' sound

/**
* Gets the current time.
**/
Clock.current_time = function() {
  return Date.now();
};

/**
* Refresh the display and timers at the current tick/frame rate.
**/
Clock.prototype.tick = function() {
  if (Clock.current_time() - this.last_tick > (this.frequency / Clock.TIMER_HERTZ_FREQUENCY)) {
    this.display.paint();
    this.mm.reduce_delay_timer();
    this.mm.reduce_sound_timer();
    this.last_tick = Clock.current_time();
  }
};


exports.Clock = Clock;
