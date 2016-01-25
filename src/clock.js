/**
* Returns a new Clock instance.
* @constructor
* @arg {Number} clock_frequency - the number of CPU cycles per second
**/
function Clock(clock_frequency) {
  this.frequency = clock_frequency;
  this.last_tick = Clock.current_time();
  this.users = [];
}

Clock.TIMER_HERTZ_FREQUENCY = 60; // Allowed ticks per second

/**
* Gets the current time.
**/
Clock.current_time = function() {
  return Date.now();
};

/**
* Add an object/user that depends on the clock.
* @arg {Object} user - an object that implements an `on_tick` method.
**/
Clock.prototype.add_user = function(user) {
  this.users.push(user);
};

/**
* Run the `on_tick` method of all clock users.
**/
Clock.prototype.tick = function() {
  if (Clock.current_time() - this.last_tick > (this.frequency / Clock.TIMER_HERTZ_FREQUENCY)) {
    this.users.forEach(function(user) {
      user.on_tick();
    });
    this.last_tick = Clock.current_time();
  }
};


exports.Clock = Clock;
