//agregados de convocatoria

document.addEventListener("DOMContentLoaded", function() {
  // Leer el archivo JSON y generar opciones en el select
  fetch('db/convocatorias.json')
    .then(response => response.json())
    .then(data => {
      // Obtener el botón select
      var select = document.getElementById("match-select");

      // Eliminar las opciones existentes del botón select
      select.innerHTML = "";

      // Iterar sobre los datos y crear las opciones del botón select
      for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.text = data[i].fecha + " vs " + data[i].rival + " (captained by " + data[i].capitan + ")";
        option.value = data[i].id;
        select.appendChild(option);
      }
    });

  // Obtener el elemento botón por su ID
  var abrirVentanaBtn = document.getElementById("abrirVentanaBtn");

  // Escuchar el evento click del botón
  abrirVentanaBtn.addEventListener("click", function() {
    var selectedOption = document.getElementById("match-select").options[document.getElementById("match-select").selectedIndex];
    var partidoTitulo = selectedOption.text;

    // Abrir la ventana emergente con el título del partido seleccionado
    var popupWindow = window.open('', 'popupWindow', 'width=400,height=300');
    popupWindow.document.write('<html><head><title>' + partidoTitulo + '</title></head><body>');
    popupWindow.document.write('<h1>' + partidoTitulo + '</h1>');
    popupWindow.document.write('<button id="continuarBtn">Continuar</button>');
    popupWindow.document.write('<button id="cancelarBtn">Cancelar</button>');
    popupWindow.document.write('</body></html>');

    // Escuchar los eventos click de los botones en la ventana emergente...
    popupWindow.document.getElementById("continuarBtn").addEventListener("click", function() {
      // Lógica para el botón continuar
      popupWindow.close();
      // Aquí puedes agregar tu lógica adicional al hacer clic en continuar
    });

    popupWindow.document.getElementById("cancelarBtn").addEventListener("click", function() {
      // Lógica para el botón cancelar
      popupWindow.close();
      // Aquí puedes agregar tu lógica adicional al hacer clic en cancelar
    });
  });
});






// Leer el archivo players.json usando fetch y almacenarlo en la memoria local
fetch('./db/jugadores.json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('players', JSON.stringify(data));
    displayPlayers(data);
  });

// Función para mostrar los jugadores en la tabla
function displayPlayers(players) {
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';
  players.forEach(player => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${player.id}</td>
      <td>${player.dni}</td>
      <td>${player.nombre}</td>
      <td>${player.apellido}</td>
      <td>${player.posicion}</td>
      <td>${player.dorsal}</td>
      <td>${player.pieHabil}</td>
      <td>${player.apodo}</td>      
      <td><img src="./img/jugadores/${player.imagen}" alt="${player.nombre} ${player.apellido}" /></td>
      
    `;
    row.querySelector('img').addEventListener('click', () => editPlayer(player));
    
    //row.querySelector('.edit-button').addEventListener('click', () => editPlayer(player));
    tableBody.appendChild(row);
  });
 }

 function createPlayer() {
  // Calculate the next available ID
  const players = JSON.parse(localStorage.getItem('players'));
  const nextId = Math.max(...players.map(player => player.id)) + 1;
  // Create a modal window to enter the new player's data
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <form class="form_input">
        <label>ID: <input type="number" name="id" value="${nextId}" readonly /></label><br/>
        <label>DNI: <input type="text" name="dni" maxlength="8" /></label><br/>
        <label>Nombre: <input type="text" name="nombre" /></label><br/>
        <label>Apellido: <input type="text" name="apellido" /></label><br/>
        <label>Posición: <input type="text" name="posicion" /></label><br/>
        <label>Dorsal: <input type="number" name="dorsal" /></label><br/>
        <label>Pie hábil: <input type="text" name="pieHabil" /></label><br/>
        <label>Apodo: <input type="text" name="apodo" /></label><br/>        
        <label>Foto: <input type="file" name="imagen" accept="image/*" /></label><br/><br>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  `;
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPlayer = Object.fromEntries(formData.entries());
    const imageFile = formData.get('imagen');
    if (imageFile) {
      // Upload the image to the server
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/upload/image`, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          // The image was uploaded successfully
          newPlayer.imagen = xhr.responseText;
          addPlayer(newPlayer);
          closeModal(modal);
        } else {
          // There was an error uploading the image
          console.error('Error uploading image:', xhr.status);
        }
      };
      xhr.send(formData);
    } else {
      // The user did not select an image
      console.error('No image selected');
    }
  });
  modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
  document.body.appendChild(modal);
}


 // Función para agregar un nuevo jugador
 function addPlayer(newPlayer) {
  // Agregar el nuevo jugador a la memoria local
  const players = JSON.parse(localStorage.getItem('players'));
  players.push(newPlayer);
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayers(players);
 }

 // Agregar un controlador de eventos al botón "Crear jugador"
 document.querySelector('#create-button').addEventListener('click', createPlayer);

 // Función para editar un jugador al hacer clic en su imagen
 function editPlayer(player) {
  // Crear una ventana modal para editar los datos del jugador
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <div class="player-info">                
        <img class="player-image" src="./img/jugadores/${player.imagen}" alt="Imagen del jugador" />        
        <form class="form_input">
          <label>ID: <input type="number" name="id" value="${player.id}" readonly /></label><br/>
          <label>DNI: <input type="text" name="dni" value="${player.dni}" maxlength="<EUGPSCoordinates>8" /></label><br/>
          <label>Nombre: <input type="text" name="nombre" value="${player.nombre}" /></label><br/>
          <label>Apellido: <input type="text" name="apellido" value="${player.apellido}" /></label><br/>
          <label>Posición: <input type="text" name="posicion" value="${player.posicion}" /></label><br/>
          <label>Dorsal: <input type="number" name="dorsal" value="${player.dorsal}" /></label><br/>
          <label>Pie hábil: <input type="text" name="pieHabil" value="${player.pieHabil}" /></label><br/>
          <label>Apodo: <input type="text" name="apodo" value="${player.apodo}" /></label><br/>        
          <label>Imagen: <input type="text" name="imagen" value="${player.imagen}" /></label><br/><br>          
          <button type="submit">Guardar cambios</button>
          <button type="button" id="delete-button">Eliminar jugador</button>
        </form>
      </div>  
    </div>
  `;
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedPlayer = Object.fromEntries(formData.entries());    
    savePlayer(player, updatedPlayer);
    closeModal(modal);
  });
  modal.querySelector('#delete-button').addEventListener('click', () => {
    deletePlayer(player);
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
function savePlayer(player, updatedPlayer) {
  // Actualizar el jugador en la memoria local
  const players = JSON.parse(localStorage.getItem('players'));
  const playerIndex = players.findIndex(p => p.nombre === player.nombre && p.apellido === player.apellido);
  players[playerIndex] = updatedPlayer;
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayers(players);
}

// Función para eliminar un jugador
function deletePlayer(player) {
  // Eliminar el jugador de la memoria local
  const players = JSON.parse(localStorage.getItem('players'));
  const playerIndex = players.findIndex(p => p.nombre === player.nombre && p.apellido === player.apellido);
  players.splice(playerIndex, 1);
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayers(players);
}

// Función para guardar los cambios en la memoria local y en el archivo externo
function saveChanges() {
  const data = localStorage.getItem('players');
  const blob = new Blob([data], {type: 'application/json'});
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
    window.close();
  }
});

// Agregar evento de clic al botón de arrepentimiento
document.querySelector('#cancel-button').addEventListener('click', () => {
  console.log('Botón de salir sin guardar cambios presionado');
  if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
    window.close();
  }
});
