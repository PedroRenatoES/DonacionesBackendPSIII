const { sql, poolPromise } = require(require('../config').dbConnection);

class SolicitudesRecoleccionModel {
  static async create(id_donante, ubicacion, detalle_solicitud) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_donante', sql.Int, id_donante)
      .input('ubicacion', sql.Text, ubicacion)
      .input('detalle_solicitud', sql.Text, detalle_solicitud)
      .query(
        `INSERT INTO SolicitudesRecoleccion (id_donante, Ubicacion, Detalle_solicitud)
         OUTPUT INSERTED.id_solicitud
         VALUES (@id_donante, @ubicacion, @detalle_solicitud);`
      );
    return result.recordset[0].id_solicitud;
  }

  // Obtener todas las solicitudes
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(
        `SELECT
           sr.id_solicitud,
           sr.id_donante,
           don.nombres + ' ' + don.apellido_paterno + ' ' + don.apellido_materno AS donante,
           sr.Ubicacion,
           sr.Detalle_solicitud
         FROM SolicitudesRecoleccion sr
         JOIN Donantes don ON sr.id_donante = don.id_donante;`
      );
    return result.recordset;
  }

  // Obtener una solicitud por ID
  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_solicitud', sql.Int, id)
      .query(
        `SELECT
           id_solicitud,
           id_donante,
           Ubicacion,
           Detalle_solicitud
         FROM SolicitudesRecoleccion
         WHERE id_solicitud = @id_solicitud;`
      );
    return result.recordset[0];
  }

  // Actualizar solicitud existente
  static async update(id, id_donante, ubicacion, detalle_solicitud) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_solicitud', sql.Int, id)
      .input('id_donante', sql.Int, id_donante)
      .input('ubicacion', sql.Text, ubicacion)
      .input('detalle_solicitud', sql.Text, detalle_solicitud)
      .query(
        `UPDATE SolicitudesRecoleccion
         SET id_donante = @id_donante,
             Ubicacion = @ubicacion,
             Detalle_solicitud = @detalle_solicitud
         WHERE id_solicitud = @id_solicitud;`
      );
  }

  // Eliminar solicitud
  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_solicitud', sql.Int, id)
      .query(
        `DELETE FROM SolicitudesRecoleccion
         WHERE id_solicitud = @id_solicitud;`
      );
  }
}

module.exports = SolicitudesRecoleccionModel;   