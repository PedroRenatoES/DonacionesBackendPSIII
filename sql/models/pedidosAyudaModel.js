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

    static async create(fecha_pedido, descripcion, estado_pedido, id_donante) {
        const pool = await poolPromise;
        await pool.request()
            .input('fecha_pedido', sql.DateTime, fecha_pedido)
            .input('descripcion', sql.Text, descripcion)
            .input('estado_pedido', sql.VarChar, estado_pedido)
            .input('id_donante', sql.Int, id_donante)
            .query('INSERT INTO PedidosDeAyuda (fecha_pedido, descripcion, estado_pedido, id_donante) VALUES (@fecha_pedido, @descripcion, @estado_pedido, @id_donante)');
    }

    static async update(id, fecha_pedido, descripcion, estado_pedido, id_donante) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('fecha_pedido', sql.DateTime, fecha_pedido)
            .input('descripcion', sql.Text, descripcion)
            .input('estado_pedido', sql.VarChar, estado_pedido)
            .input('id_donante', sql.Int, id_donante)
            .query('UPDATE PedidosDeAyuda SET fecha_pedido = @fecha_pedido, descripcion = @descripcion, estado_pedido = @estado_pedido, id_donante = @id_donante WHERE id_pedido = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PedidosDeAyuda WHERE id_pedido = @id');
    }
}

module.exports = PedidosDeAyudaModel;
