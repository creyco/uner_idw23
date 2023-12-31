// Obtener el valor del parámetro de consulta 'datos' de la URL
var datosCodificados = new URLSearchParams(window.location.search).get('datos');

// Decodificar la cadena JSON
var datosJSON = decodeURIComponent(datosCodificados);

// Convertir la cadena JSON en un arreglo de JavaScript
var convocatoria = JSON.parse(datosJSON);
console.log(convocatoria)

// Obtener el elemento del DOM donde se mostrará la información de la convocatoria
var convocatoriaInfo = document.getElementById('convocatoria-info');

// Crear los elementos HTML para mostrar los datos de la convocatoria
var idElement = document.createElement('p');
idElement.textContent = 'Nº: ' + convocatoria.id + ' - Fecha: ' + convocatoria.fecha + ' - Rival: ' + convocatoria.rival + ' - Capitán: ' + convocatoria.capitan;;

// Agregar los elementos al contenedor de la convocatoria
convocatoriaInfo.appendChild(idElement);

// Genera la clave de la convocatoria***************************/
const id_convocada = convocatoria.id ; // Número de convocatoria

//***************************************************************/
// Obtener referencias a los elementos relevantes del DOM
//const jugadoresTableBody = document.getElementById('jugadores-table-body');

// localStorage.clear(); // Borra la memoria local
let initialData = []
let jugadores = []; // Mover la declaración de la variable jugadores aquí
let convocados = []; // Mover la declaración de la variable jugadores aquí
let nroConvocados = 0;
let jugadoresConvocados = [];
let convocadosCounter = 0;
let maxConvocados = 26;
//****************************************************************** */
// LEE CONVOCADOS 
function leeConvocados() {
  const storedConvocados = localStorage.getItem('convocados');

if (storedConvocados) {
    convocados = JSON.parse(storedConvocados);
    // Utilizar los datos almacenados en convocados
  } else {
    fetch('data/convocados.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('convocados', JSON.stringify(data));
        convocados = data; // Asignar los datos a la variable convocados
        // Utilizar los datos de la tabla JSON en convocados
      });
  }
}

function leeJugadores() {
  const storedJugadores = localStorage.getItem('jugadores');
  if (storedJugadores) {
      jugadores = JSON.parse(storedJugadores);

      // Agregar los campos "convocado" y "titular" a cada jugador
      jugadores.forEach(jugador => {
        jugador.convocado = false;
        jugador.titular = false;
      });   
      initialData = jugadores; // No es necesario obtener los datos nuevamente de localStorage   
      verificarConvocados();
    } else {    // Utilizar los datos almacenados en jugadores
        fetch('data/jugadores.json')
        .then(response => response.json())
        .then(data => {
          // Agregar el campo "convocado" a cada jugador
          data.forEach(jugador => {
            jugador.convocado = false; // Puedes asignar el valor predeterminado que desees
            jugador.titular = false;
          });

          localStorage.setItem('jugadores', JSON.stringify(data));
          jugadores = data; // Asignar los datos a la variable jugadores
          initialData = jugadores; // No es necesario obtener los datos nuevamente de localStorage
          verificarConvocados();
          // Utilizar los datos de la tabla JSON en jugadores
        });
    }
}

function verificarConvocados() {
  const storedConvocados = localStorage.getItem('convocados');
  
  if (storedConvocados) {
    const convocadosData = JSON.parse(storedConvocados);

    jugadores.forEach(jugador => {
      const convocado = convocadosData.find(convocado => convocado.idjugador === jugador.id);
      jugador.convocado = convocado ? true : false;
      jugador.titular = convocado ? convocado.titular : false;
      nroConvocados += jugador.convocado ? 1 : 0;
    });
  }
}
//***********************************************************************
  leeConvocados()
  leeJugadores()
  const nroConvocadosContainer = document.querySelector('#nroConvocados');
  nroConvocadosContainer.textContent = nroConvocados;
  displayJugadores(jugadores)
//***********************************************************************

// Obtener referencia a los elementos select de posición y apellido
const posicionSelect = document.getElementById('posicion');
const apellidoInput = document.getElementById('apellido');


