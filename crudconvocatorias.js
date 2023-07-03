// Leer el archivo convocatorias.json usando fetch y almacenarlo en la memoria local
fetch('data/convocatorias.json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('convocatorias', JSON.stringify(data));
    displayconvocatorias(data);
  });

// Función para mostrar las convocatorias de la tabla
function displayconvocatorias(convocatorias) {
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';
  convocatorias.forEach(convocatoria => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${convocatoria.id}</td>
      <td>${convocatoria.fecha}</td>
      <td>${convocatoria.rival}</td>
      <td>${convocatoria.capitan}</td>     
      <td><button class="edit-button">Editar</button></td>          
      <td><button class="conv-button">Convocar</button></td>          
    `;
    row.querySelector('.edit-button').addEventListener('click', () => editconvocatoria(convocatoria));
    row.querySelector('.conv-button').addEventListener('click', () => convocajugadores(convocatoria));
    tableBody.appendChild(row);
  });
 }

 function createConvocatoria() {
  // Calculate the next available ID
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  const nextId = Math.max(...convocatorias.map(convocatoria => convocatoria.id)) + 1;
  // Create a modal window to enter the new convocatoria's data
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <form class="form_input">
        <label>ID: <input type="number" name="id" value="${nextId}" readonly /></label><br/>
        <label>Fecha: <input type="date" name="fecha" /></label><br/>
        <label>Rival: <input type="text" name="rival" /></label><br/>
        <label>Capitan: <input type="text" name="capitan" /></label><br/>        
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  `;
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newconvocatoria = Object.fromEntries(formData.entries());
    addconvocatoria(newconvocatoria)
  });
  modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
  document.body.appendChild(modal);
}

 // Función para agregar un nueva convocatoria
 function addconvocatoria(newconvocatoria) {
  // Agregar nueva convocatoria a la memoria local
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  convocatorias.push(newconvocatoria);
  localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
  displayconvocatorias(convocatorias);
 }

 // Agregar un controlador de eventos al botón "Crear convocatoria"
 document.querySelector('#create-button').addEventListener('click', createConvocatoria);

 // Función para editar un jugador al hacer clic en su imagen
 function editconvocatoria(convocatoria) {
  // Crear una ventana modal para editar los datos del jugador
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">×</span>
      <div class="convocatoria-info">                
        
        <form class="form_input">
          <label>ID: <input type="number" name="id" value="${convocatoria.id}" readonly /></label><br/>
          <label>Fecha: <input type="date" name="fecha" value="${convocatoria.fecha}" pattern="\d{2}-\d{2}-\d{4}" /></label><br/>
          <label>Rival: <input type="text" name="rival" value="${convocatoria.rival}" /></label><br/>
          <label>Capitan: <input type="text" name="capitan" value="${convocatoria.capitan}" /></label><br/>          
          <button type="submit">Guardar cambios</button>
          <button type="button" id="delete-button">Eliminar Convocatoria</button>
        </form>
      </div>  
    </div>
  `;
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedconvocatoria = Object.fromEntries(formData.entries());    
    saveconvocatoria(convocatoria, updatedconvocatoria);
    closeModal(modal);
  });
  modal.querySelector('#delete-button').addEventListener('click', () => {
    deleteconvocatoria(convocatoria);
    closeModal(modal);
  });
  modal.querySelector('.close-button').addEventListener('click', () => closeModal(modal));
  document.body.appendChild(modal);
 }

// Función para cerrar la ventana modal
function closeModal(modal) {
  modal.remove();
}

// Función para guardar los cambios 
function saveconvocatoria(convocatoria, updatedconvocatoria) {
  // Actualizar convocatoria en la memoria local
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  const convocatoriaIndex = convocatorias.findIndex(p => p.fecha === convocatoria.fecha && p.rival === convocatoria.rival);
  convocatorias[convocatoriaIndex] = updatedconvocatoria;
  localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
  displayconvocatorias(convocatorias);
}

// Función para eliminar un jugador
function deleteconvocatoria(convocatoria) {
  // Eliminar el jugador de la memoria local
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  const convocatoriaIndex = convocatorias.findIndex(p => p.fecha === convocatoria.fecha && p.rival === convocatoria.rival);
  convocatorias.splice(convocatoriaIndex, 1);
  localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
  displayconvocatorias(convocatorias);
}

// Función para guardar los cambios en la memoria local y en el archivo externo
function saveChanges() {
  const data = localStorage.getItem('convocatorias');
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'convocatorias.json';
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

function convocajugadores(convocatoria) {
  // Convertir el arreglo en una cadena JSON
  var datosJSON = JSON.stringify(convocatoria);

  // Codificar la cadena JSON para que pueda ser utilizada en la URL
  var datosCodificados = encodeURIComponent(datosJSON);

  // Construir la URL con el parámetro de consulta
  var url = 'cJugadores.html?datos=' + datosCodificados;

  // Redirigir a la página HTML con la URL generada
  window.location.href = url;
}



