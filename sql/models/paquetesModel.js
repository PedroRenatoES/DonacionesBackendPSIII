const { sql, poolPromise } = require(require('../config').dbConnection);

class PaquetesModel {
  // Crear paquete y, opcionalmente, asociar donaciones en especie
  static async create(nombre_paquete, descripcion, id_pedido, donaciones = []) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre_paquete', sql.VarChar, nombre_paquete)
      .input('descripcion',    sql.Text,    descripcion)
      .input('id_pedido',      sql.Int,     id_pedido)
      .query(`
        INSERT INTO Paquetes (nombre_paquete, descripcion, id_pedido)
        OUTPUT INSERTED.id_paquete
        VALUES (@nombre_paquete, @descripcion, @id_pedido);
      `);
    const id_paquete = result.recordset[0].id_paquete;

    let errorMessages = [];
    if (Array.isArray(donaciones) && donaciones.length) {
      const table = new sql.Table('PaqueteDonacionesType');
      table.columns.add('id_paquete',          sql.Int);
      table.columns.add('id_donacion_especie', sql.Int);
      table.columns.add('cantidad_asignada',   sql.Decimal(18, 2));

      for (let { id_donacion_especie, cantidad_asignada } of donaciones) {
        // Traer estado_articulo y cantidad_restante
        const info = await pool.request()
          .input('id_donacion_especie', sql.Int, id_donacion_especie)
          .query(`
            SELECT estado_articulo, cantidad_restante
            FROM DonacionesEnEspecie
            WHERE id_donacion_especie = @id_donacion_especie;
          `);
        if (!info.recordset.length) {
          errorMessages.push(`No existe la donación ${id_donacion_especie}.`);
          continue;
        }
        const { estado_articulo, cantidad_restante } = info.recordset[0];

        if (estado_articulo === 'sellado') {
          errorMessages.push(`La donación ${id_donacion_especie} está sellada y no es particionable.`);
          continue;
        }
        if (cantidad_asignada > cantidad_restante) {
          errorMessages.push(
            `La cantidad asignada (${cantidad_asignada}) para la donación ${id_donacion_especie} ` +
            `no puede ser mayor que la cantidad restante (${cantidad_restante}).`
          );
          continue;
        }
        if (cantidad_restante - cantidad_asignada < 0) {
          errorMessages.push(`La cantidad restante de la donación ${id_donacion_especie} no puede ser menor a 0.`);
          continue;
        }

        table.rows.add(id_paquete, id_donacion_especie, cantidad_asignada);
      }

      if (errorMessages.length) {
        return { success: false, errors: errorMessages };
      }

      await pool.request()
        .input('tvp', table)
        .query(`
          INSERT INTO PaqueteDonaciones (id_paquete, id_donacion_especie, cantidad_asignada)
          SELECT id_paquete, id_donacion_especie, cantidad_asignada FROM @tvp;
        `);

      for (let { id_donacion_especie, cantidad_asignada } of donaciones) {
        await pool.request()
          .input('id_donacion_especie', sql.Int, id_donacion_especie)
          .input('cantidad_asignada',   sql.Decimal(18, 2), cantidad_asignada)
          .query(`
            UPDATE DonacionesEnEspecie
            SET cantidad_restante = cantidad_restante - @cantidad_asignada
            WHERE id_donacion_especie = @id_donacion_especie;
          `);
      }
    }

    return { success: true, id_paquete };
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

  // Obtener un paquete con sus items detallados y totales por artículo
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

    // Items detallados
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

    const items = itemsRes.recordset;
    paquete.items = items;

    // Totales por artículo
    const totalMap = {};
    for (const item of items) {
      const key = `${item.nombre_articulo} (${item.unidad})`;
      if (!totalMap[key]) {
        totalMap[key] = 0;
      }
      totalMap[key] += item.cantidad;
    }

    paquete.totales_por_articulo = Object.entries(totalMap).map(([nombre_articulo, total]) => ({
      nombre_articulo,
      total
    }));

