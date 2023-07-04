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
const nro_convocada = id_convocada.toString().padStart(3, '0');

//***************************************************************/
// Obtener referencias a los elementos relevantes del DOM
const posicionSelect = document.getElementById('posicion');
const jugadoresTableBody = document.getElementById('jugadores-table-body');

// localStorage.clear(); // Borra la memoria local
let initialData = []
let jugadores = []; // Mover la declaración de la variable jugadores aquí
let jugadoresFiltrados = [];
let cantidadConvocados = 0;
let maxConvocados = 26;

  if (localStorage.getItem('jugadores') === null) {
  fetch('data/jugadores.json')
    .then(response => response.json())
    .then(data => {
      // Agregar el campo "convocado" a cada jugador
      data.forEach(jugador => {
      jugador.convocado = false; // Puedes asignar el valor predeterminado que desees
      });

      localStorage.setItem('jugadores', JSON.stringify(data));
      initialData = localStorage.getItem('jugadores');
      jugadores = data; // Asignar los datos a la variable jugadores
      displayJugadores(data);
    });
  } else {
  // Si los datos ya están en la memoria local, mostrarlos en la tabla
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  initialData = localStorage.getItem('jugadores');
  displayJugadores(jugadores);
  }
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
}

function updateConvocado(id, convocado) {
  // Obtener los jugadores del almacenamiento local
  const jugadores = JSON.parse(localStorage.getItem('jugadoresConvocados'));

  // Buscar el jugador con el ID especificado
  const jugador = jugadores.find(jugador => jugador.id === id);

  // Si se encontró el jugador, actualizar su estado de convocatoria
  if (jugador) {
    jugador.convocado = convocado;

    // Actualizar el conteo de jugadores convocados
    if (convocado) {
      cantidadConvocados++;
    } else {
      cantidadConvocados--;
    }

    // Guardar los datos actualizados en el almacenamiento local
    localStorage.setItem('jugadoresConvocados', JSON.stringify(jugadores));
  }

  // Si se alcanzó el límite de jugadores convocados, mostrar un mensaje
  if (cantidadConvocados === maxConvocados) {
    alert(`Se ha alcanzado el límite de ${maxConvocados} jugadores convocados`);
  }
}

// Agregar evento de clic al botón de salida
 document.querySelector('#exit-button').addEventListener('click', () => {
   console.log('Botón de salida y guardar cambios presionado');
   if (confirm('¿Estás seguro de que quieres salir y guardar los cambios?')) {
     saveChanges();     
     window.close();
   }
 });

// Agregar evento de clic al botón de arrepentimiento
document.querySelector('#cancel-button').addEventListener('click', () => {
  console.log('Botón de salir sin guardar cambios presionado');
  if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
    localStorage.setItem('jugadores', initialData); // Restaurar el estado inicial
    window.close();
  }
});
