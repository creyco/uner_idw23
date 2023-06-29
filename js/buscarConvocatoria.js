// MENÚ DE NAVEGACIÓN******************************************************************************
document.getElementById('nueva-conv').addEventListener('click', crearConvocatoria);

function crearConvocatoria() {
  window.location.href = 'crearconvocatoria.html';
};

document.getElementById('lista-conv').addEventListener('click', listaConvocatoria);

function listaConvocatoria() {
  window.location.href = 'listaconvocatorias.html';
};

document.getElementById('busqueda-conv').addEventListener('click', busquedaConvocatoria);

function busquedaConvocatoria() {
  window.location.href = 'busquedaconvocatorias.html';
};




/**BUSCAR INFO************************************************************* */


document.getElementById('buscar-rango').addEventListener('click', rangoBusquedaConvocatoria);


// Busca  di hay informacion alojada en el  localStorange

function rangoBusquedaConvocatoria() {
  // utili esta funcion para cargar datos del json  si no hay en el local
  leerConv();
  //creo cont. body en donde se cargaran los datos recopilados del local o JSON

  const body = document.getElementById('tbody');
  // creo una const. convocatorias. busca la clave o ide en el local y  me devuelve en formato estring 
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  //para poder usarlo lo convierto a objeto
 // Creo  las constantes inicio y fin de fechas usando id  que me traen el elemento ingresado por el usuario 
  const inicioFecha = document.getElementById('fechaconvinicio').value;

  const finFecha = document.getElementById('fechaconvfin').value;
// me fijo  si las fechas ingresadas son correctas y para poder compararlos creo con esos datos un objeto de tipo DATE que se utiliza con las fechas
  
if(new Date(inicioFecha)>= new Date(finFecha)){
    return alert('las fechas ingresadas son incorrectas')
  };
  // si son correctas busco las convocatorias utilizando el metrodo filter que pueden estar entre ese rango de fechas y vuelvo a usar el mismo metrodo de crear obj tipo DATE.para poder compararlos
  
  const resultadoconv = convocatorias.filter((conv) => {
    if (new Date(conv.fecha) >= new Date(inicioFecha) && new Date(conv.fecha) <= new Date(finFecha)) {
      return conv 
    } else{
       return alert('no hay convocatorias en esas fechas')
    }
  } 
  );
// me filtra las convocatorias que cumplen  con esos requisitos 
// completo la tabla  con los datos obtenidos del filtro
  if (resultadoconv.length !== null) {
    resultadoconv.forEach(element => {


      const tr = document.createElement('tr');

      const id = document.createElement('td');
      const fecha = document.createElement('td');
      const rival = document.createElement('td');
      const capitan = document.createElement('td');
      const convocar = document.createElement('td');

      id.appendChild(document.createTextNode(element.id));
      fecha.appendChild(document.createTextNode(element.fecha));
      rival.appendChild(document.createTextNode(element.rival));
      capitan.appendChild(document.createTextNode(element.capitan));
      
      // Además agrego los botones editar eliminar y convocar jugadores para una convocatoria. 
      // que me agregan las acciones de las funciones utilizando id de distintas maneras dependiendo de la funcion y utilizando el atrib onclick (me lleva a ejecutar eda función)
      const boton = document.createElement('button');

      boton.setAttribute('id', element.id);
      boton.setAttribute('onclick', 'convocarJugadores(this)');
      boton.setAttribute('class', 'boton2bc');
      boton.appendChild(document.createTextNode('Convocar'));

      const editar = document.createElement('button');
      editar.setAttribute('id', element.id);
      editar.setAttribute('onclick', 'editarConvocatoria(this)');
      editar.setAttribute('class', 'boton2b');
      editar.appendChild(document.createTextNode('Editar'));

      const eliminar = document.createElement('button');
      eliminar.setAttribute('id', element.id);
      eliminar.setAttribute('onclick', 'eliminarConvocatoria(this)');
      eliminar.setAttribute('class', 'boton2b');
      eliminar.appendChild(document.createTextNode('Eliminar'));

     
      convocar.appendChild(eliminar);
      convocar.appendChild(editar);
      convocar.appendChild(boton);
      

      tr.appendChild(id);
      tr.appendChild(fecha);
      tr.appendChild(rival);
      tr.appendChild(capitan);
      tr.appendChild(convocar);

      body.appendChild(tr);

    });
  } else {
    alert('No se encuentra ninguna fecha')
  }
};
// elimina la convocatoria seleccionada utilizando su id. 
function eliminarConvocatoria(param) {
  let idEliminar = parseInt(param.getAttribute("id"));

  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));

  const nuevo = convocatorias.filter(function (item) {
    return item.id !== idEliminar;
  });
// me devuelve todos menos el que coincide con el id que es el que quiero eliminar
  localStorage.setItem('convocatorias', JSON.stringify(nuevo));
// borra la tabla
  this.borrarBodyTabla();
  //  actualiza la tabla
  this.buscarInfo();
  
};
// borra los elementos de la tabla
 function borrarBodyTabla() {
  const elemento = document.getElementById('tbody');
  while (elemento.firstChild) {
    elemento.firstChild.remove();
  }
};
// editar la convocatoria seleccionada utilizando su id. 
function editarConvocatoria(param){
  let idEditar = parseInt(param.getAttribute("id"));
// creo una llave o id  editame con el id de convocatoria
  localStorage.setItem('paraeditar',JSON.stringify(idEditar));
  // redirijo a la página para editarlo
  window.location.href = 'editarconvocatoria.html'

};

