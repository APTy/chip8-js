exports.get = function(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://localhost:3000/" + path);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  }
};
