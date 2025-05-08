const { sql, poolPromise } = require(require('../config').dbConnection);

class DonacionesModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Donaciones');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Donaciones WHERE id_donacion = @id');
        return result.recordset[0];
    }

    static async create(
        tipo_donacion,
        fecha_donacion,
        id_donante,
        id_campana,
        estado_validacion = 'pendiente',
        id_unidad = null     // <- nuevo parámetro
    ) {
        try {
            const pool = await poolPromise;

            // Inserto la donación general
            const result = await pool.request()
            .input('tipo_donacion', sql.VarChar, tipo_donacion)
            .input('fecha_donacion', sql.DateTime, fecha_donacion)
            .input('id_donante', sql.Int, id_donante)
            .input('id_campana', sql.Int, id_campana)
            .input('estado_validacion', sql.VarChar, estado_validacion)
            .query(`
                INSERT INTO Donaciones (tipo_donacion, fecha_donacion, id_donante, id_campana, estado_validacion)
                VALUES (@tipo_donacion, @fecha_donacion, @id_donante, @id_campana, @estado_validacion);
                SELECT SCOPE_IDENTITY() AS id_donacion;
            `);

            const id_donacion = result.recordset[0].id_donacion;
            console.log('Nueva donación creada con ID:', id_donacion);

            let id_resultado = id_donacion;

            if (tipo_donacion === 'especie') {
            // Inserto la fila en DonacionesEnEspecie, incluyendo id_unidad
            const especieResult = await pool.request()
                .input('id_donacion', sql.Int, id_donacion)
                .input('id_articulo', sql.Int, null)
                .input('id_espacio', sql.Int, null)
                .input('id_unidad', sql.Int, id_unidad)                // <- input para unidad
                .input('cantidad', sql.Decimal(18,2), null)            // ajustar a DECIMAL
                .input('estado_articulo', sql.VarChar(100), 'sin asignar')
                .input('destino_donacion', sql.Text, 'sin asignar')
                .query(`
                INSERT INTO DonacionesEnEspecie
                    (id_donacion, id_articulo, id_espacio, id_unidad, cantidad, estado_articulo, destino_donacion)
                VALUES
                    (@id_donacion, @id_articulo, @id_espacio, @id_unidad, @cantidad, @estado_articulo, @destino_donacion);
                SELECT SCOPE_IDENTITY() AS id_donacion_especie;
                `);

            id_resultado = especieResult.recordset[0].id_donacion_especie;

            } else if (tipo_donacion === 'dinero') {
            const dineroResult = await pool.request()
                .input('id_donacion', sql.Int, id_donacion)
                .input('monto', sql.Decimal(18,2), null)
                .input('divisa', sql.VarChar, 'n/a')
                .input('nombre_cuenta', sql.VarChar, 'sin asignar')
                .input('numero_cuenta', sql.VarChar, 'sin asignar')
                .input('comprobante_url', sql.VarChar, 'sin asignar')
                .query(`
                INSERT INTO DonacionesEnDinero
                    (id_donacion, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url)
                VALUES
                    (@id_donacion, @monto, @divisa, @nombre_cuenta, @numero_cuenta, @comprobante_url);
                SELECT SCOPE_IDENTITY() AS id_donacion_dinero;
                `);

            id_resultado = dineroResult.recordset[0].id_donacion_dinero;
            }

            return id_resultado;

        } catch (error) {
            console.error('🔥 Error en create:', error);
            throw error;
        }
    }
    
    

    static async update(id, tipo_donacion, fecha_donacion, id_donante, id_campana, id_almacen, estado_validacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo_donacion', sql.VarChar, tipo_donacion)
            .input('fecha_donacion', sql.DateTime, fecha_donacion)
            .input('id_donante', sql.Int, id_donante)
            .input('id_campana', sql.Int, id_campana)
            .input('id_almacen', sql.Int, id_almacen)
            .input('estado_validacion', sql.VarChar, estado_validacion) // Nuevo parámetro
            .query('UPDATE Donaciones SET tipo_donacion = @tipo_donacion, fecha_donacion = @fecha_donacion, id_donante = @id_donante, ' +
                'id_campana = @id_campana, id_almacen = @id_almacen, estado_validacion = @estado_validacion ' +
                'WHERE id_donacion = @id');
    }
    static async updateEstado(id, estado_validacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado_validacion', sql.VarChar, estado_validacion) // Nuevo parámetro
            .query('UPDATE Donaciones SET estado_validacion = @estado_validacion WHERE id_donacion = @id');
    }

    static async delete(id) {
        const pool = await poolPromise;

        await pool.request()
            .input('id_donacion', sql.Int, id)
            .query('DELETE FROM DonacionesEnDinero WHERE id_donacion = @id_donacion');

        await pool.request()
            .input('id_donacion', sql.Int, id)
            .query('DELETE FROM DonacionesEnEspecie WHERE id_donacion = @id_donacion');

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Donaciones WHERE id_donacion = @id');
    }
    
}

module.exports = DonacionesModel;
