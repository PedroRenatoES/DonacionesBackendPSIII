const { sql, poolPromise } = require(require('../config').dbConnection);

class PedidosDeAyudaModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM PedidosDeAyuda');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PedidosDeAyuda WHERE id_pedido = @id');
        return result.recordset[0];
    }

static async create(fecha_pedido, descripcion, ubicacion, latitud_destino, longitud_destino, id_donacion) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('fecha_pedido', sql.Date, fecha_pedido)
        .input('descripcion', sql.Text, descripcion)
        .input('ubicacion', sql.Text, ubicacion)
        .input('latitud_destino', sql.Decimal(10, 7), latitud_destino)
        .input('longitud_destino', sql.Decimal(10, 7), longitud_destino)
        .input('id_donacion', sql.VarChar(50), id_donacion)
        .query(`
            INSERT INTO PedidosDeAyuda (
                fecha_pedido,
                descripcion,
                ubicacion,
                latitud_destino,
                longitud_destino,
                id_donacion
            )
            OUTPUT INSERTED.*
            VALUES (
                @fecha_pedido,
                @descripcion,
                @ubicacion,
                @latitud_destino,
                @longitud_destino,
                @id_donacion
            )
        `);

    return result.recordset[0]; // ← Devuelve el objeto completo, incluyendo el ID generado
}




    static async update(id, fecha_pedido, descripcion, estado_pedido, id_donante, ubicacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('fecha_pedido', sql.DateTime, fecha_pedido)
            .input('descripcion', sql.Text, descripcion)
            .input('estado_pedido', sql.VarChar, estado_pedido)
            .input('id_donante', sql.Int, id_donante)
            .input('ubicacion', sql.Text, ubicacion)    // NUEVO: campo ubicacion
            .query('UPDATE PedidosDeAyuda SET fecha_pedido = @fecha_pedido, descripcion = @descripcion, estado_pedido = @estado_pedido, id_donante = @id_donante, ubicacion = @ubicacion WHERE id_pedido = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PedidosDeAyuda WHERE id_pedido = @id');
    }
}

module.exports = PedidosDeAyudaModel;
