const db = require("../config/db");

const Productor = {
  obtenerTodos: async (estatus = null) => {
    let sql = `
            SELECT p.*, m.imagen_url, COUNT(pr.id) as total_predios 
            FROM productores p
            LEFT JOIN marcas m ON p.id = m.id_productor
            LEFT JOIN predios pr ON p.id = pr.id_productor
        `;
    const params = [];
    if (estatus) {
      sql += " WHERE p.estatus = ?";
      params.push(estatus);
    }
    sql += " GROUP BY p.id ORDER BY p.fecha_registro DESC";
    const [rows] = await db.query(sql, params);
    return rows;
  },
  verificarCedula: async (cedula) => {
    const [rows] = await db.query(
      "SELECT id FROM productores WHERE cedula = ?",
      [cedula],
    );
    return rows.length > 0;
  },
  crear: async (datos, connection) => {
    const sql =
      "INSERT INTO productores (cedula, nombres, apellidos, estatus) VALUES (?, ?, ?, ?)";
    const [result] = await connection.query(sql, [
      datos.cedula,
      datos.nombres,
      datos.apellidos,
      datos.estatus || "Activo",
    ]);
    return result.insertId;
  },
  agregarPredio: async (datos, connection) => {
    const sql =
      "INSERT INTO predios (id_productor, id_parroquia, nombre_finca, sector, coordenadas) VALUES (?, ?, ?, ?, ?)";
    await connection.query(sql, [
      datos.id_productor,
      datos.id_parroquia,
      datos.nombre_finca,
      datos.sector,
      datos.coordenadas,
    ]);
  },
  cambiarEstatus: async (id, estatus) => {
    await db.query("UPDATE productores SET estatus = ? WHERE id = ?", [
      estatus,
      id,
    ]);
  },
};

module.exports = Productor;
