const { sql, poolPromise } = require(require('../config').dbConnection);

class UnidadesModel {
  // Obtener todas las unidades de medida
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT
          id_unidad,
          nombre_unidad,
          simbolo,
          factor_base
        FROM UnidadesDeMedida
      `);
    return result.recordset;
  }

  // Obtener unidades de medida por nombre de categoría
  static async getByCategoria(nombre_categoria) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre_categoria', sql.VarChar, nombre_categoria)
      .query(`
        SELECT
          u.id_unidad,
          u.nombre_unidad,
          u.simbolo,
          u.factor_base
        FROM UnidadesDeMedida u
        INNER JOIN Categoria_Unidad cu
          ON u.id_unidad = cu.id_unidad
        INNER JOIN CategoriasDeArticulos c
          ON cu.id_categoria = c.id_categoria
        WHERE c.nombre_categoria = @nombre_categoria
      `);
    return result.recordset;
  }
}

module.exports = UnidadesModel;