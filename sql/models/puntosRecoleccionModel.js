const { sql, poolPromise } = require(require('../config').dbConnection);

class PuntosDeRecoleccionModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM PuntosDeRecoleccion');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PuntosDeRecoleccion WHERE id_punto = @id');
        return result.recordset[0];
    }

    static async create(nombre_punto, direccion, id_campaña) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_punto', sql.VarChar, nombre_punto)
            .input('direccion', sql.VarChar, direccion)
            .input('id_campaña', sql.Int, id_campaña)
            .query('INSERT INTO PuntosDeRecoleccion (nombre_punto, direccion, id_campaña) VALUES (@nombre_punto, @direccion, @id_campaña)');
    }

    static async update(id, nombre_punto, direccion, id_campaña) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_punto', sql.VarChar, nombre_punto)
            .input('direccion', sql.VarChar, direccion)
            .input('id_campaña', sql.Int, id_campaña)
            .query('UPDATE PuntosDeRecoleccion SET nombre_punto = @nombre_punto, direccion = @direccion, id_campaña = @id_campaña WHERE id_punto = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PuntosDeRecoleccion WHERE id_punto = @id');
    }
}

module.exports = PuntosDeRecoleccionModel;
