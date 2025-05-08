const { sql, poolPromise } = require(require('../config').dbConnection);

class DonanteModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Donantes');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Donantes WHERE id_donante = @id');
        return result.recordset[0];
    }

static async create(nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('nombres', sql.VarChar, nombres)
        .input('apellido_paterno', sql.VarChar, apellido_paterno)
        .input('apellido_materno', sql.VarChar, apellido_materno)
        .input('correo', sql.VarChar, correo)
        .input('telefono', sql.VarChar, telefono)
        .input('usuario', sql.VarChar, usuario)
        .input('contraseña_hash', sql.VarChar, contraseña_hash)
        .query(`INSERT INTO Donantes (nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash)
                OUTPUT INSERTED.id_donante
                VALUES (@nombres, @apellido_paterno, @apellido_materno, @correo, @telefono, @usuario, @contraseña_hash)`);

    return result.recordset[0].id_donante; // devuelve el id_donante insertado
}


    static async update(id, nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombres', sql.VarChar, nombres)
            .input('apellido_paterno', sql.VarChar, apellido_paterno)
            .input('apellido_materno', sql.VarChar, apellido_materno)
            .input('correo', sql.VarChar, correo)
            .input('telefono', sql.VarChar, telefono)
            .input('usuario', sql.VarChar, usuario)
            .input('contraseña_hash', sql.VarChar, contraseña_hash)
            .query('UPDATE Donantes SET nombres = @nombres, apellido_paterno = @apellido_paterno, apellido_materno = @apellido_materno, correo = @correo, telefono = @telefono, usuario = @usuario, contraseña_hash = @contraseña_hash WHERE id_donante = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Donantes WHERE id_donante = @id');
    }
}

module.exports = DonanteModel;