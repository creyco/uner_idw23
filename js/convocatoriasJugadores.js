
// MENÚ DE NAVEGACIÓN******************************************************************************
document.getElementById('nueva-conv').addEventListener('click', crearConvocatoria);

function crearConvocatoria() {
  window.location.href = 'crearconvocatoria.html'
}

document.getElementById('lista-conv').addEventListener('click', listaConvocatoria);

function listaConvocatoria() {
  window.location.href = 'listaconvocatorias.html'
}

document.getElementById('busqueda-conv').addEventListener('click', busquedaConvocatoria);

function busquedaConvocatoria() {
  window.location.href = 'busquedaconvocatorias.html'
}

// CONVOCAR JUGADORES******************************************************************************
window.addEventListener("load", function () {
    buscarInfoJugadores();
  });
  
  const convocar = document.getElementById('convocar');
  convocar.addEventListener('click', convocarJugadores);
  
  const cancelar = document.getElementById('cancelar-conv');
  cancelar.addEventListener('click', cancelarConvoctoria);
  
  function cancelarConvoctoria() {
    window.location.href = 'convocatorias.html';
  }
  
  function convocarJugadores(){

    const idConvocatoria = parseInt(localStorage.getItem('convocatoria'));

    // lista de checks de la tabla
    const checks = document.getElementsByClassName('checkbox');
    // para almacenar los convocados
    let convocados = [];

    // recorro la lista de checks de la tabla
    for(let i=0; i < checks.length; i++){
      if(checks[i].checked){
        const convocado = {
          'idJugador': parseInt(checks[i].getAttribute("id")),
          'idConvocarotia': idConvocatoria
        };
        
        convocados.push(convocado);
      }
    }

    // Busco las convocatoriasJugadores del localstorage
    const datosLocalStorage = JSON.parse(localStorage.getItem('convocatoriasJugadores'));
    
    if(datosLocalStorage === null){
      // como no hay convocatoriasJugadores repara
      localStorage.setItem('convocatoriasJugadores',JSON.stringify(convocados));  
    }else{
      // si tenengo convocatoriasJugadores las agraga

      // elimino (filtro utilizando el metodo filter)  los datos del localstorage (convocatoriasJuadores) del idconvocatoria que estan en convocatorias de jugadores 
      const filtro = datosLocalStorage.filter(item => item.idConvocarotia !== idConvocatoria);
      // agrego los nuevos convocados al localstorage
     

      if(filtro.length > 0){
        // a los nuevos jugadoresConvocatoria les agrego los que filtre (lo que tenia en el localstorage)
        convocados.push(...filtro);
      }

      

      // subo los datos al local
      localStorage.setItem('convocatoriasJugadores',JSON.stringify(convocados));  
    }

    // redirige a la página
    window.location.href = 'convocatorias.html';
  }
 // Es lo mismo que buscar info pero verifico el checkbox para ver si el gugador esta convocado y además de de utilizar en convocatoria, se agrega en convocarorias de jugadores
  function buscarInfoJugadores(){
    const idConvocatoria = parseInt(localStorage.getItem('convocatoria'));
    const datosLocalStorage = JSON.parse(localStorage.getItem('convocatoriasJugadores'));

    const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
    const convocatoria = convocatorias.find(item => item.id === idConvocatoria);
    // título de la convocatoria
    document.getElementById('titulo').
      appendChild(document.createTextNode(`Argentina vs ${convocatoria.rival} (${convocatoria.fecha})`))


    const body = document.getElementById('body');
     
    fetch('../json/jugadores.json')
    .then((res) => {
        return res.json()
    })
    .then((data) => {
      data.forEach(element => {
        const tr = document.createElement('tr');

        const id = document.createElement('td');
       
        const dni = document.createElement('td');
        const apellido = document.createElement('td');
        const nombre = document.createElement('td');
        const pieHabil = document.createElement('td');
        const convocar = document.createElement('td');

        id.appendChild(document.createTextNode(element.id));
        dni.appendChild(document.createTextNode(element.dni));
        apellido.appendChild(document.createTextNode(element.apellido));
        nombre.appendChild(document.createTextNode(element.nombre));
        pieHabil.appendChild(document.createTextNode(element.pieHabil));


        // checkbox
        const check = document.createElement('input');
        check.type = 'checkbox';
        // me va a servir para saber quien esta convocado
        check.id = element.id;
        
        // si hay datos de jugadores para la convocatoria
        if(datosLocalStorage !== null){                
          // me fijo si el jugador ya esta en la covocatoria 
          const yaEstaConvocado = datosLocalStorage.find(item => item.idJugador === element.id 
              && item.idConvocarotia === idConvocatoria);
          
          // si esta hago check 
          if(yaEstaConvocado){
            check.checked = true;
          }
        }

        check.classList.add('checkbox');
        // agrego el check al td  en el buscador de convocatoria no esta
        convocar.appendChild(check);

        tr.appendChild(id);
        tr.appendChild(dni);
        tr.appendChild(apellido);
        tr.appendChild(nombre);
        tr.appendChild(pieHabil);
        tr.appendChild(convocar);
        body.appendChild(tr);
        
      });
    })
    
  }


  