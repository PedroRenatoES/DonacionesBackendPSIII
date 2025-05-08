const { sql, poolPromise } = require(require('../config').dbConnection);

class UserModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Usuarios WHERE id_usuario = @id');
        return result.recordset[0];
    }

    static async create(nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contraseña, telefono, id_rol) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombres', sql.VarChar, nombres)
            .input('apellido_paterno', sql.VarChar, apellido_paterno)
            .input('apellido_materno', sql.VarChar, apellido_materno)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('direccion_domiciliaria', sql.VarChar, direccion_domiciliaria)
            .input('correo', sql.VarChar, correo)
            .input('contraseña', sql.VarChar, contraseña)
            .input('telefono', sql.VarChar, telefono)
            .input('id_rol', sql.Int, id_rol)
            .query('INSERT INTO Usuarios (nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contraseña, telefono, id_rol) VALUES (@nombres, @apellido_paterno, @apellido_materno, @fecha_nacimiento, @direccion_domiciliaria, @correo, @contraseña, @telefono, @id_rol)');
    }

    static async update(id, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contraseña, telefono, id_rol) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombres', sql.VarChar, nombres)
            .input('apellido_paterno', sql.VarChar, apellido_paterno)
            .input('apellido_materno', sql.VarChar, apellido_materno)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('direccion_domiciliaria', sql.VarChar, direccion_domiciliaria)
            .input('correo', sql.VarChar, correo)
            .input('contraseña', sql.VarChar, contraseña)
            .input('telefono', sql.VarChar, telefono)
            .input('id_rol', sql.Int, id_rol)
            .query('UPDATE Usuarios SET nombres = @nombres, apellido_paterno = @apellido_paterno, apellido_materno = @apellido_materno, fecha_nacimiento = @fecha_nacimiento, direccion_domiciliaria = @direccion_domiciliaria, correo = @correo, contraseña = @contraseña, telefono = @telefono, id_rol = @id_rol WHERE id_usuario = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Usuarios WHERE id_usuario = @id');
    }

    static async getByEmail(correo) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('correo', sql.VarChar, correo)
            .query('SELECT * FROM Usuarios WHERE correo = @correo');
        return result.recordset[0];
    }

}

module.exports = UserModel;
