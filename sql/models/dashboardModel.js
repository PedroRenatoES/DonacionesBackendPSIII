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
                  de.id_donacion_especie,
                  d.id_donacion,
                  art.nombre_articulo,
                  de.cantidad_restante,
                  de.fecha_vencimiento
                FROM DonacionesEnEspecie de
                JOIN Donaciones d 
                  ON de.id_donacion = d.id_donacion
                JOIN CatalogoDeArticulos art 
                  ON de.id_articulo = art.id_articulo
                WHERE de.fecha_vencimiento IS NOT NULL
                  AND de.fecha_vencimiento <= DATEADD(DAY, 30, GETDATE())
                ORDER BY de.fecha_vencimiento ASC;
            `);
        return result.recordset;
    }

}

module.exports = DashboardModel;