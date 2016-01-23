/**
* Returns a new CPU instance.
* @constructor
**/
function CPU(mm, display, input, loader, clock_frequency) {
  var clock = require('./clock');
  var decoder = require('./decoder');
  var executor = require('./executor');
  clock_frequency = (!clock_frequency || clock_frequency < CPU.DEFAULT_CLOCK_FREQUENCY) ? CPU.DEFAULT_CLOCK_FREQUENCY : clock_frequency;

  this.mm = mm;
  this.input = input;
  this.loader = loader;
  this.display = display;
  this.decoder = decoder;
  this.clock = new clock.Clock(mm, display, clock_frequency);
  this.executor = new executor.Executor(mm, display, input);
  this.current_rom = window.location.hash.substring(1);
}

CPU.DEFAULT_CLOCK_FREQUENCY = 1000; // Cycles per second

/**
* Initialize the CPU, set it's memory, read in the ROM, and start the cycle
**/
CPU.prototype.initialize = function() {
  this.mm.initialize();
  this.loader.read_rom(this.current_rom, function(rom) {
    this.mm.load_into_memory(rom);
    setInterval(function() {
      for(var i = 0; i < Math.floor(this.clock.frequency / CPU.DEFAULT_CLOCK_FREQUENCY); i++) {
        this.cycle();
      }
    }.bind(this), 1);
  }.bind(this));
};

/**
* Run a cycle of the CPU's fetch-decode-execute loop.
**/
CPU.prototype.cycle = function() {
  if (!this.input.is_awaiting) {
    this.clock.tick();
    this.executor.execute(this.decoder.decode(this.mm.read()));
  }
};


exports.CPU = CPU;
