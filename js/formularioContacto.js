window.addEventListener("load", function () {
  leerForm();
});

/****************************FORMULARIO***********************************/
const enviar = document.getElementById('enviar-cont').addEventListener('click', formularioContacto);

function leerForm() {
  const contacto = JSON.parse(localStorage.getItem('contacto'));
  if (contacto === null) {
    fetch('../json/contacto.json')
      .then((res) => {
        return res.json()
      })
      .then((data) => {

        localStorage.setItem('contacto', JSON.stringify(data));
      })
  }
}

function formularioContacto() {
  
  const jsonFormCont = localStorage.getItem('contacto');
  if (jsonFormCont !== null) {
    const formContactos = JSON.parse(localStorage.getItem('contacto'));

    let idMax = formContactos.reduce((max, obj) => obj.id > max ? obj.id : max, -Infinity);
    let i = 0;

    if (idMax !== -Infinity){
      i = idMax + 1;
    }
    const cont = {
      'id': i,
      'nombreyapellido': document.getElementById('nombreyapellido').value,
      'email': document.getElementById('email').value,
      'asunto': document.getElementById('asunto').value,
      'comentario': document.getElementById('comentario').value
    }

    formContactos.push(cont);

    localStorage.setItem('contacto', JSON.stringify(formContactos));
    
    alert('Solicitud enviada')
  }
}