function convocarJugadores(param){
  let idConvocatoria = parseInt(param.getAttribute("id"));
  localStorage.setItem('convocatoria',JSON.stringify(idConvocatoria));
  window.location.href = 'listajugadoresconvocados.html'
};

function jugadoresConvocados(param) {
  const idConvocatoria = parseInt(param.getAttribute("id"));
  localStorage.setItem('convocatoria',JSON.stringify(idConvocatoria));
  window.location.href = 'jugadoresConvocados.html'
};

function leerConv() {
  const convocatoriasBus = JSON.parse(localStorage.getItem('convocatorias'));
  if (convocatoriasBus === null) {
    fetch('../json/convocatorias.json')
      .then((res) => {
        return res.json()
      })
      .then((data) => {

        localStorage.setItem('convocatorias', JSON.stringify(data));
      })
  }
}
function buscarInfo() {
  const body = document.getElementById('tbody');

  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));

  // sino encuentro nada en el localstorage
  // busco desde el archivo json 
  if (convocatorias === null) {
    fetch('../json/convocatorias.json')
      .then((res) => {
        return res.json()
      })
      //devuelve info json
      .then((data) => {
        // repara el localstorage
        localStorage.setItem('convocatorias', JSON.stringify(data));

        // completo la tabla  con los datos obtenidos del json

        data.forEach(element => {
          const tr = document.createElement('tr');

          const id = document.createElement('td');
          const fecha = document.createElement('td');
          const rival = document.createElement('td');
          const capitan = document.createElement('td');
          const convocar = document.createElement('td');

          id.appendChild(document.createTextNode(element.id));
          fecha.appendChild(document.createTextNode(element.fecha));
          rival.appendChild(document.createTextNode(element.rival));
          capitan.appendChild(document.createTextNode(element.capitan));
      // Además agrego los botones editar eliminar y convocar jugadores para una convocatoria. 
      // que me agregan las acciones de las funciones utilizando id de distintas maneras dependiendo de la funcion y utilizando el atrib onclick (me lleva a ejecutar eda función)
          const boton = document.createElement('button');
          boton.setAttribute('id', element.id);
          boton.setAttribute('onclick', 'convocarJugadores(this)');
          boton.setAttribute('class', 'boton2bc');
          boton.appendChild(document.createTextNode('Convocar'));
          
          const editar = document.createElement('button');
          editar.setAttribute('id', element.id);
          editar.setAttribute('onclick', 'editarConvocatoria(this)');
          editar.setAttribute('class', 'boton2b');
          editar.appendChild(document.createTextNode('Editar'));

          const eliminar = document.createElement('button');
          eliminar.setAttribute('id', element.id);
          eliminar.setAttribute('onclick', 'eliminarConvocatoria(this)');
          eliminar.setAttribute('class', 'boton2b');
          eliminar.appendChild(document.createTextNode('Eliminar'));

          convocar.appendChild(eliminar);
          convocar.appendChild(editar);
          convocar.appendChild(boton);


          tr.appendChild(id);
          tr.appendChild(fecha);
          tr.appendChild(rival);
          tr.appendChild(capitan);
          tr.appendChild(convocar);

          body.appendChild(tr);
        });
      })
  }
  else {
    
    convocatorias.forEach(element => {
      const tr = document.createElement('tr');

      const id = document.createElement('td');
      const fecha = document.createElement('td');
      const rival = document.createElement('td');
      const capitan = document.createElement('td');
      const convocar = document.createElement('td');

      id.appendChild(document.createTextNode(element.id));
      fecha.appendChild(document.createTextNode(element.fecha));
      rival.appendChild(document.createTextNode(element.rival));
      capitan.appendChild(document.createTextNode(element.capitan));

      const boton = document.createElement('button');
              
      boton.setAttribute('id', element.id);
      boton.setAttribute('onclick', 'convocarJugadores(this)');
      boton.setAttribute('class', 'boton2bc');
      boton.appendChild(document.createTextNode('Convocar'));

      const editar = document.createElement('button');
      editar.setAttribute('id', element.id);
      editar.setAttribute('onclick', 'editarConvocatoria(this)');
      editar.setAttribute('class', 'boton2b');
      editar.appendChild(document.createTextNode('Editar'));

      const eliminar = document.createElement('button');
      eliminar.setAttribute('id', element.id);
      eliminar.setAttribute('onclick', 'eliminarConvocatoria(this)');
      eliminar.setAttribute('class', 'boton2b');
      eliminar.appendChild(document.createTextNode('Eliminar'));

      

      convocar.appendChild(eliminar);
      convocar.appendChild(editar);
      convocar.appendChild(boton);
     
      tr.appendChild(id);
      tr.appendChild(fecha);
      tr.appendChild(rival);
      tr.appendChild(capitan);
      tr.appendChild(convocar);

      body.appendChild(tr);
    });
  }
}