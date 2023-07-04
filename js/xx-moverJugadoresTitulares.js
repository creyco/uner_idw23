var jugadoresConvocadosData = localStorage.getItem("jugadoresConvocados");
var jugadoresConvocados = [];

if (jugadoresConvocadosData) {
    jugadoresConvocados = JSON.parse(jugadoresConvocadosData);
    var tableBody = document.getElementById("jugadoresConvocadosTableBody");
    var titularesTableBody = document.getElementById("jugadoresTitularesTableBody");

    for (var i = 0; i < jugadoresConvocados.length; i++) {
        var jugadorConvocado = jugadoresConvocados[i];

        var row = tableBody.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = jugadorConvocado.dni;
        cell2.innerHTML = jugadorConvocado.apellido + ", " + jugadorConvocado.nombres;
        cell3.innerHTML = jugadorConvocado.dorsal;
        cell4.innerHTML = jugadorConvocado.posicion;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "jugadorTitular";
        checkbox.value = i;
        cell5.appendChild(checkbox);
    }
}

var jugadoresTitulares = [];
var indiceCapitan = -1;

function seleccionarCapitan(index) {
    // quita al jugador anteriormente seleccionado como capitán
    if (indiceCapitan !== -1) {
        jugadoresTitulares[indiceCapitan].capitan = false;
    }

    // selecciona al nuevo jugador como capitán
    indiceCapitan = index;
    jugadoresTitulares[indiceCapitan].capitan = true;

    // Actualiza la tabla de jugadores titulares
    mostrarJugadoresTitulares();
}

function mostrarJugadoresTitulares() {
    var titularesTableBody = document.getElementById("jugadoresTitularesTableBody");
    titularesTableBody.innerHTML = "";

    for (var i = 0; i < jugadoresTitulares.length; i++) {
        var jugadorTitular = jugadoresTitulares[i];

        var row = titularesTableBody.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = jugadorTitular.posicion;
        cell2.innerHTML = jugadorTitular.apellido + ", " + jugadorTitular.nombres;
        cell3.innerHTML = jugadorTitular.capitan ? "Sí" : "No";

        var selectButton = document.createElement("button");
        selectButton.innerHTML = "Capitán";
        selectButton.onclick = (function (index) {
            return function () {
                seleccionarCapitan(index);
            };
        })(i);

        cell4.appendChild(selectButton);

        var removeButton = document.createElement("button");
        removeButton.innerHTML = "Quitar";
        removeButton.onclick = function () {
            var row = this.parentNode.parentNode;
            var jugadorIndex = Array.from(row.parentNode.children).indexOf(row);
            var jugadorTitular = jugadoresTitulares[jugadorIndex];

            row.remove();
            jugadoresTitulares.splice(jugadorIndex, 1);

            if (indiceCapitan === jugadorIndex) {
                indiceCapitan = -1;
            }

            var tableBody = document.getElementById("jugadoresConvocadosTableBody");
            var newRow = tableBody.insertRow(-1);
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            var cell5 = newRow.insertCell(4);

            cell1.innerHTML = jugadorTitular.dni;
            cell2.innerHTML = jugadorTitular.apellido + ", " + jugadorTitular.nombres;
            cell3.innerHTML = jugadorTitular.dorsal;
            cell4.innerHTML = jugadorTitular.posicion;

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "jugadorTitular";
            checkbox.value = jugadoresConvocados.indexOf(jugadorTitular);
            cell5.appendChild(checkbox);
        };

        cell5.appendChild(removeButton);
    }
}

function moverJugadoresTitulares() {
    var checkboxes = document.getElementsByName("jugadorTitular");

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            var jugadorIndex = parseInt(checkboxes[i].value);
            var jugador = jugadoresConvocados[jugadorIndex];
            jugadoresTitulares.push(jugador);

            checkboxes[i].parentNode.parentNode.remove();
        }
    }

    mostrarJugadoresTitulares();
}

// Función para guardar los cambios realizados en el almacenamiento local y salir del sitio
function guardarCambiosYSalir() {
    // Guarda los cambios realizados en el almacenamiento local
    localStorage.setItem("jugadoresConvocados", JSON.stringify(jugadoresConvocados));

    // Sale del sitio
    window.location.href = "../index.html"; 
}

// Función para guardar los cambios realizados en el sitio y continuar en el mismo sitio
function guardarCambiosYContinuar() {
    // Guarda los cambios realizados en el almacenamiento local
    localStorage.setItem("jugadoresConvocados", JSON.stringify(jugadoresConvocados));

    // mesanje emergente
    alert("Cambios guardados. Puedes continuar editando el equipo.");
}

// Función para volver a la página principal
function volverAPaginaPrincipal() {
    window.location.href = "../index.html"; // Redirigir a la página principal
}