var searchInput = document.getElementById('search-input'); // Obtiene la referencia del input de búsqueda

searchInput.addEventListener('keyup', function() {
  var searchText = searchInput.value.toLowerCase(); // Obtiene el valor ingresado en el input de búsqueda

  var rowsConvocados = document.querySelectorAll('#jugadoresConvocadosTableBody tr'); // Obtener todas las filas de la tabla de jugadores convocados
  var rowsTitulares = document.querySelectorAll('#jugadoresTitularesTableBody tr'); // Obtener todas las filas de la tabla de jugadores titulares

  // Recorre las filas de la tabla de jugadores convocados y oculta las que no coincidan con la búsqueda
  for (var i = 0; i < rowsConvocados.length; i++) {
    var playerCell = rowsConvocados[i].getElementsByTagName('td')[1];
    var playerName = playerCell.textContent.toLowerCase();

    if (playerName.includes(searchText)) {
      rowsConvocados[i].style.display = '';
    } else {
      rowsConvocados[i].style.display = 'none';
    }
  }

  // Recorre las filas de la tabla de jugadores titulares y oculta las que no coincidan con la búsqueda
  for (var j = 0; j < rowsTitulares.length; j++) {
    var playerCell = rowsTitulares[j].getElementsByTagName('td')[1];
    var playerName = playerCell.textContent.toLowerCase();

    if (playerName.includes(searchText)) {
      rowsTitulares[j].style.display = '';
    } else {
      rowsTitulares[j].style.display = 'none';
    }
  }
});
