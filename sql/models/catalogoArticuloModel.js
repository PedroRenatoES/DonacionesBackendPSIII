const { sql, poolPromise } = require(require('../config').dbConnection);
class CatalogoDeArticuloModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM CatalogoDeArticulos');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM CatalogoDeArticulos WHERE id_articulo = @id');
        return result.recordset[0];
    }

    static async getByCategoria(id_categoria) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .query('SELECT * FROM CatalogoDeArticulos WHERE id_categoria = @id_categoria');
        return result.recordset;
    }

    static async create(nombre_articulo, descripcion, id_categoria) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_articulo', sql.VarChar, nombre_articulo)
            .input('descripcion', sql.Text, descripcion)
            .input('id_categoria', sql.Int, id_categoria)
            .query('INSERT INTO CatalogoDeArticulos (nombre_articulo, descripcion, id_categoria) VALUES (@nombre_articulo, @descripcion, @id_categoria)');
    }

    static async update(id, nombre_articulo, descripcion, id_categoria) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_articulo', sql.VarChar, nombre_articulo)
            .input('descripcion', sql.Text, descripcion)
            .input('id_categoria', sql.Int, id_categoria)
            .query('UPDATE CatalogoDeArticulos SET nombre_articulo = @nombre_articulo, descripcion = @descripcion, id_categoria = @id_categoria WHERE id_articulo = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM CatalogoDeArticulos WHERE id_articulo = @id');
    }
}

module.exports = CatalogoDeArticuloModel;
