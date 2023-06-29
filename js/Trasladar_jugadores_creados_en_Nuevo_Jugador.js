// Cargar jugadores convocados desde el LocalStorage si existen
var convocadosData = localStorage.getItem("convocados");
var convocados = convocadosData ? JSON.parse(convocadosData) : [];

actualizarTablaConvocados();

function actualizarTablaConvocados() {
  var table = document.getElementById("convocadosTable").getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  for (var i = 0; i < convocados.length; i++) {
    var jugador = convocados[i];

    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = jugador.dni;
    cell2.innerHTML = jugador.apellido + " " + jugador.nombres;
    cell3.innerHTML = jugador.dorsal;
    cell4.innerHTML = jugador.posicion;
  }
}