// Función para filtrar los jugadores por posición y apellido
function filtrarJugadores(posicion, apellido) {
  const jugadoresFiltrados = initialData.filter(jugador => {
    const posicionMatch = posicion.toLowerCase() === 'todos' || jugador.posicion.toLowerCase() === posicion.toLowerCase();
    const apellidoMatch = apellido.toLowerCase() === '' || jugador.apellido.toLowerCase().startsWith(apellido.toLowerCase());
    return posicionMatch && apellidoMatch;
  });
  displayJugadores(jugadoresFiltrados);
}


// Evento de escucha para el cambio de posición y apellido
posicionSelect.addEventListener('change', () => {
  const posicionSeleccionada = posicionSelect.value;
  const apellidoIngresado = apellidoInput.value;
  filtrarJugadores(posicionSeleccionada, apellidoIngresado);
});

apellidoInput.addEventListener('input', () => {
  const posicionSeleccionada = posicionSelect.value;
  const apellidoIngresado = apellidoInput.value;
  filtrarJugadores(posicionSeleccionada, apellidoIngresado);
});

// Función para mostrar los jugadores en la tabla
function displayJugadores(jugadores) {
  //console.log(jugadores);
  const jugadoresTableBody = document.getElementById('jugadores-table-body');
  jugadoresTableBody.innerHTML = '';
  jugadores.forEach(jugador => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${jugador.id}</td>
      <td>${jugador.dni}</td>
      <td>${jugador.nombre}</td>
      <td>${jugador.apellido}</td>
      <td>${jugador.posicion}</td>
      <td>${jugador.dorsal}</td>
      <td>${jugador.piehabil}</td>
      <td>${jugador.apodo}</td>
      <td><img src="img/${jugador.imagen}" alt="${jugador.nombre} ${jugador.apellido}" /></td>
      <!-- <td><input type="checkbox" ${jugador.convocado ? 'checked' : ''} onchange="updateConvocado(${jugador.id}, this.checked)"></td> -->
      <td><input type="checkbox" value="${jugador.convocado}" /></td>
      
      <td>${jugador.titular}</td>
    `;
    jugadoresTableBody.appendChild(row);

    const checkbox = row.querySelector('input[type="checkbox"]');
    checkbox.checked = jugador.convocado;
    checkbox.addEventListener('change', () => {
      updateConvocado(jugadores, jugador.id, checkbox.checked);
      nroConvocadosContainer.textContent = nroConvocados;
  });
    // Mostrar la cantidad de jugadores convocados hasta el momento
    // const cantidadConvocados = jugadores.filter(jugador => jugador.convocado === true).length;
    // convocadosCounter.textContent = cantidadConvocados;
  
});
}
 
// Actualiza la variable convocado en la tabla jugador
  function updateConvocado(jugadores, id, convocado) {
    const jugador = jugadores.find(jugador => jugador.id === id);
    if (jugador) {
      jugador.convocado = convocado;
      nroConvocados += convocado ? 1 : -1;
    }
  }

// Agregar evento de clic al botón de salida
document.querySelector('#exit-button').addEventListener('click', () => {
  console.log('Botón de salida y guardar cambios presionado');
  
  if (confirm('¿Estás seguro de que quieres salir y guardar los cambios?')) {
    // Obtener los jugadores del almacenamiento local
    //const jugadores = JSON.parse(localStorage.getItem('jugadoresConvocados'));
       
    // Iterar sobre los jugadores para obtener los convocados
    jugadores.forEach(jugador => {
      if (jugador.convocado) {
        const jugadorConvocado = {
          idconvocada: id_convocada, // Reemplaza "id_convocada" con el valor correcto
          idjugador: jugador.id,
          posicion: jugador.posicion,
          titular: jugador.titular
        };
        jugadoresConvocados.push(jugadorConvocado);
      }
    });
    
    // Guardar los jugadores convocados en la memoria local
    localStorage.setItem('convocados', JSON.stringify(jugadoresConvocados));
    
    // Redirigir a la página "crudconvocatorias.html"
    window.location.href = "crudconvocatorias.html";    
  }
});

// Agregar evento de clic al botón de arrepentimiento
document.querySelector('#cancel-button').addEventListener('click', () => {
  console.log('Botón de salir sin guardar cambios presionado');
  if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
    localStorage.setItem('jugadores', initialData); // Restaurar el estado inicial   
    window.location.href = "crudconvocatorias.html";
  }
});
