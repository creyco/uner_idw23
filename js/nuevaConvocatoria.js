
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
/*********************NUEVA CONVOCATORIA***********************************************/


document.getElementById('g-nuev-conv').addEventListener("click", crearNuevaConvocatoria);
document.getElementById('c-nuev-conv').addEventListener("click", cancelarConvoctoria);

function crearNuevaConvocatoria() {
  const jsonCovocatorias = localStorage.getItem('convocatorias');
  if (jsonCovocatorias !== null) {
    const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));

    maxId = convocatorias.reduce((max, obj) => obj.id > max ? obj.id : max, -Infinity);
    let i = 0;

    if (maxId !== -Infinity) {
      i = maxId + 1;
    }

    const convocatoria = {
      'id': i,
      'fecha': document.getElementById('texfechaconv').value,
      'rival': document.getElementById('texeqrival').value,
      'capitan': document.getElementById('texcapitan').value
    }
    convocatorias.push(convocatoria);
    localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
    
    
  };
  window.location.href = 'convocatorias.html'; 
}


function cancelarConvoctoria() {
  window.location.href = 'convocatorias.html';
}