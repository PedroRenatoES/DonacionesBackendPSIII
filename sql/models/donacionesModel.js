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

            const especieResult = await pool.request()
                .input('id_donacion', sql.Int, id_donacion)
                .input('id_articulo', sql.Int, null)
                .input('id_espacio', sql.Int, null)
                .input('id_unidad', sql.Int, id_unidad)                // <- input para unidad
                .input('cantidad', sql.Decimal(18,2), null)            // ajustar a DECIMAL
                .input('estado_articulo', sql.VarChar(100), 'sin asignar')
                .input('cantidad_restante', sql.Decimal(18, 2), null)  // NUEVO: cantidad restante
                .input('fecha_vencimiento', sql.Date, null)            // NUEVO: fecha_vencimiento (opcional)
                .query(`    
                INSERT INTO DonacionesEnEspecie
                    (id_donacion, id_articulo, id_espacio, id_unidad, cantidad, estado_articulo, cantidad_restante, fecha_vencimiento)
                VALUES
                    (@id_donacion, @id_articulo, @id_espacio, @id_unidad, @cantidad, @estado_articulo, @cantidad_restante, @fecha_vencimiento);
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
    
    

    static async update(
        id_donacion_especie,  // ✅ Cambiar el nombre del parámetro
        id_donante = null,
        id_campana = null,
        id_articulo = null,
        cantidad = null,
        estado_articulo = null,
        fecha_vencimiento = null
    ) {
        try {
            const pool = await poolPromise;
            
            console.log('📝 Iniciando actualización con datos:', {
                id_donacion_especie,  // ✅ Cambiado
                id_donante,
                id_campana,
                id_articulo,
                cantidad,
                estado_articulo,
                fecha_vencimiento
            });

            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                // PRIMERO: Obtener el id_donacion desde DonacionesEnEspecie
                const donacionInfo = await new sql.Request(transaction)
                    .input('id_donacion_especie', sql.Int, id_donacion_especie)
                    .query(`
                        SELECT id_donacion, cantidad, cantidad_restante
                        FROM DonacionesEnEspecie
                        WHERE id_donacion_especie = @id_donacion_especie
                    `);

                if (donacionInfo.recordset.length === 0) {
                    throw new Error(`No se encontró la donación en especie con ID: ${id_donacion_especie}`);
                }

                const { id_donacion, cantidad: cantidadActual, cantidad_restante: restanteActual } = donacionInfo.recordset[0];
                console.log('🔍 ID Donación encontrado:', id_donacion);

                // 1. Actualizar tabla Donaciones (donante, campaña)
                if (id_donante !== null || id_campana !== null) {
                    console.log('🔄 Actualizando tabla Donaciones...');
                    
                    let updateFields = [];
                    const request = new sql.Request(transaction);
                    request.input('id_donacion', sql.Int, id_donacion);  // ✅ Usar el id_donacion obtenido

                    if (id_donante !== null && id_donante !== '') {
                        request.input('id_donante', sql.Int, id_donante);
                        updateFields.push('id_donante = @id_donante');
                    }

                    if (id_campana !== null && id_campana !== '') {
                        request.input('id_campana', sql.Int, id_campana);
                        updateFields.push('id_campana = @id_campana');
                    }

                    if (updateFields.length > 0) {
                        const query = `
                            UPDATE Donaciones 
                            SET ${updateFields.join(', ')}
                            WHERE id_donacion = @id_donacion
                        `;
                        console.log('📋 Query Donaciones:', query);
                        const result = await request.query(query);
                        console.log('✅ Donaciones actualizadas:', result.rowsAffected);
                    }
                }

                // 2. Actualizar DonacionesEnEspecie (artículo, cantidad, estado, fecha_vencimiento)
                if (id_articulo !== null || cantidad !== null || estado_articulo !== null || fecha_vencimiento !== null) {
                    console.log('🔄 Actualizando tabla DonacionesEnEspecie...');
                    
                    const request = new sql.Request(transaction);
                    request.input('id_donacion_especie', sql.Int, id_donacion_especie);  // ✅ Usar id_donacion_especie

                    // Construcción dinámica del SET
                    let setClauses = [];
                    
                    if (id_articulo !== null && id_articulo !== '') {
                        request.input('id_articulo', sql.Int, id_articulo);
                        setClauses.push('id_articulo = @id_articulo');
                    }

                    if (cantidad !== null && cantidad !== '') {
                        const cantidadNum = parseFloat(cantidad);
                        request.input('cantidad', sql.Decimal(18, 2), cantidadNum);
                        setClauses.push('cantidad = @cantidad');

                        // Lógica para cantidad_restante
                        if (cantidadNum < parseFloat(restanteActual)) {
                            request.input('cantidad_restante', sql.Decimal(18, 2), cantidadNum);
                            setClauses.push('cantidad_restante = @cantidad_restante');
                            console.log('🔄 Ajustando cantidad_restante a:', cantidadNum);
                        }
                    }

                    if (estado_articulo !== null && estado_articulo !== '') {
                        request.input('estado_articulo', sql.VarChar(100), estado_articulo);
                        setClauses.push('estado_articulo = @estado_articulo');
                    }

                    if (fecha_vencimiento !== null && fecha_vencimiento !== '') {
                        request.input('fecha_vencimiento', sql.Date, fecha_vencimiento);
                        setClauses.push('fecha_vencimiento = @fecha_vencimiento');
                    }

                    // Solo ejecutar si hay algo para actualizar
                    if (setClauses.length > 0) {
                        const query = `
                            UPDATE DonacionesEnEspecie
                            SET ${setClauses.join(', ')}
                            WHERE id_donacion_especie = @id_donacion_especie
                        `;
                        console.log('📋 Query DonacionesEnEspecie:', query);
                        const result = await request.query(query);
                        console.log('✅ DonacionesEnEspecie actualizadas:', result.rowsAffected);
                    } else {
                        console.log('ℹ️  No hay campos para actualizar en DonacionesEnEspecie');
                    }
                }

                await transaction.commit();
                console.log('🎉 Transacción completada exitosamente');
                return { success: true, message: 'Donación actualizada correctamente' };

            } catch (error) {
                await transaction.rollback();
                console.error('❌ Error en transacción, haciendo rollback:', error);
                throw error;
            }

        } catch (error) {
            console.error('🔥 Error general en update:', error);
            throw error;
        }
    }


    static async updateEstado(id, estado_validacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado_validacion', sql.VarChar, estado_validacion) // Nuevo parámetro
            .query('UPDATE Donaciones SET estado_validacion = @estado_validacion WHERE id_donacion = @id');
    }

    static async delete(id_donacion_especie) {
        try {
            const pool = await poolPromise;
            
            console.log('🗑️ Iniciando eliminación de donación en especie:', id_donacion_especie);

            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                // PRIMERO: Obtener información completa de la donación
                const donacionInfo = await new sql.Request(transaction)
                    .input('id_donacion_especie', sql.Int, id_donacion_especie)
                    .query(`
                        SELECT 
                            id_donacion, 
                            cantidad, 
                            cantidad_restante,
                            fecha_vencimiento,
                            estado_articulo
                        FROM DonacionesEnEspecie
                        WHERE id_donacion_especie = @id_donacion_especie
                    `);

                if (donacionInfo.recordset.length === 0) {
                    throw new Error(`No se encontró la donación en especie con ID: ${id_donacion_especie}`);
                }

                const { 
                    id_donacion, 
                    cantidad, 
                    cantidad_restante, 
                    fecha_vencimiento,
                    estado_articulo 
                } = donacionInfo.recordset[0];
                
                console.log('🔍 Información de la donación a eliminar:', { 
                    id_donacion, 
                    cantidad, 
                    cantidad_restante, 
                    fecha_vencimiento,
                    estado_articulo 
                });

                // ✅ VALIDACIÓN 1: Verificar si se ha utilizado parte de la donación
                const seHaUtilizado = parseFloat(cantidad_restante) !== parseFloat(cantidad);
                
                if (seHaUtilizado) {
                    console.log('⚠️  La donación ha sido utilizada, verificando vencimiento...');
                    
                    // ✅ VALIDACIÓN 2: Si se ha utilizado, verificar si está vencida
                    if (fecha_vencimiento) {
                        const fechaVencimiento = new Date(fecha_vencimiento);
                        const fechaActual = new Date();
                        
                        // Verificar si ya venció (la fecha de vencimiento es anterior a hoy)
                        const yaVencido = fechaVencimiento < fechaActual;
                        
                        if (!yaVencido) {
                            throw new Error(`No se puede eliminar la donación porque:
    • Ya se ha utilizado parte del inventario (${cantidad_restante}/${cantidad} restantes)
    • El artículo aún no ha vencido (vencimiento: ${fecha_vencimiento})
    • Solo se pueden eliminar donaciones no utilizadas O artículos vencidos que ya fueron utilizados`);
                        }
                        
                        console.log('✅ Donación vencida y utilizada - procediendo con eliminación');
                    } else {
                        // Si no tiene fecha de vencimiento pero se ha utilizado, no se puede eliminar
                        throw new Error(`No se puede eliminar la donación porque:
    • Ya se ha utilizado parte del inventario (${cantidad_restante}/${cantidad} restantes)
    • El artículo no tiene fecha de vencimiento
    • Solo se pueden eliminar donaciones no utilizadas O artículos vencidos que ya fueron utilizados`);
                    }
                } else {
                    console.log('✅ Donación no ha sido utilizada - procediendo con eliminación');
                }

                // 1. Eliminar de DonacionesEnEspecie
                console.log('🔄 Eliminando de DonacionesEnEspecie...');
                const deleteEspecieResult = await new sql.Request(transaction)
                    .input('id_donacion_especie', sql.Int, id_donacion_especie)
                    .query(`
                        DELETE FROM DonacionesEnEspecie
                        WHERE id_donacion_especie = @id_donacion_especie
                    `);

                console.log('✅ Registros eliminados de DonacionesEnEspecie:', deleteEspecieResult.rowsAffected);

                // 2. Verificar si hay más donaciones en especie para el mismo id_donacion
                const donacionesRestantes = await new sql.Request(transaction)
                    .input('id_donacion', sql.Int, id_donacion)
                    .query(`
                        SELECT COUNT(*) as count
                        FROM DonacionesEnEspecie
                        WHERE id_donacion = @id_donacion
                    `);

                const tieneMasDonaciones = donacionesRestantes.recordset[0].count > 0;

                // 3. Si no hay más donaciones en especie, eliminar de Donaciones también
                if (!tieneMasDonaciones) {
                    console.log('🔄 No hay más donaciones en especie, eliminando de Donaciones...');
                    
                    // Primero verificar si es una donación en dinero
                    const donacionDinero = await new sql.Request(transaction)
                        .input('id_donacion', sql.Int, id_donacion)
                        .query(`
                            SELECT COUNT(*) as count
                            FROM DonacionesEnDinero
                            WHERE id_donacion = @id_donacion
                        `);

                    const esDonacionDinero = donacionDinero.recordset[0].count > 0;

                    // Solo eliminar de Donaciones si no es una donación en dinero
                    if (!esDonacionDinero) {
                        const deleteDonacionResult = await new sql.Request(transaction)
                            .input('id_donacion', sql.Int, id_donacion)
                            .query(`
                                DELETE FROM Donaciones
                                WHERE id_donacion = @id_donacion
                            `);
                        
                        console.log('✅ Registros eliminados de Donaciones:', deleteDonacionResult.rowsAffected);
                    } else {
                        console.log('ℹ️  La donación principal se mantiene porque tiene registro en DonacionesEnDinero');
                    }
                } else {
                    console.log('ℹ️  La donación principal se mantiene porque tiene más registros en DonacionesEnEspecie');
                }

                await transaction.commit();
                console.log('🎉 Eliminación completada exitosamente');
                
                return { 
                    success: true, 
                    message: seHaUtilizado 
                        ? 'Donación vencida eliminada correctamente' 
                        : 'Donación no utilizada eliminada correctamente',
                    detalles: {
                        eliminado_especie: deleteEspecieResult.rowsAffected[0],
                        cantidad_eliminada: cantidad_restante,
                        tipo: seHaUtilizado ? 'vencida' : 'no_utilizada'
                    }
                };

            } catch (error) {
                await transaction.rollback();
                console.error('❌ Error en transacción, haciendo rollback:', error);
                throw error;
            }

        } catch (error) {
            console.error('🔥 Error general en delete:', error);
            throw error;
        }
    }
    
}

module.exports = DonacionesModel;
