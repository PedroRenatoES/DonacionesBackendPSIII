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

    static async getByCampanaId(id_campana) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_campana', sql.Int, id_campana)
            .query('SELECT * FROM PuntosDeRecoleccion WHERE id_campana = @id_campana');
        return result.recordset;
    }

    static async create(nombre_punto, direccion, id_campana) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_punto', sql.VarChar, nombre_punto)
            .input('direccion', sql.VarChar, direccion)
            .input('id_campana', sql.Int, id_campana)
            .query('INSERT INTO PuntosDeRecoleccion (nombre_punto, direccion, id_campana) VALUES (@nombre_punto, @direccion, @id_campana)');
    }

    static async update(id, nombre_punto, direccion, id_campana) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_punto', sql.VarChar, nombre_punto)
            .input('direccion', sql.VarChar, direccion)
            .input('id_campana', sql.Int, id_campana)
            .query('UPDATE PuntosDeRecoleccion SET nombre_punto = @nombre_punto, direccion = @direccion, id_campana = @id_campaña WHERE id_punto = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PuntosDeRecoleccion WHERE id_punto = @id');
    }
}

module.exports = PuntosDeRecoleccionModel;
