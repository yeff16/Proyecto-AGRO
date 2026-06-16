const db = require("../config/db");

const Geografia = {
  obtenerEstados: async () => {
    const [rows] = await db.query("SELECT * FROM estados ORDER BY nombre ASC");
    return rows;
  },
  obtenerMunicipios: async (id_estado) => {
    const [rows] = await db.query(
      "SELECT * FROM municipios WHERE id_estado = ? ORDER BY nombre ASC",
      [id_estado],
    );
    return rows;
  },
  obtenerParroquias: async (id_municipio) => {
    const [rows] = await db.query(
      "SELECT * FROM parroquias WHERE id_municipio = ? ORDER BY nombre ASC",
      [id_municipio],
    );
    return rows;
  },
};

module.exports = Geografia;
