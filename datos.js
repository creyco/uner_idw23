// Global variables
const MAX_PLAYERS = 26;
const MAX_STARTING_PLAYERS = 11;
const GOALKEEPER_POSITION = "arquero";
const FORM_ID = "formulario";
const TABLE_ID = "tabla-jugadores";
const JSON_FILE = "jugadores.json";

// Array to hold the list of players
let players = [];

// Object to represent the starting lineup
let startingLineup = {
  players: [],
  goalkeeper: undefined,
  addPlayer: function(player) {
    if (this.players.length >= MAX_STARTING_PLAYERS) {
      alert(`Ya se han registrado los ${MAX_STARTING_PLAYERS} jugadores permitidos en el equipo titular.`);
    } else if (player.position === GOALKEEPER_POSITION && this.goalkeeper !== undefined) {
      alert("Ya se ha registrado un arquero en el equipo titular.");
    } else {
      this.players.push(player);
      if (player.position === GOALKEEPER_POSITION) {
        this.goalkeeper = player;
      }
    }
  }
};

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the form data
  const player = {
    document: document.getElementById("documento").value,
    lastName: document.getElementById("apellido").value,
    firstName: document.getElementById("nombre").value,
    position: document.getElementById("posicion").value,
    nickname: document.getElementById("apodo").value,
    number: document.getElementById("dorsal").value,
    foot: document.getElementById("pie").value,
    skill: document.getElementById("habilidad").value
  };

  // Validate the form data
  if (players.length >= MAX_PLAYERS) {
    alert(`Ya se han registrado los ${MAX_PLAYERS} jugadores permitidos.`);
  } else if (player.position === GOALKEEPER_POSITION && startingLineup.goalkeeper !== undefined) {
    alert("Ya se ha registrado un arquero en el equipo titular.");
  } else {
    // Add the player to the list of players
    players.push(player);
    alert("Jugador registrado con éxito.");

    // Add the player to the starting lineup if applicable
    if (player.position !== "suplente") {
      startingLineup.addPlayer(player);
    }

    // Update the table with the new player data
    updateTable(player);

    // Reset the form
    event.target.reset();

     // Save the updated list of players to the JSON file
     savePlayersToJson();
  }
}

// Function to update the table with a new player
function updateTable(player) {
  // Get the table element
  const table = document.getElementById(TABLE_ID);

  // Create a new row in the table
  const row = table.insertRow(-1);

  // Create cells for each property of the player object
  const cellDocument = row.insertCell(0);
  const cellLastName = row.insertCell(1);
  const cellFirstName = row.insertCell(2);
  const cellPosition = row.insertCell(3);
  const cellNickname = row.insertCell(4);
  const cellNumber = row.insertCell(5);
  const cellFoot = row.insertCell(6);

  // Set the innerHTML of each cell to the corresponding property value
  cellDocument.innerHTML = player.document;
  cellLastName.innerHTML = player.lastName;
  cellFirstName.innerHTML = player.firstName;
  cellPosition.innerHTML = player.position;
  cellNickname.innerHTML = player.nickname;
  cellNumber.innerHTML = player.number;
  cellFoot.innerHTML = player.foot;
}

// Function to load data from a JSON file and display it in the table
function loadData() {
  fetch(JSON_FILE)
    .then(response => response.json())
    .then(data => {
      // Parse the JSON data into an array of objects
      players = data;

      // Iterate over the array of objects and update the table for each one
      for (const player of players) {
        updateTable(player);
      }
    });
}

// Function to save data to the JSON file
function saveData() {
// Convert the players array to JSON format
const jsonData = JSON.stringify(players);

// Write the JSON data to the file
fs.writeFile(JSON_FILE, jsonData, (err) => {
if (err) {
console.error(err);
alert("Ha ocurrido un error al guardar los datos.");
} else {
alert("Los datos se han guardado correctamente.");
}
});
}


// Add event listener for form submission
document.getElementById(FORM_ID).addEventListener("submit", handleFormSubmit);

// Load data from JSON file when page loads
window.addEventListener("load", loadData);
