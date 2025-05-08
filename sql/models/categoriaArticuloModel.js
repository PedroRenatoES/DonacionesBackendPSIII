const { sql, poolPromise } = require(require('../config').dbConnection);

class CategoriaDeArticuloModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM CategoriasDeArticulos');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM CategoriasDeArticulos WHERE id_categoria = @id');
        return result.recordset[0];
    }

    static async create(nombre_categoria) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_categoria', sql.VarChar, nombre_categoria)
            .query('INSERT INTO CategoriasDeArticulos (nombre_categoria) VALUES (@nombre_categoria)');
    }

    static async update(id, nombre_categoria) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_categoria', sql.VarChar, nombre_categoria)
            .query('UPDATE CategoriasDeArticulos SET nombre_categoria = @nombre_categoria WHERE id_categoria = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM CategoriasDeArticulos WHERE id_categoria = @id');
    }
}

module.exports = CategoriaDeArticuloModel;
