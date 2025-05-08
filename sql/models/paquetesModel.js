const { sql, poolPromise } = require(require('../config').dbConnection);

class PaquetesModel {
  // Crear paquete y, opcionalmente, asociar donaciones en especie
  static async create(nombre_paquete, descripcion, donaciones = []) {
    const pool = await poolPromise;
    // Insertar paquete
    const result = await pool.request()
      .input('nombre_paquete', sql.VarChar, nombre_paquete)
      .input('descripcion',    sql.Text,    descripcion)
      .query(`
        INSERT INTO Paquetes (nombre_paquete, descripcion)
        OUTPUT INSERTED.id_paquete
        VALUES (@nombre_paquete, @descripcion);
      `);
    const id_paquete = result.recordset[0].id_paquete;

    // Asociar donaciones en especie si se pasan IDs
    if (Array.isArray(donaciones) && donaciones.length) {
      const table = new sql.Table('PaqueteDonacionesType');
      table.columns.add('id_paquete', sql.Int);
      table.columns.add('id_donacion_especie', sql.Int);
      donaciones.forEach(idE => table.rows.add(id_paquete, idE));
      await pool.request()
        .input('tvp', table)
        .query(`
          INSERT INTO PaqueteDonaciones (id_paquete, id_donacion_especie)
          SELECT id_paquete, id_donacion_especie FROM @tvp;
        `);
    }
    return id_paquete;
  }

  // Obtener todos los paquetes (sin detalles de items)
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT id_paquete, nombre_paquete, descripcion, fecha_creacion
        FROM Paquetes
        ORDER BY fecha_creacion DESC;
      `);
    return result.recordset;
  }

  // Obtener un paquete con sus items detallados
  static async getById(id_paquete) {
    const pool = await poolPromise;
    // Datos del paquete
    const pkgRes = await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`
        SELECT id_paquete, nombre_paquete, descripcion, fecha_creacion
        FROM Paquetes
        WHERE id_paquete = @id_paquete;
      `);
    const paquete = pkgRes.recordset[0];
    if (!paquete) return null;

    // Items asociados
    const itemsRes = await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`
        SELECT deE.id_donacion_especie,
               art.nombre_articulo,
               deE.cantidad,
               u.simbolo AS unidad
        FROM PaqueteDonaciones pd
        JOIN DonacionesEnEspecie deE
          ON pd.id_donacion_especie = deE.id_donacion_especie
        JOIN CatalogoDeArticulos art
          ON deE.id_articulo = art.id_articulo
        JOIN UnidadesDeMedida u
          ON deE.id_unidad = u.id_unidad
        WHERE pd.id_paquete = @id_paquete;
      `);
    paquete.items = itemsRes.recordset;
    return paquete;
  }

  // Actualizar datos básicos y items de un paquete
  static async update(id_paquete, nombre_paquete, descripcion, donaciones = []) {
    const pool = await poolPromise;
    // Actualizar cabecera
    await pool.request()
      .input('id_paquete',    sql.Int,     id_paquete)
      .input('nombre_paquete', sql.VarChar, nombre_paquete)
      .input('descripcion',    sql.Text,    descripcion)
      .query(`
        UPDATE Paquetes
        SET nombre_paquete = @nombre_paquete,
            descripcion    = @descripcion
        WHERE id_paquete = @id_paquete;
      `);
    // Reemplazar items: eliminar existentes y volver a insertar
    await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`DELETE FROM PaqueteDonaciones WHERE id_paquete = @id_paquete;`);
    if (Array.isArray(donaciones) && donaciones.length) {
      const table = new sql.Table('PaqueteDonacionesType');
      table.columns.add('id_paquete', sql.Int);
      table.columns.add('id_donacion_especie', sql.Int);
      donaciones.forEach(idE => table.rows.add(id_paquete, idE));
      await pool.request()
        .input('tvp', table)
        .query(`
          INSERT INTO PaqueteDonaciones (id_paquete, id_donacion_especie)
          SELECT id_paquete, id_donacion_especie FROM @tvp;
        `);
    }
  }

  // Eliminar un paquete y sus asociaciones
  static async delete(id_paquete) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`
        DELETE FROM PaqueteDonaciones WHERE id_paquete = @id_paquete;
        DELETE FROM Paquetes         WHERE id_paquete = @id_paquete;
      `);
  }
}

module.exports = PaquetesModel;