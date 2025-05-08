const { sql, poolPromise } = require(require('../config').dbConnection);

class DonacionesEnEspecieModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM DonacionesEnEspecie');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM DonacionesEnEspecie WHERE id_donacion = @id');
        return result.recordset[0];
    }

    static async getByDonanteId(id_donante) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id_donante', sql.Int, id_donante)
        .query(`
            SELECT e.*
            FROM DonacionesEnEspecie e
            JOIN Donaciones d ON e.id_donacion = d.id_donacion
            WHERE d.id_donante = @id_donante
        `);
    return result.recordset;
}


    static async create(id_donacion, id_articulo, cantidad, estado_articulo, destino_donacion, fila = null, columna = null, estante = null) {
        const pool = await poolPromise;
        await pool.request()
            .input('id_donacion', sql.Int, id_donacion)
            .input('id_articulo', sql.Int, id_articulo)
            .input('cantidad', sql.Int, cantidad)
            .input('estado_articulo', sql.VarChar, estado_articulo)
            .input('destino_donacion', sql.VarChar, destino_donacion)
            .input('fila', sql.VarChar, fila) // Nuevo parámetro
            .input('columna', sql.VarChar, columna) // Nuevo parámetro
            .input('estante', sql.VarChar, estante) // Nuevo parámetro
            .query('INSERT INTO DonacionesEnEspecie (id_donacion, id_articulo, cantidad, estado_articulo, destino_donacion, fila, columna, estante) ' +
                'VALUES (@id_donacion, @id_articulo, @cantidad, @estado_articulo, @destino_donacion, @fila, @columna, @estante)');
    }

    static async update(
        id,
        id_articulo,
        id_espacio,
        id_unidad,           // <- nuevo parámetro
        cantidad,
        estado_articulo,
        destino_donacion
      ) {
        const pool = await poolPromise;
        await pool.request()
          .input('id', sql.Int, id)
          .input('id_articulo', sql.Int, id_articulo)
          .input('id_espacio', sql.Int, id_espacio)
          .input('id_unidad', sql.Int, id_unidad)           // <- input unidad
          .input('cantidad', sql.Decimal(18,2), cantidad)    // DECIMAL(18,2)
          .input('estado_articulo', sql.VarChar(100), estado_articulo)
          .input('destino_donacion', sql.Text, destino_donacion)
          .query(`
            UPDATE DonacionesEnEspecie
            SET
              id_articulo    = @id_articulo,
              id_espacio     = @id_espacio,
              id_unidad      = @id_unidad,
              cantidad       = @cantidad,
              estado_articulo= @estado_articulo,
              destino_donacion = @destino_donacion
            WHERE id_donacion_especie = @id
          `);
      }
      

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM DonacionesEnEspecie WHERE id_donacion = @id');
    }

    static async getInventarioConUbicacion() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
        d.id_articulo,
        a.nombre_articulo,
        d.cantidad,
        e.codigo AS espacio,
        es.nombre AS estante,
        al.nombre_almacen
        FROM DonacionesEnEspecie d
        JOIN CatalogoDeArticulos a ON d.id_articulo = a.id_articulo
        JOIN Espacios e ON d.id_espacio = e.id_espacio
        JOIN Estante es ON e.id_estante = es.id_estante
        JOIN Almacenes al ON es.id_almacen = al.id_almacen
    `);
    return result.recordset;
    }


}

module.exports = DonacionesEnEspecieModel;
