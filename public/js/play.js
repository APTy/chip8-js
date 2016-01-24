document.addEventListener('DOMContentLoaded', function() {

  // Get the ROM name and URI for its metadata
  var rom_name = window.location.hash.substring(1);
  var rom_uri = '/roms/' + rom_name + '/json';

  // Use the window hash as the page title
  document.getElementById('title').innerHTML = rom_name;

  // Get ROM's metadata
  $.get(rom_uri, function(rom) {
    document.getElementById('description').innerHTML = rom.description;
    for (var control in rom.controls) {
      document.getElementById('controls').appendChild(createControlsParagraph(control, rom.controls[control]));
    }
  });

  /**
  * Create a new <p> element with game controls.
  **/
  function createControlsParagraph(name, description) {
    var p = document.createElement('p');
    p.class = 'game-controls';
    p.innerHTML = '<b>' + name + ':</b> ' + description;
    return p
  }

});
