const canvas = document.getElementById("canvasHierro");
const ctx = canvas.getContext("2d");
const btnLimpiar = document.getElementById("btnLimpiar");
const fileArchivo = document.getElementById("fileArchivo");
const formRegistro = document.getElementById("formRegistro");
const inputMarca = document.getElementById("marca_canvas");

function limpiarLienzo() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
limpiarLienzo();

let dibujando = false;
ctx.lineWidth = 6;
ctx.lineCap = "round";
ctx.strokeStyle = "#000000";

canvas.addEventListener("mousedown", (e) => {
  dibujando = true;
  dibujar(e);
});
canvas.addEventListener("mousemove", dibujar);
window.addEventListener("mouseup", () => {
  dibujando = false;
  ctx.beginPath();
});

function dibujar(e) {
  if (!dibujando) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  fileArchivo.value = "";
}

btnLimpiar.addEventListener("click", limpiarLienzo);

fileArchivo.addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      limpiarLienzo();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = event.target.result;
  };
  if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

const selectEstado = document.getElementById("estado");
const selectMunicipio = document.getElementById("municipio");
const selectParroquia = document.getElementById("id_parroquia");

selectEstado.addEventListener("change", async () => {
  const id = selectEstado.value;
  selectMunicipio.innerHTML = '<option value="">Seleccione Municipio</option>';
  selectParroquia.innerHTML = '<option value="">Seleccione Parroquia</option>';
  selectParroquia.disabled = true;

  if (!id) {
    selectMunicipio.disabled = true;
    return;
  }

  const res = await fetch(`/api/municipios/${id}`);
  const data = await res.json();
  data.forEach((m) => {
    selectMunicipio.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
  });
  selectMunicipio.disabled = false;
});

selectMunicipio.addEventListener("change", async () => {
  const id = selectMunicipio.value;
  selectParroquia.innerHTML = '<option value="">Seleccione Parroquia</option>';

  if (!id) {
    selectParroquia.disabled = true;
    return;
  }

  const res = await fetch(`/api/parroquias/${id}`);
  const data = await res.json();
  data.forEach((p) => {
    selectParroquia.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
  });
  selectParroquia.disabled = false;
});

formRegistro.addEventListener("submit", (e) => {
  const dataURL = canvas.toDataURL("image/png");
  inputMarca.value = dataURL;
});
