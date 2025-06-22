const { sql, poolPromise } = require(require('../config').dbConnection);

class AlmacenModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Almacenes');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Almacenes WHERE id_almacen = @id');
        return result.recordset[0];
    }

    static async getAlmacenesConContenido() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        a.id_almacen,
        a.nombre_almacen,
        a.ubicacion,
        es.id_estante,
        es.nombre AS nombre_estante,
        sp.id_espacio,
        sp.codigo AS codigo_espacio,
        sp.lleno,
        da.id_articulo,
        art.nombre_articulo,
        da.cantidad,
        um.nombre_unidad,
        cat.nombre_categoria
      FROM Almacenes a
      JOIN Estante es ON es.id_almacen = a.id_almacen
      JOIN Espacios sp ON sp.id_estante = es.id_estante
      LEFT JOIN DonacionesEnEspecie da ON da.id_espacio = sp.id_espacio
      LEFT JOIN CatalogoDeArticulos art ON da.id_articulo = art.id_articulo
      LEFT JOIN UnidadesDeMedida um ON da.id_unidad = um.id_unidad
      LEFT JOIN CategoriasDeArticulos cat ON art.id_categoria = cat.id_categoria
      ORDER BY a.id_almacen, es.id_estante, sp.id_espacio
    `);

    return result.recordset;
  }

    static async getByAlmacen(id_almacen) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id_almacen', sql.Int, id_almacen)
        .query(`
            SELECT 
                es.id_estante,
                es.nombre AS nombre_estante,
                sp.id_espacio,
                sp.codigo AS codigo_espacio,
                sp.lleno
            FROM Estante es
            JOIN Espacios sp ON sp.id_estante = es.id_estante
            WHERE es.id_almacen = @id_almacen
            ORDER BY es.id_estante, sp.codigo
        `);
    return result.recordset;
}

static async create(nombre_almacen, ubicacion, latitud, longitud) {
    const pool = await poolPromise;
    await pool.request()
        .input('nombre_almacen', sql.VarChar, nombre_almacen)
        .input('ubicacion', sql.VarChar, ubicacion)
        .input('latitud', sql.Decimal(9, 6), latitud)   // <-- CORREGIDO
        .input('longitud', sql.Decimal(9, 6), longitud) // <-- CORREGIDO
        .query('INSERT INTO Almacenes (nombre_almacen, ubicacion, latitud, longitud) VALUES (@nombre_almacen, @ubicacion, @latitud, @longitud)');
}


    static async update(id, nombre_almacen, ubicacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_almacen', sql.VarChar, nombre_almacen)
            .input('ubicacion', sql.VarChar, ubicacion)
            .query('UPDATE Almacenes SET nombre_almacen = @nombre_almacen, ubicacion = @ubicacion WHERE id_almacen = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Almacenes WHERE id_almacen = @id');
    }
}

module.exports = AlmacenModel;
