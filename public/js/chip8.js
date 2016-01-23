var $ = (function() {

  /**
  * Send a GET request to the server for a JSON response.
  **/
  function get(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.response);
      }
    }
    xhr.send();
  }

  return {
    get: get
  };

})();
