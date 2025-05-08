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

    static async create(nombre_almacen, ubicacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_almacen', sql.VarChar, nombre_almacen)
            .input('ubicacion', sql.VarChar, ubicacion)
            .query('INSERT INTO Almacenes (nombre_almacen, ubicacion) VALUES (@nombre_almacen, @ubicacion)');
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
