const express = require("express");
const router = express.Router();
const productorController = require("../controllers/productorController");
const geoController = require("../controllers/geoController");

router.get("/", productorController.listar);
router.get("/registrar", productorController.vistaRegistrar);
router.post("/registrar", productorController.registrar);
router.post("/productor/estatus/:id", productorController.cambiarEstatus);

router.get("/api/municipios/:id_estado", geoController.getMunicipios);
router.get("/api/parroquias/:id_municipio", geoController.getParroquias);

module.exports = router;
