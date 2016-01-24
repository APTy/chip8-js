document.addEventListener('DOMContentLoaded', function() {

  // Get a list of available ROMs
  $.get('/roms', function(roms) {
    // Get the list element on the screen
    var list = document.getElementById('list');

    // Append a newly created div for each ROM to the list
    for (var rom in roms) {
      list.appendChild(createRomDivItem(rom, roms[rom].description));
    }
  });

  /**
  * Create a new <div> element with a game hyperlink and description.
  **/
  function createRomDivItem(name, description) {
    var div = document.createElement('div');

    // Title/game hyperlink
    var a = document.createElement('a');
    a.id = 'rom-name';
    a.href = 'play.html#' + name;
    a.innerHTML = name;

    // Description
    var p = document.createElement('p');
    p.id = 'rom-description';
    p.innerText = description;

    // Add to the enclosing div
    div.appendChild(a);
    div.appendChild(p);
    return div
  }

});
