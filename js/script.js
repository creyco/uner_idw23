
/*************************VALIDACIÓN ***********************************/
function validarUsuario() {
  const nomusuario = document.getElementById('textUsuario').value;
  const contrasenia = document.getElementById('texcontrasenia').value;

  if (nomusuario.length === 0 || contrasenia.length === 0) {
    alert('El nombre de usuario o clave está vacío');
    return false;
  } else {
    alert('Hola ' + nomusuario + '! Bienvenido/a');
  }

}


function crearCuenta() {
  alert('Para crear una cuenta debe tener la autorizacion de AFA. Para más información ingrese a la página de contacto del sitio')
}

function estadisticas() {
  alert('Proximamente...')
}
function partidos() {
  window.location.href = '../img/fwwc2023_MatchSchedule_v29_26052023_EN_page-0001.jpg';
};
