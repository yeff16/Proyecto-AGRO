const Geografia = require("../models/Geografia");

const geoController = {
  getMunicipios: async (req, res) => {
    try {
      const municipios = await Geografia.obtenerMunicipios(
        req.params.id_estado,
      );
      res.json(municipios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener municipios" });
    }
  },
  getParroquias: async (req, res) => {
    try {
      const parroquias = await Geografia.obtenerParroquias(
        req.params.id_municipio,
      );
      res.json(parroquias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener parroquias" });
    }
  },
};

module.exports = geoController;
