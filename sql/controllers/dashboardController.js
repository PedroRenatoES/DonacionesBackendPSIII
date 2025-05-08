const DashboardModel = require('../models/dashboardModel');

class DashboardController {
    static async totalDonaciones(req, res) {
        try {
            const total = await DashboardModel.getTotalDonaciones();
            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo total de donaciones' });
        }
    }

    static async donantesActivos(req, res) {
        try {
            const activos = await DashboardModel.getDonantesActivos();
            res.json({ activos });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donantes activos' });
        }
    }

    static async donacionesPorMes(req, res) {
        try {
            const { anio } = req.params;
            const data = await DashboardModel.getDonacionesPorMes(parseInt(anio));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donaciones por mes' });
        }
    }

    static async tipoDonaciones(req, res) {
        try {
            const data = await DashboardModel.getTipoDonaciones();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo tipos de donación' });
        }
    }

    static async actividadReciente(req, res) {
        try {
            const data = await DashboardModel.getActividadReciente();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo actividad reciente' });
        }
    }
}

module.exports = DashboardController;