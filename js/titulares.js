// Load the formations from the JSON file
fetch('data/formacion.json')
  .then(response => response.json())
  .then(formations => {
    // Populate the selector with the formations
    const selector = document.querySelector('#formations');
    formations.forEach(formation => {
      const option = document.createElement('option');
      option.value = formation.id;
      option.textContent = formation.formacion;
      selector.appendChild(option);
    });

    // Add an event listener to display the formation details when selected
    selector.addEventListener('change', event => {
      selectedFormation = formations.find(formation => formation.id === parseInt(event.target.value));
      const details = `Arquero: ${selectedFormation.Arquero}, Defensa: ${selectedFormation.Defensor}, Mediocampo: ${selectedFormation.Mediocampo}, Delantero: ${selectedFormation.Delantero}`;
      document.querySelector('#formationDetails').textContent = details;

      // Mostrar jugadores con la formación seleccionada
      showPlayers();
    });
  });

// Leer archivo JSON y almacenar su contenido en localStorage
fetch("data/jugadoresconvocados.json")
  .then((response) => response.json())
  .then((data) => {
    const first26Records = data.slice(0, 26);
    //localStorage.setItem("players", JSON.stringify(data));
    localStorage.setItem("players", JSON.stringify(first26Records));

    // Mostrar jugadores
    showPlayers();
  });

// Obtener el contenedor de jugadores
const container = document.querySelector(".container");

// Obtener el botón de filtrado
const filterButton = document.querySelector("#filter-button");

// Variable para almacenar si se está mostrando solo titulares o no
let showingOnlyTitulars = false;

// Variable para almacenar la formación seleccionada
let selectedFormation = null;

// Obtener el botón de guardar
const guardarButton = document.querySelector("#guardar-button");

// Función para mostrar jugadores
function showPlayers() {
  // Limpiar contenedor de jugadores
  container.innerHTML = "";

  // Obtener datos de los jugadores
  const players = JSON.parse(localStorage.getItem("players"));

  // Filtrar jugadores si se está mostrando solo titulares
  const filteredPlayers = showingOnlyTitulars ? players.filter((player) => player.titular) : players;

  // Agrupar jugadores por posición
  const playersByPosition = filteredPlayers.reduce((acc, player) => {
    if (!acc[player.posicion]) acc[player.posicion] = [];
    acc[player.posicion].push(player);
    return acc;
  }, {});

  // Mostrar jugadores agrupados por posición
  for (const position in playersByPosition) {
    // Crear contenedor de posición
    const positionContainer = document.createElement("div");
    positionContainer.classList.add("position-container");

    
    // Crear título de posición con la cantidad de jugadores titularizados
    const positionTitle = document.createElement("h2");
    const nroTitulares = filteredPlayers.filter((player) => player.titular && player.posicion === position).length;
    const maxPlayers = selectedFormation && selectedFormation[position];
    //positionTitle.textContent = `${position} (${nroTitulares} de ${maxPlayers})`;
    positionTitle.textContent = `${position}: ${getPlayerCountByPosition(position)}`;
    positionContainer.appendChild(positionTitle);
   
    // Crear contenedor de jugadores para esta posición
    const positionPlayersContainer = document.createElement("div");
    positionPlayersContainer.classList.add("container");
    positionContainer.appendChild(positionPlayersContainer);

    // Mostrar jugadores de esta posición
    for (const player of playersByPosition[position]) {
      // Crear elemento de jugador
      const playerEl = document.createElement("div");
      playerEl.classList.add("player");

      // Crear imagen del jugador
      const playerImg = document.createElement("img");
      playerImg.src = `img/${player.foto}`;
      playerEl.appendChild(playerImg);

      // Crear nombre del jugador
      const playerName = document.createElement("h3");
      playerName.textContent = `${player.nombre} ${player.apellido}`;
      playerEl.appendChild(playerName);

      // Crear botón de titular/suplente
      const playerButton = document.createElement("button");
      playerButton.textContent = player.titular ? "Titular" : "Suplente";
      playerEl.appendChild(playerButton);

      if (player.titular && selectedFormation) {
        if (!selectedFormation.hasOwnProperty(player.posicion + "_actual")) {
          selectedFormation[player.posicion + "_actual"] = 0
        }

        selectedFormation[player.posicion + "_actual"] += 1
      }

    // AL dar click en el boton de cada jugador, para hacerlo/sacarlo de titular
      // Agregar evento click al botón de titular
      playerButton.addEventListener("click", () => {
        // Verificar si el jugador es titular o suplente actualmente
        
        if (player.titular) {
          // Cambiar a suplente
          player.titular = false;
          selectedFormation[player.posicion + "_actual"] -= 1;
        } else {
          // Verificar si se excede la cantidad máxima de jugadores para esa posición
          const maxPlayers = selectedFormation && selectedFormation[player.posicion];
            
          //cuantos jugadores titulares hay en esa posicion
          const currentPlayers = filteredPlayers.filter(p => p.posicion === player.posicion && p.titular).length;
                
          console.log(maxPlayers)
          console.log(selectedFormation)
          console.log(selectedFormation[player.posicion])
          console.log(currentPlayers);

          if (!player.titular && currentPlayers >= maxPlayers) {
            alert(`No se pueden seleccionar más jugadores titulares para la posición ${position}`);
            return;
          }

          // Cambiar a titular y sumar a la cantidad de jugadores para esa posición
          player.titular = true;
          selectedFormation[player.posicion + "_actual"] += 1;
        }

        // Actualizar datos de los jugadores en localStorage
        localStorage.setItem("players", JSON.stringify(players));

        // Cambiar texto del botón de titular/suplente
        playerButton.textContent = player.titular ? "Titular" : "Suplente";
      });

      // Agregar jugador al contenedor de jugadores de esta posición
      positionPlayersContainer.appendChild(playerEl);
    }

    // Agregar contenedor de posición al contenedor principal
    container.appendChild(positionContainer);
  }
}
// Función para obtener el número de jugadores por posición
function getPlayerCountByPosition(position) {
  if (selectedFormation && selectedFormation[position]) {
    return selectedFormation[position];
  }
  return 0;
}
// Agregar evento click al botón de filtrado
filterButton.addEventListener("click", () => {
  // Cambiar estado de mostrar solo titulares
  showingOnlyTitulars = !showingOnlyTitulars;

  // Cambiar texto del botón de filtrado
  filterButton.textContent = showingOnlyTitulars ? "Todos los jugadores" : "Titulares";

  // Mostrar jugadores
  showPlayers();
});

