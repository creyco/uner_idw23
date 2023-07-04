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
fetch("data/jugadores.json")
  .then((response) => response.json())
  .then((data) => {
    // Agregar el campo "convocado" a cada jugador
    data.forEach(jugador => {
      jugador.titular = false; // Puedes asignar el valor predeterminado que desees
      });
    localStorage.setItem("players", JSON.stringify(data));
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


    /////////////////////////////////////////////////////////Zona de problemas
    // Crear título de posición
    const positionTitle = document.createElement("h2");
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
      playerImg.src = `img/${player.imagen}`;
      playerEl.appendChild(playerImg);

      // Crear nombre del jugador
      const playerName = document.createElement("h3");
      playerName.textContent = `${player.nombre} ${player.apellido}`;
      playerEl.appendChild(playerName);

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
        // Guardar la posición original del jugador
        //const originalPosition = player.posicion;
  

        // Verificar si el jugador es titular o suplente actualmente
        if (player.titular) {
          // Cambiar a suplente y restar de la cantidad de jugadores para esa posición
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
            alert(`No se pueden seleccionar más jugadores titulares para la posición ${player.posicion}`);
            return;
          }
      
          // Cambiar a titular y sumar a la cantidad de jugadores para esa posición
          player.titular = true;
          selectedFormation[player.posicion + "_actual"] += 1;
        }
      
        // Actualizar datos de los jugadores en localStorage
        localStorage.setItem("players", JSON.stringify(players));
      
        // Cambiar texto del botón de titular
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
  filterButton.textContent = showingOnlyTitulars ? "All Players" : "Titulares";

  // Mostrar jugadores
  showPlayers();
});
