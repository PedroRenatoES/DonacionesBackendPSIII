const { sql, poolPromise } = require(require('../config').dbConnection);

class SalidasAlmacenModel {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        s.id_salida,
        s.fecha_salida,
        s.id_paquete,
        p.nombre_paquete,
        s.id_usuario,
        u.nombres AS nombre_usuario,
        u.apellido_paterno,
        u.apellido_materno
      FROM SalidasAlmacen s
      INNER JOIN Paquetes p ON s.id_paquete = p.id_paquete
      INNER JOIN Usuarios u ON s.id_usuario = u.id_usuario
      ORDER BY s.fecha_salida DESC
    `);
    return result.recordset;
  }

  static async create(id_paquete, id_usuario) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        INSERT INTO SalidasAlmacen (id_paquete, id_usuario)
        VALUES (@id_paquete, @id_usuario)
      `);
  }
}

module.exports = SalidasAlmacenModel;

