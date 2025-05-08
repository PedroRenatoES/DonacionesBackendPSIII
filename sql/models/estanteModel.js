const { sql, poolPromise } = require(require('../config').dbConnection);

class EstanteModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Estante');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Estante WHERE id_estante = @id');
        return result.recordset[0];
    }

    static async create(id_almacen, nombre, cantidad_filas, cantidad_columnas) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_almacen', sql.Int, id_almacen)
            .input('nombre', sql.VarChar, nombre)
            .input('cantidad_filas', sql.Int, cantidad_filas)
            .input('cantidad_columnas', sql.Int, cantidad_columnas)
            .query(`
                INSERT INTO Estante (id_almacen, nombre, cantidad_filas, cantidad_columnas)
                OUTPUT INSERTED.id_estante
                VALUES (@id_almacen, @nombre, @cantidad_filas, @cantidad_columnas)
            `);

        const id_estante = result.recordset[0].id_estante;

        // Insertar los espacios
        for (let fila = 0; fila < cantidad_filas; fila++) {
            const letra = String.fromCharCode(65 + fila); // A, B, C...
            for (let columna = 1; columna <= cantidad_columnas; columna++) {
                const codigo = `${letra}${columna}`;
                await pool.request()
                    .input('id_estante', sql.Int, id_estante)
                    .input('codigo', sql.VarChar, codigo)
                    .input('lleno', sql.Bit, 0) // Inicialmente vacío
                    .query(`
                        INSERT INTO Espacios (id_estante, codigo, lleno)
                        VALUES (@id_estante, @codigo, @lleno)
                    `);
            }
        }
    }

    static async update(id, id_almacen, nombre, cantidad_filas, cantidad_columnas) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('id_almacen', sql.Int, id_almacen)
            .input('nombre', sql.VarChar, nombre)
            .input('cantidad_filas', sql.Int, cantidad_filas)
            .input('cantidad_columnas', sql.Int, cantidad_columnas)
            .query('UPDATE Estante SET id_almacen = @id_almacen, nombre = @nombre, cantidad_filas = @cantidad_filas, cantidad_columnas = @cantidad_columnas WHERE id_estante = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id_estante', sql.Int, id)
            .query('DELETE FROM Espacios WHERE id_estante = @id_estante');

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Estante WHERE id_estante = @id');
    }
}

module.exports = EstanteModel;
