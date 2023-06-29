var searchInput = document.getElementById('search-input');
var positionSelect = document.getElementById('position-select');

searchInput.addEventListener('keyup', searchPlayers);
positionSelect.addEventListener('change', searchPlayers);

function searchPlayers() {
  var searchText = searchInput.value.toLowerCase();
  var selectedPosition = positionSelect.value.toLowerCase();

  var rowsConvocados = document.querySelectorAll('#jugadoresConvocadosTableBody tr');
  var rowsTitulares = document.querySelectorAll('#jugadoresTitularesTableBody tr');

  for (var i = 0; i < rowsConvocados.length; i++) {
    var playerCell = rowsConvocados[i].getElementsByTagName('td')[1];
    var playerName = playerCell.textContent.toLowerCase();
    var playerPosition = rowsConvocados[i].getElementsByTagName('td')[3].textContent.toLowerCase();

    var matchesSearchText = playerName.includes(searchText);
    var matchesPosition = selectedPosition === '' || playerPosition === selectedPosition;

    if (matchesSearchText && matchesPosition) {
      rowsConvocados[i].style.display = '';
    } else {
      rowsConvocados[i].style.display = 'none';
    }
  }

  for (var j = 0; j < rowsTitulares.length; j++) {
    var playerCell = rowsTitulares[j].getElementsByTagName('td')[1];
    var playerName = playerCell.textContent.toLowerCase();
    var playerPosition = rowsTitulares[j].getElementsByTagName('td')[0].textContent.toLowerCase();

    var matchesSearchText = playerName.includes(searchText);
    var matchesPosition = selectedPosition === '' || playerPosition === selectedPosition;

    if (matchesSearchText && matchesPosition) {
      rowsTitulares[j].style.display = '';
    } else {
      rowsTitulares[j].style.display = 'none';
    }
  }
}
