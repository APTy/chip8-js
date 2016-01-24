document.addEventListener('DOMContentLoaded', function() {

  // Get a list of available ROMs
  $.get('/roms', function(roms) {
    var list = document.getElementById('list');

    roms.forEach(function(rom) {
      var div = document.createElement('div');
      var anchor = document.createElement('a');
      anchor.href = 'play.html#' + rom;
      anchor.innerHTML = rom;
      div.appendChild(anchor);
      list.appendChild(div);
    });
  });

});
