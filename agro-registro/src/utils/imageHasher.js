const { Jimp } = require("jimp");
const blockhash = require("blockhash-core");
const fs = require("fs");

async function obtenerHashImagen(rutaImagen) {
  try {
    const buffer = fs.readFileSync(rutaImagen);

    const image = await Jimp.read(buffer);

    image.resize({ w: 64, h: 64 }).greyscale();

    const imageData = {
      width: image.bitmap.width,
      height: image.bitmap.height,
      data: image.bitmap.data,
    };

    const hash = blockhash.bmvbhash(imageData, 8);
    return hash;
  } catch (error) {
    console.error("❌ Error profundo en Jimp:", error);
    throw new Error("No se pudo procesar la imagen del hierro correctamente.");
  }
}

function calcularDistancia(hash1, hash2) {
  let distancia = 0;
  if (!hash1 || !hash2) return 99;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distancia++;
  }
  return distancia;
}

module.exports = { obtenerHashImagen, calcularDistancia };
