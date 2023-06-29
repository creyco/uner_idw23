/*********************************CONVOCATORIAS**************************************************/


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


/*************************LISTA DE CONVOCATORIAS ***********************************/
window.addEventListener("load", function () {
  buscarInfo();
});

// Busca  di hay informacion alojada en el  localStorange
function buscarInfo() {
  //creo cont. body en donde se cargaran los datos recopilados del local o JSON
  const body = document.getElementById('tbody'); 
  // creo una const. convocatorias. busca la clave o ide en el local y  me devuelve en formato estring 
  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
  //para poder usarlo lo convierto a objeto
  // sino no encuentra nada en el localstorage
  // busco desde el archivo en formato json
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
      // que me agregan las acciones de las funciones utilizando id de distintas maneras dependiendo de la funcion y utilizando el atrib onclick (me lleva a ejecutar eda función)          const boton = document.createElement('button');
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

function eliminarConvocatoria(param) {
  let idEliminar = parseInt(param.getAttribute("id"));

  const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));

  const nuevo = convocatorias.filter(function (item) {
    return item.id !== idEliminar;
  });

  localStorage.setItem('convocatorias', JSON.stringify(nuevo));

  this.borrarBodyTabla();
  this.buscarInfo();
  
}

 function borrarBodyTabla() {
  const elemento = document.getElementById('tbody');
  while (elemento.firstChild) {
    elemento.firstChild.remove();
  }
}
function editarConvocatoria(param){
  let idEditar = parseInt(param.getAttribute("id"));
  localStorage.setItem('paraeditar',JSON.stringify(idEditar));
  window.location.href = 'editarconvocatoria.html'
}
function convocarJugadores(param){
  let idConvocatoria = parseInt(param.getAttribute("id"));
  localStorage.setItem('convocatoria',JSON.stringify(idConvocatoria));
  window.location.href = 'listajugadoresconvocados.html'
}
