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
  this.clock = new clock.Clock(clock_frequency);
  this.executor = new executor.Executor(mm, display, input);
}

CPU.DEFAULT_CLOCK_FREQUENCY = 1000; // Cycles per second

/**
* Initialize the CPU, set it's memory, read in the ROM, and start the cycle.
* @arg {String} rom - the name of the ROM to load into memory.
**/
CPU.prototype.initialize = function(rom) {
  // Set the current ROM name
  this.current_rom = rom;

  // Add the MemoryManager and Display as dependents of the Clock
  this.clock.add_user(this.mm);
  this.clock.add_user(this.display);

  // Initialize the CPU's memory
  this.mm.initialize();

  // Retrieve the ROM from its location
  this.loader.read_rom(this.current_rom, function(rom) {

    // Load the ROM into memory after successful retrieval
    this.mm.load_into_memory(rom);

    // Start the CPU cycle, and decode a number of instructions per cycle equal to the clock frequency
    setInterval(function() {
      for(var i = 0; i < Math.floor(this.clock.frequency / CPU.DEFAULT_CLOCK_FREQUENCY); i++) {
        this.cycle();
      }
    }.bind(this), 1);
  }.bind(this));
};

/**
* Run a single cycle of the CPU's fetch-decode-execute loop.
**/
CPU.prototype.cycle = function() {
  // Verify that we are not "blocking" on some input
  if (!this.input.is_awaiting) {

    // Increment the internal clock
    this.clock.tick();

    // Fetch-Decode-Execute: Execute(Decode(Fetch()))
    this.executor.execute(this.decoder.decode(this.mm.read()));
  }
};


exports.CPU = CPU;