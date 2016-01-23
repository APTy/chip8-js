(function main() {

  var cpu = require('./cpu');
  var input = require('./input');
  var memory = require('./memory');
  var loader = require('./loader');
  var display = require('./display');

  var mm = new memory.MemoryManager();
  var display = new display.Display(mm);
  var input = new input.KeyboardInput();
  var loader = new loader.HTTPLoader();
  var cpu = new cpu.CPU(mm, display, input, loader);

  var current_rom = window.location.hash.substring(1);
  cpu.initialize(current_rom);

})();
