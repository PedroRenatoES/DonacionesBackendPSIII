const { sql, poolPromise } = require(require('../config').dbConnection);

class CajaModel {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Cajas');
    return result.recordset;
  }

  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Cajas WHERE id_caja = @id');
    return result.recordset[0];
  }

  static async getByPaqueteWithDetails(id_paquete) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`
        SELECT 
          c.id_caja,
          c.codigo_caja,
          c.descripcion,
          c.cantidad_asignada,
  
          p.id_paquete,
          p.nombre_paquete,
          p.descripcion AS descripcion_paquete,
          p.fecha_creacion,
          p.id_pedido,
  
          pd.id_donacion_especie,
          pd.cantidad_asignada AS cantidad_asignada_donacion
        FROM Cajas c
        INNER JOIN Paquetes p ON c.id_paquete = p.id_paquete
        LEFT JOIN PaqueteDonaciones pd ON p.id_paquete = pd.id_paquete
        WHERE c.id_paquete = @id_paquete
      `);
    return result.recordset;
  }

  static async create(codigo_caja, descripcion, id_paquete, cantidad_asignada) {
  console.log('🟡 CajaModel.create() llamado');
  const pool = await poolPromise;
  const result = await pool.request()
    .input('codigo_caja', sql.VarChar, codigo_caja)
    .input('descripcion', sql.VarChar, descripcion)
    .input('id_paquete', sql.Int, id_paquete)
    .input('cantidad_asignada', sql.Int, cantidad_asignada)
    .query(`
      INSERT INTO Cajas (codigo_caja, descripcion, id_paquete, cantidad_asignada)
      OUTPUT INSERTED.id_caja
      VALUES (@codigo_caja, @descripcion, @id_paquete, @cantidad_asignada)
    `);
  console.log('🟢 Caja insertada con ID:', result.recordset[0].id_caja);
  return result.recordset[0].id_caja;
}


  static async update(id, codigo_caja, descripcion, id_paquete, cantidad_asignada) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('codigo_caja', sql.VarChar, codigo_caja)
      .input('descripcion', sql.VarChar, descripcion)
      .input('id_paquete', sql.Int, id_paquete)
      .input('cantidad_asignada', sql.Int, cantidad_asignada)
      .query(`
        UPDATE Cajas
        SET codigo_caja = @codigo_caja,
            descripcion = @descripcion,
            id_paquete = @id_paquete,
            cantidad_asignada = @cantidad_asignada
        WHERE id_caja = @id
      `);
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Cajas WHERE id_caja = @id');
  }
}

module.exports = CajaModel;
