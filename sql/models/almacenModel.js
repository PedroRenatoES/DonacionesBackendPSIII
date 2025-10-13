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

    static async getAlmacenesPorDonacion(idDonacion) {
        const pool = await poolPromise;

        const result = await pool.request()
        .input('id_donacion', sql.Int, parseInt(idDonacion))
        .query(`
            SELECT
            al.id_almacen,
            MAX(CAST(al.nombre_almacen AS VARCHAR(200)))    AS nombre_almacen,
            MAX(CAST(al.ubicacion AS VARCHAR(500)))        AS ubicacion,
            MAX(CAST(al.latitud AS VARCHAR(50)))           AS latitud,
            MAX(CAST(al.longitud AS VARCHAR(50)))          AS longitud
            FROM PedidosDeAyuda pda
            JOIN Paquetes paq
            ON pda.id_pedido = paq.id_pedido
            JOIN PaqueteDonaciones pd
            ON paq.id_paquete = pd.id_paquete
            JOIN DonacionesEnEspecie de
            ON pd.id_donacion_especie = de.id_donacion_especie
            JOIN Espacios e
            ON de.id_espacio = e.id_espacio
            JOIN Estante es
            ON e.id_estante = es.id_estante
            JOIN Almacenes al
            ON es.id_almacen = al.id_almacen
            WHERE pda.id_donacion = @id_donacion
            GROUP BY al.id_almacen
            ORDER BY al.id_almacen;
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

static async update(id, nombre_almacen, ubicacion, latitud, longitud) {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .input('nombre_almacen', sql.VarChar, nombre_almacen)
        .input('ubicacion', sql.VarChar, ubicacion)
        .input('latitud', sql.Decimal(9, 6), latitud)
        .input('longitud', sql.Decimal(9, 6), longitud)
        .query(`
            UPDATE Almacenes
            SET nombre_almacen = @nombre_almacen,
                ubicacion = @ubicacion,
                latitud = @latitud,
                longitud = @longitud
            WHERE id_almacen = @id
        `);
}

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Almacenes WHERE id_almacen = @id');
    }
}

module.exports = AlmacenModel;
