const { sql, poolPromise } = require(require('../config').dbConnection);

class UserModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
                SELECT 
                u.id_usuario,
                u.nombres,
                u.apellido_paterno,
                u.apellido_materno,
                u.fecha_nacimiento,
                u.direccion_domiciliaria,
                u.correo,
                u.contrasena,
                u.id_rol,
                r.nombre_rol,
                u.telefono,
                u.ci,
                u.foto_ci,
                u.licencia_conducir,
                u.foto_licencia
            FROM Usuarios u
            INNER JOIN Roles r ON u.id_rol = r.id_rol
        `);
        return result.recordset;
    }

    static async getAllSimple() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT
                    nombres AS nombre,
                    apellido_paterno AS apellido,
                    correo AS email,
                    ci,
                    contrasena AS password,
                    telefono
                FROM Usuarios
            `);
        return result.recordset;
    }



    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Usuarios WHERE id_usuario = @id');
        return result.recordset[0];
    }

    static async create(nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contrasena, telefono, id_rol, ci, foto_ci, licencia_conducir, foto_licencia) {
        const pool = await poolPromise;
        await pool.request()
            .input('nombres', sql.VarChar, nombres)
            .input('apellido_paterno', sql.VarChar, apellido_paterno)
            .input('apellido_materno', sql.VarChar, apellido_materno)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('direccion_domiciliaria', sql.VarChar, direccion_domiciliaria)
            .input('correo', sql.VarChar, correo)
            .input('contrasena', sql.VarChar, contrasena)
            .input('telefono', sql.VarChar, telefono)
            .input('id_rol', sql.Int, id_rol)
            .input('ci', sql.VarChar(10), ci)
            .input('foto_ci', sql.VarChar(sql.MAX), foto_ci)
            .input('licencia_conducir', sql.VarChar(10), licencia_conducir)
            .input('foto_licencia', sql.VarChar(sql.MAX), foto_licencia)
            .query(`
                INSERT INTO Usuarios (
                    nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contrasena, telefono, id_rol, ci, foto_ci, licencia_conducir, foto_licencia
                ) VALUES (
                    @nombres, @apellido_paterno, @apellido_materno, @fecha_nacimiento, @direccion_domiciliaria, @correo, @contrasena, @telefono, @id_rol, @ci, @foto_ci, @licencia_conducir, @foto_licencia
                )
            `);

            try {
                await axios.post('http://34.9.138.238:2020/global_registro/alasD', {
                    nombres: nombres,
                    apellido: `${apellido_paterno} ${apellido_materno}`,
                    email: correo,
                    ci: ci,
                    password: contrasena,
                    telefono: telefono
                });
            } catch (error) {
                console.error('Error enviando datos al endpoint externo:', error.message);
            }

    }

    static async createSimple(nombre, apellido, email, ci, password, telefono) {
    const pool = await poolPromise;
    await pool.request()
        .input('nombres', sql.VarChar, nombre)
        .input('apellido_paterno', sql.VarChar, apellido)
        .input('correo', sql.VarChar, email)
        .input('ci', sql.VarChar, ci)
        .input('contrasena', sql.VarChar, password)
        .input('telefono', sql.VarChar, telefono)
        .query(`
            INSERT INTO Usuarios (
                nombres,
                apellido_paterno,
                correo,
                ci,
                contrasena,
                telefono,
                id_rol,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                licencia_conducir
            )
            VALUES (
                @nombres,
                @apellido_paterno,
                @correo,
                @ci,
                @contrasena,
                @telefono,
                1,
                NULL,
                NULL,
                NULL,
                NULL
            )
        `);
    }



    static async update(id, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, direccion_domiciliaria, correo, contrasena, telefono, id_rol, ci, foto_ci, licencia_conducir, foto_licencia) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombres', sql.VarChar, nombres)
            .input('apellido_paterno', sql.VarChar, apellido_paterno)
            .input('apellido_materno', sql.VarChar, apellido_materno)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('direccion_domiciliaria', sql.VarChar, direccion_domiciliaria)
            .input('correo', sql.VarChar, correo)
            .input('contrasena', sql.VarChar, contrasena)
            .input('telefono', sql.VarChar, telefono)
            .input('id_rol', sql.Int, id_rol)
            .input('ci', sql.VarChar(10), ci)
            .input('foto_ci', sql.VarChar(sql.MAX), foto_ci)
            .input('licencia_conducir', sql.VarChar(10), licencia_conducir)
            .input('foto_licencia', sql.VarChar(sql.MAX), foto_licencia)
            .query(`
                UPDATE Usuarios SET
                    nombres = @nombres,
                    apellido_paterno = @apellido_paterno,
                    apellido_materno = @apellido_materno,
                    fecha_nacimiento = @fecha_nacimiento,
                    direccion_domiciliaria = @direccion_domiciliaria,
                    correo = @correo,
                    contrasena = @contrasena,
                    telefono = @telefono,
                    id_rol = @id_rol,
                    ci = @ci,
                    foto_ci = @foto_ci,
                    licencia_conducir = @licencia_conducir,
                    foto_licencia = @foto_licencia
                WHERE id_usuario = @id
            `);
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Usuarios WHERE id_usuario = @id');
    }

    static async getByCi(ci) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('ci', sql.Int, ci)
        .query('SELECT * FROM Usuarios WHERE ci = @ci');
    return result.recordset[0];
}

}

module.exports = UserModel;
