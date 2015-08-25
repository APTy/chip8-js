exports.get = function(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://localhost:3000/" + path);
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
