const { sql, poolPromise } = require(require('../config').dbConnection);

class DonacionesRopaModel {
  static async create(id_donacion_especie, id_genero, id_talla) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_donacion_especie', sql.Int, id_donacion_especie)
      .input('id_genero',           sql.Int, id_genero)
      .input('id_talla',            sql.Int, id_talla)
      .query(`
        INSERT INTO DonacionesRopa (id_donacion_especie, id_genero, id_talla)
        VALUES (@id_donacion_especie, @id_genero, @id_talla);
      `);
  }

  static async update(id_donacion_especie, id_genero, id_talla) {
    const pool = await poolPromise;
    await pool.request()
      .input('id_donacion_especie', sql.Int, id_donacion_especie)
      .input('id_genero',           sql.Int, id_genero)
      .input('id_talla',            sql.Int, id_talla)
      .query(`
        UPDATE DonacionesRopa
        SET id_genero = @id_genero,
            id_talla  = @id_talla
        WHERE id_donacion_especie = @id_donacion_especie;
      `);
  }

  static async getByDonacionEspecie(id_donacion_especie) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id_donacion_especie)
      .query(`
        SELECT dr.id_donacion_especie,
               g.nombre_genero,
               t.valor_talla
        FROM DonacionesRopa dr
        JOIN Generos g ON dr.id_genero = g.id_genero
        JOIN Tallas  t ON dr.id_talla  = t.id_talla
        WHERE dr.id_donacion_especie = @id;
      `);
    return result.recordset[0];
  }

  static async getAllGeneros() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT id_genero, nombre_genero
        FROM Generos
        ORDER BY nombre_genero;
      `);
    return result.recordset;
  }

  static async getAllTallas() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT id_talla, valor_talla
        FROM Tallas
        ORDER BY valor_talla;
      `);
    return result.recordset;
  }
}

module.exports = DonacionesRopaModel;
