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
}

module.exports = DashboardModel;