// Función para obtener el número de jugadores por posición
function nroPlayersXPosicion(position) {
  if (selectedFormation && selectedFormation[position]) {
    return selectedFormation[position];
  }
  return 0;
}

//****************************************************************** */
// Agregar evento click al botón de guardar
guardarButton.addEventListener("click", () => {
  
  // Obtener los jugadores titulares
  const jugadoresTitulares = JSON.parse(localStorage.getItem("players")).filter(player => player.titular);

  // Generar el contenido de la vista previa
  const vistaPreviaContent = generateVistaPreviaContent(jugadoresTitulares);
  console.log()
  // Crear la ventana modal
  const modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  modalContainer.classList.add("modal-container");

  // Crear el contenido de la ventana modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");



  // Agregar el contenido de la vista previa a la ventana modal
  const vistaPreviaContentEl = document.createElement("div");
  vistaPreviaContentEl.id = "vista-previa-content";
  vistaPreviaContentEl.innerHTML = vistaPreviaContent;
  modalContent.appendChild(vistaPreviaContentEl);

  // Crear los botones de guardar y cancelar
  const guardarButton = document.createElement("button");
  guardarButton.textContent = "Guardar y salir";
  guardarButton.addEventListener("click", () => {
    // Guardar los datos en la memoria local
    guardarDatosTitulares(jugadoresTitulares);

    // Cerrar la ventana modal
    modalContainer.remove();
    // Redireccionar al index.html
    window.location.href = "convocatorias.html";

  });
  modalContent.appendChild(guardarButton);

  const cancelarButton = document.createElement("button");
  cancelarButton.textContent = "Cancelar";
  cancelarButton.addEventListener("click", () => {
    // Cerrar la ventana modal sin guardar los cambios
    modalContainer.remove();
  });
  modalContent.appendChild(cancelarButton);

  // Agregar el contenido de la ventana modal al contenedor
  modalContainer.appendChild(modalContent);

  // Agregar la ventana modal al cuerpo del documento
  document.body.appendChild(modalContainer);
});

function guardarDatosTitulares() {
  const nro_convocada = 1; // Número de convocatoria

  // Obtener los jugadores titulares
  const jugadoresTitulares = JSON.parse(localStorage.getItem("titulares")) || [];

  // Eliminar los registros existentes de la convocatoria actual
  const nuevosTitulares = jugadoresTitulares.filter((jugador) => jugador.id_convocada !== nro_convocada);

  // Obtener los jugadores seleccionados como titulares
  const jugadores = JSON.parse(localStorage.getItem("players"));
  const jugadoresSeleccionados = jugadores.filter((jugador) => jugador.titular);

  // Agregar los nuevos jugadores titulares a la lista
  nuevosTitulares.push(...jugadoresSeleccionados.map((jugador) => ({
    id_convocada: nro_convocada,
    id_jugador: jugador.id,
    posicion: jugador.posicion
  })));

  // Guardar los nuevos datos de los jugadores titulares
  localStorage.setItem("titulares", JSON.stringify(nuevosTitulares));

  // Mostrar mensaje de éxito o redireccionar a otra página
  alert("Los datos de los jugadores titulares se han guardado correctamente.");
}


// Función para generar el contenido de la vista previa
function generateVistaPreviaContent(jugadoresTitulares) {
  // Agregar título "Vista Previa" al contenido
  let contenidoHTML = "<h2>Vista Previa</h2>";

  // Enumerar los jugadores titulares
  jugadoresTitulares.forEach((player, index) => {
    contenidoHTML += `<p>${index + 1}. ${player.nombre} ${player.apellido} - ${player.posicion}</p>`;
  });

  // Retornar el contenido generado
  return contenidoHTML;
}

// Función para mostrar la ventana modal con la vista previa
function showVistaPreviaModal(content) {
  // Obtener el contenedor de la ventana modal
  const modalContainer = document.querySelector("#modal-container");

  // Actualizar el contenido de la ventana modal
  modalContainer.innerHTML = content;

  // Mostrar la ventana modal
  modalContainer.style.display = "block";
}

