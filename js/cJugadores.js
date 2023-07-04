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
const posicionSelect = document.getElementById('posicion');
const jugadoresTableBody = document.getElementById('jugadores-table-body');

// localStorage.clear(); // Borra la memoria local
let initialData = []
let jugadores = []; // Mover la declaración de la variable jugadores aquí
let convocados = []; // Mover la declaración de la variable jugadores aquí
let jugadoresFiltrados = [];
let cantidadConvocados = 0;
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
    verificarConvocados();
    // Utilizar los datos almacenados en jugadores
  } else {
    fetch('data/jugadores.json')
      .then(response => response.json())
      .then(data => {
        // Agregar el campo "convocado" a cada jugador
        data.forEach(jugador => {
          jugador.convocado = false; // Puedes asignar el valor predeterminado que desees
        });

        localStorage.setItem('jugadores', JSON.stringify(data));
        verificarConvocados();
        jugadores = data; // Asignar los datos a la variable jugadores
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
      });
    }
}
//***********************************************************************
  leeConvocados()
  leeJugadores()
  displayJugadores(jugadores)
//***********************************************************************

// Función para filtrar los jugadores por posición
function filtrarJugadoresPorPosicion(posicion) {
  // Obtener los jugadores filtrados según la posición seleccionada
  const jugadoresFiltrados = jugadores.filter(jugador => {
    return posicion.toLowerCase() === 'todos' || jugador.posicion.toLowerCase() === posicion.toLowerCase();
  });  
  // Mostrar los jugadores filtrados en la tabla  
  displayJugadores(jugadoresFiltrados);
}

// Evento de escucha para el cambio de posición
posicionSelect.addEventListener('change', () => {
  const seleccion = posicionSelect.value;
  filtrarJugadoresPorPosicion(seleccion);
  console.log(seleccion)
});

// Función para mostrar los jugadores en la tabla
function displayJugadores(jugadores) {
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
      <td><input type="checkbox" ${jugador.convocado ? 'checked' : ''} onchange="updateConvocado(${jugador.id}, this.checked)"></td>
    `;
    jugadoresTableBody.appendChild(row);
  });
    // Mostrar la cantidad de jugadores convocados hasta el momento
    const cantidadConvocados = jugadores.filter(jugador => jugador.convocado === true).length;
    convocadosCounter.textContent = cantidadConvocados;
}
/*
function updateConvocado(id, convocado) {
  // Obtener los jugadores convocados del almacenamiento local
  let jugadoresConvocados = JSON.parse(localStorage.getItem('convocados'));

  // Buscar el jugador con el ID especificado
  const jugador = jugadoresConvocados.find(jugador => jugador.idjugador === id);

  // Si se encontró el jugador, actualizar su estado de convocatoria
  if (jugador) {
    // Actualizar el estado de convocatoria del jugador
    jugador.convocado = convocado;

    // Guardar los datos actualizados en el almacenamiento local
    localStorage.setItem('convocados', JSON.stringify(jugadoresConvocados));
  }
}
*/

function updateConvocado(id, convocado) {
  // Obtener los jugadores del almacenamiento local
  let jugadores = JSON.parse(localStorage.getItem('jugadoresConvocados'));

  // Buscar el jugador con el ID especificado
  const jugador = jugadores.find(jugador => jugador.id === id);

  // Si se encontró el jugador, actualizar su estado de convocatoria
  if (jugador) {
    // Verificar si la suma de convocados supera el límite
    let cantidadConvocados = jugadores.filter(jugador => jugador.convocado).length;

    if (convocado && cantidadConvocados >= maxConvocados) {
      // Mostrar mensaje de error
      alert(`No se puede convocar a más de ${maxConvocados} jugadores.`);
      return;
    }

    // Actualizar el estado de convocatoria del jugador
    jugador.convocado = convocado;

    // Actualizar la cantidad de jugadores convocados
    cantidadConvocados = jugadores.filter(jugador => jugador.convocado).length;
    convocadosCounter.textContent = cantidadConvocados;

    // Guardar los datos actualizados en el almacenamiento local
    localStorage.setItem('jugadoresConvocados', JSON.stringify(jugadores));
  }
}


// Agregar evento de clic al botón de salida
document.querySelector('#exit-button').addEventListener('click', () => {
  console.log('Botón de salida y guardar cambios presionado');
  
  if (confirm('¿Estás seguro de que quieres salir y guardar los cambios?')) {
    // Obtener los jugadores del almacenamiento local
    const jugadores = JSON.parse(localStorage.getItem('jugadoresConvocados'));
       
    // Iterar sobre los jugadores para obtener los convocados
    jugadores.forEach(jugador => {
      if (jugador.convocado) {
        const jugadorConvocado = {
          idconvocada: id_convocada, // Reemplaza "id_convocada" con el valor correcto
          idjugador: jugador.id,
          posicion: jugador.posicion
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
