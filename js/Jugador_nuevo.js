var jugadores = [];

    // Cargar jugadores desde el LocalStorage si existen
    var jugadoresData = localStorage.getItem("jugadores");
    if (jugadoresData) {
      jugadores = JSON.parse(jugadoresData);
      actualizarTabla();
    }

    document.getElementById("g-nuev-jug").addEventListener("click", function(event) {
      event.preventDefault();
      
      // Validar campos antes de agregar el jugador
      if (!validarCampos()) {
        return;
      }

      var dni = document.getElementById("DNI").value;

      // Verificar si el jugador ya existe por su DNI
      var jugadorExistente = jugadores.find(function(jugador) {
        return jugador.dni === dni;
      });

      if (jugadorExistente) {
        alert("El jugador ya existe");
        return;
      }

      var dorsal = document.getElementById("dorsal_jugadores").value;

      // Verificar si el dorsal ya está asignado a otro jugador
      var jugadorDorsalExistente = jugadores.find(function(jugador) {
        return jugador.dorsal === dorsal;
      });

      if (jugadorDorsalExistente) {
        alert("Ese número de dorsal ya fue asignado, comuníquese con el DT");
        return;
      }

      var apellido = document.getElementById("apellido_jugadores").value;
      var nombres = document.getElementById("nombres_jugadores").value;
      var posicion = document.getElementById("posicion_jugadores").value;
      var pie = document.getElementById("pie_jugadores").value;
      var apodo = document.getElementById("apodo_jugadores").value;

      var jugador = {
        dni: dni,
        apellido: apellido,
        nombres: nombres,
        posicion: posicion,
        pie: pie,
        apodo: apodo,
        dorsal: dorsal
      };

      jugadores.push(jugador);

      localStorage.setItem("jugadores", JSON.stringify(jugadores));

      actualizarTabla();

      alert("Jugador cargado correctamente");
      limpiarFormulario();
    });

    // Agregar función de validación de campos
  function validarCampos() {
    var dni = document.getElementById("DNI").value;
    var apellido = document.getElementById("apellido_jugadores").value;
    var nombres = document.getElementById("nombres_jugadores").value;
    var posicion = document.getElementById("posicion_jugadores").value;
    var pie = document.getElementById("pie_jugadores").value;
    var apodo = document.getElementById("apodo_jugadores").value;
    var dorsal = document.getElementById("dorsal_jugadores").value;

    // Verificar si algún campo está vacío
    if (dni === "" || apellido === "" || nombres === "" || posicion === "" || pie === "" || apodo === "" || dorsal === "") {
      alert("Por favor, complete todos los campos del formulario");
      return false; // Detener el proceso de guardado
    }

    return true; // Todos los campos están completos
  }


    document.getElementById("g-editar-jug").addEventListener("click", function(event) {
      event.preventDefault();

      var dni = document.getElementById("DNI").value;

      // Buscar el jugador por su DNI
      var jugador = jugadores.find(function(jugador) {
        return jugador.dni === dni;
      });

      if (!jugador) {
        alert("El jugador no existe");
        return;
      }

      var apellido = document.getElementById("apellido_jugadores").value;
      var nombres = document.getElementById("nombres_jugadores").value;
      var posicion = document.getElementById("posicion_jugadores").value;
      var pie = document.getElementById("pie_jugadores").value;
      var apodo = document.getElementById("apodo_jugadores").value;
      var dorsal = document.getElementById("dorsal_jugadores").value;

      // Actualizar los datos del jugador
      jugador.apellido = apellido;
      jugador.nombres = nombres;
      jugador.posicion = posicion;
      jugador.pie = pie;
      jugador.apodo = apodo;
      jugador.dorsal = dorsal;

      localStorage.setItem("jugadores", JSON.stringify(jugadores));

      actualizarTabla();

      alert("Jugador actualizado correctamente");
      limpiarFormulario();
    });

    function actualizarTabla() {
      var table = document.getElementById("jugadoresTable").getElementsByTagName("tbody")[0];
      table.innerHTML = "";

      for (var i = 0; i < jugadores.length; i++) {
        var jugador = jugadores[i];

        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8); // Nueva celda para el botón de eliminar
        var cell10 = row.insertCell(9); // Nueva celda para el checkbox
        cell1.innerHTML = jugador.dni;
        cell2.innerHTML = jugador.apellido;
        cell3.innerHTML = jugador.nombres;
        cell4.innerHTML = jugador.posicion;
        cell5.innerHTML = jugador.pie;
        cell6.innerHTML = jugador.apodo;
        cell7.innerHTML = jugador.dorsal;
        cell8.innerHTML = '<button onclick="editarJugador(' + i + ')">Editar</button>'; // Botón de Editar
        cell9.innerHTML = '<button onclick="eliminarJugador(' + i + ')">Eliminar</button>'; // Botón de eliminar
        cell10.innerHTML = '<input type="checkbox" name="convocarJugador" value="' + i + '">';
      }
    }

    function limpiarFormulario() {
      document.getElementById("DNI").value = "";
      document.getElementById("apellido_jugadores").value = "";
      document.getElementById("nombres_jugadores").value = "";
      document.getElementById("posicion_jugadores").value = "";
      document.getElementById("pie_jugadores").value = "";
      document.getElementById("apodo_jugadores").value = "";
      document.getElementById("dorsal_jugadores").value = "";
    }

    function editarJugador(index) {
      var jugador = jugadores[index];

      document.getElementById("DNI").value = jugador.dni;
      document.getElementById("apellido_jugadores").value = jugador.apellido;
      document.getElementById("nombres_jugadores").value = jugador.nombres;
      document.getElementById("posicion_jugadores").value = jugador.posicion;
      document.getElementById("pie_jugadores").value = jugador.pie;
      document.getElementById("apodo_jugadores").value = jugador.apodo;
      document.getElementById("dorsal_jugadores").value = jugador.dorsal;
    }

    function eliminarJugador(index) {
      jugadores.splice(index, 1); // Eliminar el jugador del arreglo
      localStorage.setItem("jugadores", JSON.stringify(jugadores)); // Actualizar el LocalStorage
      actualizarTabla(); // Actualizar la tabla
      alert("Jugador eliminado correctamente");
    }

    function convocarJugadores() {
      var checkboxes = document.getElementsByName("convocarJugador");
      var jugadoresConvocados = [];
    
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          var jugadorIndex = parseInt(checkboxes[i].value);
          var jugador = jugadores[jugadorIndex];
    
          // Agregar solo la información necesaria a jugadoresConvocados
          var jugadorConvocado = {
            dni: jugador.dni,
            apellido: jugador.apellido,
            nombres: jugador.nombres,
            dorsal: jugador.dorsal,
            posicion: jugador.posicion
          };
    
          jugadoresConvocados.push(jugadorConvocado);
        }
      }
    
      // Guardar los jugadores convocados en el LocalStorage
      localStorage.setItem("jugadoresConvocados", JSON.stringify(jugadoresConvocados));
    
      // Redireccionar a la página "jugadores convocados"
      //window.location.href = "jugadores_convocados.html";

      // Abrir una nueva pestaña con jugadores_convocados.html
      window.open("equipotitular.html"); //antes jugadores_convocados.html


      // Mostrar el cartel emergente con la cantidad de jugadores convocados
      var cartelEmergente = document.getElementById("cartelEmergente");
      cartelEmergente.innerHTML = "Se han convocado a " + jugadoresConvocados.length + " jugadores.";
      cartelEmergente.style.display = "block";
    }   