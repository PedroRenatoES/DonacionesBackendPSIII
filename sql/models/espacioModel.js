const { sql, poolPromise } = require(require('../config').dbConnection);

class EspacioModel {
    static async getByEstante(id_estante) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_estante', sql.Int, id_estante)
            .query('SELECT * FROM Espacios WHERE id_estante = @id_estante');
        return result.recordset;
    }

    static async getByAlmacen(id_almacen) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_almacen', sql.Int, id_almacen)
            .query(`
                SELECT E.*
                FROM Espacios E
                INNER JOIN Estante S ON E.id_estante = S.id_estante
                WHERE S.id_almacen = @id_almacen
            `);
        return result.recordset;
    }

static async getAll() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      e.*,
      est.id_almacen
    FROM Espacios e
    INNER JOIN Estante est ON e.id_estante = est.id_estante
  `);
  return result.recordset;
}

    static async marcarLleno(id_espacio) {
    const pool = await poolPromise;
    await pool.request()
        .input('id_espacio', sql.Int, id_espacio)
        .query(`
            UPDATE Espacios
            SET lleno = 1
            WHERE id_espacio = @id_espacio
        `);
    return { success: true, message: 'Espacio marcado como lleno' };
}

static async marcarVacio(id_espacio) {
    const pool = await poolPromise;
    await pool.request()
        .input('id_espacio', sql.Int, id_espacio)
        .query(`
            UPDATE Espacios
            SET lleno = 0
            WHERE id_espacio = @id_espacio
        `);
    return { success: true, message: 'Espacio marcado como vacío' };
}


module.exports = EspacioModel;
