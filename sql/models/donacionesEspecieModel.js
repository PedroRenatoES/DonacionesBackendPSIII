const { sql, poolPromise } = require(require('../config').dbConnection);

class DonacionesEnEspecieModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
          SELECT 
            dee.id_donacion_especie,
            dee.id_donacion,
            don.nombres,
            don.apellido_paterno,
            don.apellido_materno,
            dee.id_articulo,
            dee.id_espacio,
            dee.id_unidad,
            dee.cantidad,
            dee.cantidad_restante,
            dee.estado_articulo
        FROM DonacionesEnEspecie dee
        INNER JOIN Donaciones d ON dee.id_donacion = d.id_donacion
        INNER JOIN Donantes don ON d.id_donante = don.id_donante;`);
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

 static async getByCampanaId(id_campana) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_campana', sql.Int, id_campana)
      .query(`
        SELECT
          d.id_donacion,
          d.fecha_donacion,
          d.estado_validacion,
          e.id_donacion_especie,
          e.cantidad,
          e.estado_articulo,
          ca.nombre_articulo,
          ca.descripcion AS descripcion_articulo,
          um.nombre_unidad,
          um.simbolo,
          esp.id_espacio,
          esp.codigo AS codigo_espacio,
          est.nombre AS nombre_estante,
          alm.nombre_almacen
        FROM DonacionesEnEspecie e
        INNER JOIN Donaciones d ON e.id_donacion = d.id_donacion
        INNER JOIN CatalogoDeArticulos ca ON e.id_articulo = ca.id_articulo
        INNER JOIN UnidadesDeMedida um ON e.id_unidad = um.id_unidad
        LEFT JOIN Espacios esp ON e.id_espacio = esp.id_espacio
        LEFT JOIN Estante est ON esp.id_estante = est.id_estante
        LEFT JOIN Almacenes alm ON est.id_almacen = alm.id_almacen
        WHERE d.id_campana = @id_campana
      `);
    return result.recordset;
  }

  static async getDonantesPorArticulo(id_articulo) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_articulo', sql.Int, id_articulo)
      .query(`
        SELECT 
          don.nombres,
          don.apellido_paterno,
          don.apellido_materno,
          dee.cantidad,
          dee.cantidad_restante
        FROM DonacionesEnEspecie dee
        INNER JOIN Donaciones d ON dee.id_donacion = d.id_donacion
        INNER JOIN Donantes don ON d.id_donante = don.id_donante
        WHERE dee.id_articulo = @id_articulo
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
        cantidad_restante = cantidad,   // NUEVO: parámetro para cantidad restante
        fecha_vencimiento    // NUEVO: parámetro para fecha de vencimiento
      ) {
          const pool = await poolPromise;
          await pool.request()
            .input('id', sql.Int, id)
            .input('id_articulo', sql.Int, id_articulo)
            .input('id_espacio', sql.Int, id_espacio)
            .input('id_unidad', sql.Int, id_unidad)           // <- input unidad
            .input('cantidad', sql.Decimal(18,2), cantidad)    // DECIMAL(18,2)
            .input('estado_articulo', sql.VarChar(100), estado_articulo)
            .input('cantidad_restante', sql.Decimal(18, 2), cantidad_restante) // NUEVO
            .input('fecha_vencimiento', sql.Date, fecha_vencimiento) // NUEVO
            .query(`
              UPDATE DonacionesEnEspecie
              SET
                id_articulo    = @id_articulo,
                id_espacio     = @id_espacio,
                id_unidad      = @id_unidad,
                cantidad       = @cantidad,
                estado_articulo= @estado_articulo,
                cantidad_restante = @cantidad_restante,
                fecha_vencimiento = @fecha_vencimiento
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
        c.nombre_categoria,
        u.nombre_unidad,
        d.cantidad_restante AS cantidad,   -- mostramos sólo cantidad_restante
        d.fecha_vencimiento,               -- fecha de vencimiento
        e.codigo       AS espacio,
        es.nombre      AS estante,
        al.nombre_almacen
      FROM DonacionesEnEspecie d
      JOIN CatalogoDeArticulos a 
        ON d.id_articulo = a.id_articulo
      JOIN CategoriasDeArticulos c 
        ON a.id_categoria = c.id_categoria
      JOIN UnidadesDeMedida u 
        ON d.id_unidad = u.id_unidad
      JOIN Espacios e 
        ON d.id_espacio = e.id_espacio
      JOIN Estante es 
        ON e.id_estante = es.id_estante
      JOIN Almacenes al 
        ON es.id_almacen = al.id_almacen
      WHERE d.cantidad_restante > 0
      ORDER BY a.nombre_articulo, al.nombre_almacen, es.nombre, e.codigo;
    `);
    return result.recordset;
  }

  static async getStockPorArticulo() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT
      de.id_articulo,
      a.nombre_articulo,
      CAST(a.descripcion AS VARCHAR(MAX)) AS descripcion,
      u.nombre_unidad,
      u.simbolo AS medida_abreviada,
      c.cantidad_estimada_por_persona,
      SUM(de.cantidad_restante) AS total_restante
    FROM DonacionesEnEspecie de
    JOIN CatalogoDeArticulos a 
      ON de.id_articulo = a.id_articulo
    JOIN UnidadesDeMedida u 
      ON de.id_unidad = u.id_unidad
    JOIN CategoriasDeArticulos c
      ON a.id_categoria = c.id_categoria
    WHERE de.cantidad_restante > 0
    GROUP BY 
      de.id_articulo, 
      a.nombre_articulo, 
      CAST(a.descripcion AS VARCHAR(MAX)), 
      u.nombre_unidad, 
      u.simbolo,
      c.cantidad_estimada_por_persona
    ORDER BY a.nombre_articulo;
  `);
  return result.recordset;
}


  static async getStockPorArticuloPorId(id_articulo) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_articulo', sql.Int, id_articulo)
    .query(`
      SELECT
        de.id_articulo,
        a.nombre_articulo,
        CAST(a.descripcion AS VARCHAR(MAX)) AS descripcion,
        u.nombre_unidad,
        u.simbolo AS medida_abreviada,
        SUM(de.cantidad_restante) AS total_restante,
        c.cantidad_estimada_por_persona
      FROM DonacionesEnEspecie de
      JOIN CatalogoDeArticulos a 
        ON de.id_articulo = a.id_articulo
      JOIN UnidadesDeMedida u 
        ON de.id_unidad = u.id_unidad
      JOIN CategoriasDeArticulos c
        ON a.id_categoria = c.id_categoria
      WHERE 
        de.cantidad_restante > 0
        AND de.id_articulo = @id_articulo
      GROUP BY 
        de.id_articulo, 
        a.nombre_articulo, 
        CAST(a.descripcion AS VARCHAR(MAX)), 
        u.nombre_unidad, 
        u.simbolo,
        c.cantidad_estimada_por_persona
      ORDER BY a.nombre_articulo;
    `);

  // Retorna solo el primer (y único) objeto, o null si no hay resultados
  return result.recordset[0] || null;
}



  static async actualizarEspacio(id_donacion_especie, id_espacio) {
    const pool = await poolPromise;
    await pool.request()
        .input('id_donacion_especie', sql.Int, id_donacion_especie)
        .input('id_espacio', sql.Int, id_espacio)
        .query(`
            UPDATE DonacionesEnEspecie
            SET id_espacio = @id_espacio
            WHERE id_donacion_especie = @id_donacion_especie
        `);
  }

    static async getStockPorEstanteId(id_estante) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_estante', sql.Int, id_estante)
      .query(`
          SELECT
          de.id_articulo,
          a.nombre_articulo,
          CAST(a.descripcion AS VARCHAR(MAX)) AS descripcion,
          u.nombre_unidad,
          u.simbolo AS medida_abreviada,
          SUM(de.cantidad_restante) AS total_restante,
          e.id_estante
        FROM DonacionesEnEspecie de
        JOIN Espacios es ON de.id_espacio = es.id_espacio
        JOIN Estante e ON es.id_estante = e.id_estante
        JOIN CatalogoDeArticulos a ON de.id_articulo = a.id_articulo
        JOIN UnidadesDeMedida u ON de.id_unidad = u.id_unidad
        JOIN CategoriasDeArticulos c ON a.id_categoria = c.id_categoria
        WHERE
          de.cantidad_restante > 0
          AND e.id_estante = 1
        GROUP BY
          de.id_articulo,
          a.nombre_articulo,
          CAST(a.descripcion AS VARCHAR(MAX)),
          u.nombre_unidad,
          u.simbolo,
          c.cantidad_estimada_por_persona,
          e.id_estante
        ORDER BY a.nombre_articulo;
      `);
 
    return result.recordset;
  }



}

module.exports = DonacionesEnEspecieModel;
