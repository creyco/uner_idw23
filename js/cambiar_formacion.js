let form1Btn = document.getElementById("3-4-3");
let form2Btn = document.getElementById("4-4-2");
let form3Btn = document.getElementById("5-2-3");
let imgchangeform = document.getElementById("imgchangeform");

form1Btn.onclick = function() {
    imgchangeform.src = "../img/formacion_inicial_3-4-3.png";
}

form2Btn.onclick = function() {
    imgchangeform.src = "../img/formacion_inicial_4-4-2.png";
}

form3Btn.onclick = function() {
    imgchangeform .src="../img/formacion_inicial_5-2-3.png"
}