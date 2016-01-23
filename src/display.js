/**
* Returns a new Display instance.
* @constructor
* @arg {MemoryManager} mm - an object with access to delay timer and sound timer registers.
**/
function Display(mm) {
  var memory                = require('./memory');
  var canvas                = document.getElementById('screen');
  this.screen               = canvas.getContext('2d');
  this.screen_width         = canvas.width;
  this.screen_height        = canvas.height;
  this.mm                   = mm;
  this.display_width_bytes  = memory.MemoryManager.DISPLAY_WIDTH_BYTES;
  this.display_height_bytes = memory.MemoryManager.DISPLAY_HEIGHT_BYTES;
  this.width_ratio          = Math.floor(this.screen_width / this.display_width_bytes);
  this.height_ratio         = Math.floor(this.screen_height / this.display_height_bytes);
}

/**
* Prepare the display for use.
**/
Display.prototype.initialize = function() {
  this.clear();
}

/**
* Clear the screen and all display memory.
**/
Display.prototype.clear = function() {
  this.screen.fillRect(0, 0, this.screen_width, this.screen_height);
  this.mm.clear_display();
};

/**
* Paint XOR'd pixels from display memory onto the screen.
**/
Display.prototype.paint = function() {
  this.mm.for_each_display_pixel(function(pixel, index) {
    var x = (index % this.display_width_bytes) * this.width_ratio;
    var y = Math.floor(index / this.display_width_bytes) * this.height_ratio;
    if (pixel === 1) {
      this.screen.clearRect(x, y, this.width_ratio, this.height_ratio);
    } else {
      this.screen.fillRect(x, y, this.width_ratio, this.height_ratio);
    }
  }.bind(this));
}


exports.Display = Display;
