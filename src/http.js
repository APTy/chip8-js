/*  Get an array buffer of ROM data from the server  */
exports.get = function(path, callback) {
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
