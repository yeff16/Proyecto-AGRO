const db = require("../config/db");

const Marca = {
  obtenerTodas: async () => {
    const [rows] = await db.query("SELECT * FROM marcas");
    return rows;
  },
  crear: async (id_productor, imagen_url, hash_perceptual, connection) => {
    const sql =
      "INSERT INTO marcas (id_productor, imagen_url, hash_perceptual) VALUES (?, ?, ?)";
    await connection.query(sql, [id_productor, imagen_url, hash_perceptual]);
  },
};

module.exports = Marca;
