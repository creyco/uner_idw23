var jugadoresData = localStorage.getItem("jugadores");
if (jugadoresData) {
  var jugadores = JSON.parse(jugadoresData);
  var tableBody = document.getElementById("jugadoresTableBody");

  for (var i = 0; i < jugadores.length; i++) {
    var jugador = jugadores[i];

    var row = document.createElement("tr");
    var idCell = document.createElement("td");
    var nombreCell = document.createElement("td");
    var dorsalCell = document.createElement("td");
    var posicionCell = document.createElement("td");

    idCell.textContent = jugador.dni;
    nombreCell.textContent = jugador.apellido + " " + jugador.nombres;
    dorsalCell.textContent = jugador.dorsal;
    posicionCell.textContent = jugador.posicion;

    row.appendChild(idCell);
    row.appendChild(nombreCell);
    row.appendChild(dorsalCell);
    row.appendChild(posicionCell);

    tableBody.appendChild(row);
  }
}
