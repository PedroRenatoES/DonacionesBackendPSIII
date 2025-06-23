const { sql, poolPromise } = require(require('../config').dbConnection);

class HistorialMovimientosModel {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        h.id_historial,
        h.fecha_hora,
        u.nombres + ' ' + u.apellido_paterno + ' ' + u.apellido_materno AS nombre_usuario,
        a.nombre_articulo,
        ao.nombre_almacen AS almacen_origen,
        ad.nombre_almacen AS almacen_destino
      FROM HistorialMovimientos h
      JOIN Usuarios u ON h.id_usuario = u.id_usuario
      JOIN DonacionesEnEspecie de ON h.id_donacion_especie = de.id_donacion_especie
      JOIN CatalogoDeArticulos a ON de.id_articulo = a.id_articulo
      JOIN Almacenes ao ON h.id_almacen_origen = ao.id_almacen
      JOIN Almacenes ad ON h.id_almacen_destino = ad.id_almacen
      ORDER BY h.fecha_hora DESC;
    `);
    return result.recordset;
  }

  static async create(id_usuario, id_donacion_especie, id_almacen_origen, id_almacen_destino) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('id_donacion_especie', sql.Int, id_donacion_especie)
      .input('id_almacen_origen', sql.Int, id_almacen_origen)
      .input('id_almacen_destino', sql.Int, id_almacen_destino)
      .query(`
        INSERT INTO HistorialMovimientos (
          id_usuario, id_donacion_especie, id_almacen_origen, id_almacen_destino
        ) VALUES (
          @id_usuario, @id_donacion_especie, @id_almacen_origen, @id_almacen_destino
        );
      `);
  }
}

module.exports = HistorialMovimientosModel;



