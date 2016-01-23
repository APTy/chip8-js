/**
* Returns a LoaderBase abstract base class.
* @constructor
**/
function LoaderBase() {}

/**
* Read a ROM to memory.
**/
LoaderBase.prototype.read_rom = function() {
  throw new Error('Method not implemented.');
}


/**
* Returns a new HTTPLoader instance.
* @constructor
**/
function HTTPLoader() {
  LoaderBase.call(this);
}

HTTPLoader.prototype = LoaderBase.prototype;
HTTPLoader.prototype.constructor = HTTPLoader;

/**
* Get an array buffer of ROM data from the server.
**/
HTTPLoader.prototype.get = function(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path);
  xhr.responseType = 'arraybuffer';
  xhr.send();
  xhr.onload = function(e) {
    var arrayBuffer = xhr.response;
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      callback(byteArray);
    }
  }
};

/**
* Download a ROM from the server.
**/
HTTPLoader.prototype.read_rom = function(rom_name, callback) {
  /*  Hit server for ROM data  */
  this.get('roms?name=' + rom_name, function(rom_buffer) {
    /*  Call the next function in the init sequence  */
    callback(rom_buffer);
  });
};


exports.HTTPLoader = HTTPLoader;
