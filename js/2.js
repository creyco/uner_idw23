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
    const selectedFormation = formations.find(formation => formation.id === parseInt(event.target.value));
    const details = `Arquero: ${selectedFormation.Arquero}, Defensa: ${selectedFormation.Defensor}, Mediocampo: ${selectedFormation.Mediocampo}, Delantero: ${selectedFormation.Delantero}`;
    document.querySelector('#formationDetails').textContent = details;
  });
});


// Leer archivo JSON y almacenar su contenido en localStorage
fetch("data/jugadores.json")
    .then((response) => response.json())
    .then((data) => {
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


  // Función para mostrar jugadores
  function showPlayers() {
    // Limpiar contenedor de jugadores
    container.innerHTML = "";

    // Obtener datos de los jugadores
    const players = JSON.parse(localStorage.getItem("players"));

    // Filtrar jugadores si se está mostrando solo titulares
    const filteredPlayers = showingOnlyTitulars
      ? players.filter((player) => player.titular)
      : players;

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

      // Crear título de posición
      const positionTitle = document.createElement("h2");
      positionTitle.textContent = position + ": hola";
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

        const playerButton = document.createElement("button");
        playerButton.textContent = player.titular ? "Titular" : "Suplente";
        playerEl.appendChild(playerButton);

        // Agregar evento click al botón de titular
        playerButton.addEventListener("click", () => {
          // Cambiar estado de titular del jugador
          player.titular = !player.titular;

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

// Agregar evento click al botón de filtrado
filterButton.addEventListener("click", () => {
  // Cambiar estado de mostrar solo titulares
  showingOnlyTitulars = !showingOnlyTitulars;

  // Cambiar texto del botón de filtrado
  filterButton.textContent = showingOnlyTitulars ? "All Players" : "Titulares";

  // Mostrar jugadores
  showPlayers();
});
