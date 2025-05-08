const { sql, poolPromise } = require(require('../config').dbConnection);

class RoleModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Roles');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Roles WHERE id_rol = @id');
        return result.recordset[0];
    }

    static async create(nombre_rol, descripcion) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_rol', sql.VarChar, nombre_rol)
            .input('descripcion', sql.Text, descripcion)
            .query('INSERT INTO Roles (nombre_rol, descripcion) VALUES (@nombre_rol, @descripcion)');
    }

    static async update(id, nombre_rol, descripcion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_rol', sql.VarChar, nombre_rol)
            .input('descripcion', sql.Text, descripcion)
            .query('UPDATE Roles SET nombre_rol = @nombre_rol, descripcion = @descripcion WHERE id_rol = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Roles WHERE id_rol = @id');
    }
}

module.exports = RoleModel;