    return paquete;
  }

  static async getAllWithDonaciones() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        p.id_paquete,
        p.nombre_paquete,
        p.descripcion,
        p.fecha_creacion,
        p.id_pedido,

        pd.id_donacion_especie,
        pd.cantidad_asignada
      FROM Paquetes p
      LEFT JOIN PaqueteDonaciones pd ON p.id_paquete = pd.id_paquete
    `);

    // Agrupar resultados por paquete
    const paquetesMap = {};

    result.recordset.forEach(row => {
      const {
        id_paquete, nombre_paquete, descripcion, fecha_creacion, id_pedido,
        id_donacion_especie, cantidad_asignada
      } = row;

      if (!paquetesMap[id_paquete]) {
        paquetesMap[id_paquete] = {
          id_paquete,
          nombre_paquete,
          descripcion,
          fecha_creacion,
          id_pedido,
          donaciones: []
        };
      }

      if (id_donacion_especie !== null) {
        paquetesMap[id_paquete].donaciones.push({
          id_donacion_especie,
          cantidad_asignada
        });
      }
    });

    return Object.values(paquetesMap);
  }

  // Actualizar datos básicos y items de un paquete
  static async update(id_paquete, nombre_paquete, descripcion, id_pedido, donaciones = []) {
    const pool = await poolPromise;

    await pool.request()
      .input('id_paquete',    sql.Int,   id_paquete)
      .input('nombre_paquete', sql.VarChar, nombre_paquete)
      .input('descripcion',     sql.Text,    descripcion)
      .input('id_pedido',       sql.Int,     id_pedido)
      .query(`
        UPDATE Paquetes
        SET nombre_paquete = @nombre_paquete,
            descripcion    = @descripcion,
            id_pedido      = @id_pedido
        WHERE id_paquete = @id_paquete;
      `);

    await pool.request()
      .input('id_paquete', sql.Int, id_paquete)
      .query(`DELETE FROM PaqueteDonaciones WHERE id_paquete = @id_paquete;`);

    let errorMessages = [];
    if (Array.isArray(donaciones) && donaciones.length) {
      const table = new sql.Table('PaqueteDonacionesType');
      table.columns.add('id_paquete',          sql.Int);
      table.columns.add('id_donacion_especie', sql.Int);
      table.columns.add('cantidad_asignada',   sql.Decimal(18, 2));

      for (let { id_donacion_especie, cantidad_asignada } of donaciones) {
        const info = await pool.request()
          .input('id_donacion_especie', sql.Int, id_donacion_especie)
          .query(`
            SELECT estado_articulo, cantidad_restante
            FROM DonacionesEnEspecie
            WHERE id_donacion_especie = @id_donacion_especie;
          `);
        if (!info.recordset.length) {
          errorMessages.push(`No existe la donación ${id_donacion_especie}.`);
          continue;
        }
        const { estado_articulo, cantidad_restante } = info.recordset[0];

        if (estado_articulo === 'sellado') {
          errorMessages.push(`La donación ${id_donacion_especie} está sellada y no es particionable.`);
          continue;
        }
        if (cantidad_asignada > cantidad_restante) {
          errorMessages.push(
            `La cantidad asignada (${cantidad_asignada}) para la donación ${id_donacion_especie} ` +
            `no puede ser mayor que la cantidad restante (${cantidad_restante}).`
          );
          continue;
        }
        if (cantidad_restante - cantidad_asignada < 0) {
          errorMessages.push(`La cantidad restante de la donación ${id_donacion_especie} no puede ser menor a 0.`);
          continue;
        }

        table.rows.add(id_paquete, id_donacion_especie, cantidad_asignada);
      }

      if (errorMessages.length) {
        return { success: false, errors: errorMessages };
      }

      await pool.request()
        .input('tvp', table)
        .query(`
          INSERT INTO PaqueteDonaciones (id_paquete, id_donacion_especie, cantidad_asignada)
          SELECT id_paquete, id_donacion_especie, cantidad_asignada FROM @tvp;
        `);

      for (let { id_donacion_especie, cantidad_asignada } of donaciones) {
        await pool.request()
          .input('id_donacion_especie', sql.Int, id_donacion_especie)
          .input('cantidad_asignada',   sql.Decimal(18, 2), cantidad_asignada)
          .query(`
            UPDATE DonacionesEnEspecie
            SET cantidad_restante = cantidad_restante - @cantidad_asignada
            WHERE id_donacion_especie = @id_donacion_especie;
          `);
      }
    }

    return { success: true, id_paquete };
  }

  static async getDonantesByNombrePaquete(nombre_paquete) {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('nombre_paquete', sql.VarChar, nombre_paquete)
      .query(`
        SELECT DISTINCT d.id_donante, d.nombres, d.apellido_paterno, d.apellido_materno
        FROM Paquetes p
        JOIN PaqueteDonaciones pd ON p.id_paquete = pd.id_paquete
        JOIN DonacionesEnEspecie deE ON pd.id_donacion_especie = deE.id_donacion_especie
        JOIN Donaciones don ON deE.id_donacion = don.id_donacion
        JOIN Donantes d ON don.id_donante = d.id_donante
        WHERE p.nombre_paquete = @nombre_paquete;
      `);

    return result.recordset;
  }


}

module.exports = PaquetesModel;
