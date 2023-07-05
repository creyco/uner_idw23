 //Borra memoria local
localStorage.clear();    
let initialData = [] 

// Leer el archivo data/jugadores.json usando fetch y almacenarlo en la memoria local si no existe
if (localStorage.getItem('jugadores') === null) {
  fetch('data/jugadores.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('jugadores', JSON.stringify(data));
      initialData = data; // No es necesario obtener los datos nuevamente de localStorage
      displayJugadores(data);
    });
  } else {
  // Si los datos ya están en la memoria local, mostrarlos en la tabla
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  initialData = jugadores; // No es necesario obtener los datos nuevamente de localStorage
  displayJugadores(jugadores);
  }

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
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';
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
      
    `;
    row.querySelector('img').addEventListener('click', () => editJugador(jugador));
    
    //row.querySelector('.edit-button').addEventListener('click', () => editJugador(jugador));
    tableBody.appendChild(row);
  });
 }

 function createJugador() {
  // Calculate the next available ID
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  const nextId = Math.max(...jugadores.map(jugador => jugador.id)) + 1;
  
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
  <div class="modal-content">
  <span class="close-button">×</span>
  <form class="form_input">
    <div class="form-row">
      <label>ID:</label>
      <input type="number" name="id" value="${nextId}" readonly />
    </div>
    <div class="form-row">
      <label>DNI:</label>
      <input type="text" name="dni" maxlength="8" />
    </div>
    <div class="form-row">
      <label>Nombre:</label>
      <input type="text" name="nombre" id="nombreInput" />
    </div>
    <div class="form-row">
      <label>Apellido:</label>
      <input type="text" name="apellido" id="apellidoInput" />
    </div>
    <div class="form-row">
      <label>Posición:</label>
      <select name="posicion">
        <option value="Arquero">Arquero</option>
        <option value="Defensa">Defensa</option>
        <option value="Mediocampo">Mediocampo</option>
        <option value="Delantero">Delantero</option>
      </select>
    </div>
    <div class="form-row">
      <label>Dorsal:</label>
      <input type="number" name="dorsal" min="1" max="99" />
    </div>
    <div class="form-row">
      <label>Pie hábil:</label>
      <label><input type="radio" name="piehabil" value="Izquierdo" /> Izquierdo</label>
      <label><input type="radio" name="piehabil" value="Derecho" /> Derecho</label>
    </div>
    <div class="form-row">
      <label>Apodo:</label>
      <input type="text" name="apodo" />
    </div>
    <div class="form-row">
      <label>Imagen:</label>
      <input type="text" name="imagen" />
    </div>
    <div class="form-row">
      <button type="submit">Guardar cambios</button>
    </div>
  </form>
</div>
  `;

  // Obtener los elementos de los campos de nombre y apellido
  const nombreInput = modal.querySelector('#nombreInput');
  const apellidoInput = modal.querySelector('#apellidoInput');

  // Agregar el evento input a los campos de nombre y apellido
  nombreInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });

  apellidoInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });

  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newJugador = Object.fromEntries(formData.entries());
    addJugador(newJugador);
    closeModal(modal);   
  });

  modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
  document.body.appendChild(modal);
}

 // Función para agregar un nuevo jugador
 function addJugador(newJugador) {
  // Agregar el nuevo jugador a la memoria local
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  jugadores.push(newJugador);
  localStorage.setItem('jugadores', JSON.stringify(jugadores));  
  displayJugadores(jugadores);
 }

 // Agregar un controlador de eventos al botón "Crear jugador"
 document.querySelector('#create-button').addEventListener('click', createJugador);
 
 // Función para editar un jugador al hacer clic en su imagen
 function editJugador(jugador) {
  // Crear una ventana modal para editar los datos del jugador
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <div class="jugador-info">                
        <img class="jugador-image" src="img/${jugador.imagen}" alt="" />        
      </div>        
      <form class="form_input">
        <div class="form-row">
          <label>ID:</label> 
          <input type="number" name="id" value="${jugador.id}" readonly />
        </div>  
        <div class="form-row">  
          <label>DNI:</label> 
          <input type="text" name="dni" value="${jugador.dni}" maxlength="<EUGPSCoordinates>8" />
        </div>           
        <div class="form-row">  
          <label>Nombre:</label>   
          <input type="text" name="nombre"   id="nombreInput" value="${jugador.nombre}" />
        </div>   
        <div class="form-row">    
          <label>Apellido:</label>
          <input type="text" name="apellido" id="apellidoInput" value="${jugador.apellido}" />
        </div>
        
        <div class="form-row">  
         <label>Posición:</label><br/>
          <select name="posicion">
            <option value="Arquero" ${jugador.posicion === 'Arquero' ? 'selected' : ''}>Arquero</option>
            <option value="Defensa" ${jugador.posicion === 'Defensa' ? 'selected' : ''}>Defensa</option>
            <option value="Mediocampo" ${jugador.posicion === 'Mediocampo' ? 'selected' : ''}>Mediocampo</option>
            <option value="Delantero" ${jugador.posicion === 'Delantero' ? 'selected' : ''}>Delantero</option>
          </select>
        </div> 
        <div class="form-row">   
            <label>Dorsal:</label> 
            <input type="number" name="dorsal" min="1" max="99" value="${jugador.dorsal}" />
        </div> 

        <div class="form-row">   
         <label>Pie hábil:</label><br/>
         <label><input type="radio" name="piehabil" value="Izquierdo" ${jugador.piehabil === 'Izquierdo' ? 'checked' : ''} /> Izquierdo</label>
         <label><input type="radio" name="piehabil" value="Derecho" ${jugador.piehabil === 'Derecho' ? 'checked' : ''} /> Derecho</label>
        </div> 
        <div class="form-row">  
            <label>Apodo:</label>
            <input type="text" name="apodo" value="${jugador.apodo}" /></label><br/>        
        </div> 
        <div class="form-row">   
            <label>Imagen:</label>
            <input type="text" name="imagen" value="${jugador.imagen}" />
        </div> 
        <div class="form-row">   
            <button type="submit">Guardar cambios</button>
            <button type="button" id="delete-button">Eliminar jugador</button>
        </div> 
        </form>
      </div>  
    </div>
  `;
  // Obtener los elementos de los campos de nombre y apellido
  const nombreInput = modal.querySelector('#nombreInput');
  const apellidoInput = modal.querySelector('#apellidoInput');

  // Agregar el evento input a los campos de nombre y apellido
  nombreInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });

  apellidoInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedJugador = Object.fromEntries(formData.entries());    
    saveJugador(jugador, updatedJugador);
    closeModal(modal);
  });
  modal.querySelector('#delete-button').addEventListener('click', () => {
    deletejugador(jugador);
    closeModal(modal);
  });
  modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
  document.body.appendChild(modal);
 }

// Función para cerrar la ventana modal
function closeModal(modal) {
  modal.remove();
}

// Función para guardar los cambios en un jugador
function saveJugador(jugador, updatedJugador) {
  // Actualizar el jugador en la memoria local
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  const jugadorIndex = jugadores.findIndex(p => p.nombre === jugador.nombre && p.apellido === jugador.apellido);
  jugadores[jugadorIndex] = updatedJugador;
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
  displayJugadores(jugadores);
}

// Función para eliminar un jugador
function deletejugador(jugador) {
  // Eliminar el jugador de la memoria local
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  const jugadorIndex = jugadores.findIndex(p => p.nombre === jugador.nombre && p.apellido === jugador.apellido);
  jugadores.splice(jugadorIndex, 1);
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
  displayJugadores(jugadores);
}

function saveChanges() {
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  
  const jsonData = JSON.stringify(jugadores ,null,4)
  
  // Guardar los cambios en la memoria local
  localStorage.setItem('jugadores', jsonData);
  
  // Descargar el archivo players.json
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jugadores.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Agregar evento de clic al botón de salida
 document.querySelector('#exit-button').addEventListener('click', () => {
   console.log('Botón de salida y guardar cambios presionado');
   if (confirm('¿Estás seguro de que quieres salir y guardar los cambios?')) {
     saveChanges();
     //savePlayersToJSON
     window.location.href = 'index.html';
   }
 });

// Agregar evento de clic al botón de arrepentimiento
document.querySelector('#cancel-button').addEventListener('click', () => {
  console.log('Botón de salir sin guardar cambios presionado');
  if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
    localStorage.setItem('jugadores', initialData); // Restaurar el estado inicial
    window.location.href = 'index.html';
  }
});

function validateForm(formData) {
  const posicion = formData.get('posicion').toLowerCase();
  const dorsal = formData.get('dorsal');
  const piehabil = formData.get('piehabil').toLowerCase();
   const posicionesValidas = ['arquero', 'defensor', 'mediocampista', 'delantero'];
  const piehabilValido = ['izquierdo', 'derecho'];
   if (!posicionesValidas.includes(posicion)) {
    alert('La posición ingresada no es válida. Debe ser arquero, defensor, mediocampista o delantero.');
    return false;
  }
   if (dorsal < 1 || dorsal > 99) {
    alert('El dorsal ingresado no es válido. Debe ser un número entre 1 y 99.');
    return false;
  }
   if (!piehabilValido.includes(piehabil)) {
    alert('El pie hábil ingresado no es válido. Debe ser izquierdo o derecho.');
    return false;
  }
   return true;
}
