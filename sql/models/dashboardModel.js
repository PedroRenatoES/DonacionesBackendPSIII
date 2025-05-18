const { sql, poolPromise } = require(require('../config').dbConnection);

class DashboardModel {
    static async getTotalDonaciones() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT COUNT(*) AS total FROM Donaciones');
        return result.recordset[0].total;
    }

    static async getDonantesActivos() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT COUNT(DISTINCT id_donante) AS activos FROM Donaciones');
        return result.recordset[0].activos;
    }

    static async getDonacionesPorMes(anio) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('anio', sql.Int, anio)
            .query(`
                SELECT MONTH(fecha_donacion) AS mes, COUNT(*) AS cantidad
                FROM Donaciones
                WHERE YEAR(fecha_donacion) = @anio
                GROUP BY MONTH(fecha_donacion)
                ORDER BY mes
            `);
        return result.recordset;
    }

    static async getTipoDonaciones() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT tipo_donacion, COUNT(*) AS cantidad
                FROM Donaciones
                GROUP BY tipo_donacion
            `);
        return result.recordset;
    }

    static async getActividadReciente() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT TOP 10 *
                FROM Donaciones
                ORDER BY fecha_donacion DESC
            `);
        return result.recordset;
    }

    static async getDonacionesPorPuntos() {
    const pool = await poolPromise;
    const result = await pool.request()
        .query(`
            SELECT 
                P.nombre_punto,
                COUNT(D.id_donacion) AS cantidad_donaciones
            FROM PuntosDeRecoleccion P
            LEFT JOIN Donaciones D ON P.id_punto = D.id_donacion
            GROUP BY P.nombre_punto
            ORDER BY cantidad_donaciones DESC
        `);
    return result.recordset;
}

static async getDonacionesDineroPorPuntos() {
    const pool = await poolPromise;
    const result = await pool.request()
        .query(`
            SELECT 
                P.nombre_punto,
                COUNT(Din.id_donacion_dinero) AS cantidad_donaciones_dinero
            FROM PuntosDeRecoleccion P
            JOIN Campanas C ON P.id_campana = C.id_campana
            JOIN Donaciones D ON D.id_campana = C.id_campana
            JOIN DonacionesEnDinero Din ON D.id_donacion = Din.id_donacion
            GROUP BY P.nombre_punto
            ORDER BY cantidad_donaciones_dinero DESC
        `);
    return result.recordset;
}

static async getDonacionesEspeciePorPuntos() {
    const pool = await poolPromise;
    const result = await pool.request()
        .query(`
            SELECT 
                P.nombre_punto,
                COUNT(Es.id_donacion_especie) AS cantidad_donaciones_especie
            FROM PuntosDeRecoleccion P
            JOIN Campanas C ON P.id_campana = C.id_campana
            JOIN Donaciones D ON D.id_campana = C.id_campana
            JOIN DonacionesEnEspecie Es ON D.id_donacion = Es.id_donacion
            GROUP BY P.nombre_punto
            ORDER BY cantidad_donaciones_especie DESC
        `);
    return result.recordset;
}

    static async getDonacionesPorVencer() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    dee.id_donacion_especie,
                    dee.id_donacion,
                    don.nombres,
                    don.apellido_paterno,
                    don.apellido_materno,
                    dee.id_articulo,
                    art.nombre_articulo,
                    dee.id_espacio,
                    dee.id_unidad,
                    dee.cantidad,
                    dee.cantidad_restante,
                    dee.estado_articulo,
                    dee.fecha_vencimiento
                FROM DonacionesEnEspecie dee
                INNER JOIN Donaciones d ON dee.id_donacion = d.id_donacion
                INNER JOIN Donantes don ON d.id_donante = don.id_donante
                INNER JOIN CatalogoDeArticulos art ON dee.id_articulo = art.id_articulo
                WHERE dee.fecha_vencimiento IS NOT NULL
                AND dee.fecha_vencimiento <= DATEADD(DAY, 30, GETDATE())
                ORDER BY dee.fecha_vencimiento ASC;
            `);
        return result.recordset;
    }

}

module.exports = DashboardModel;