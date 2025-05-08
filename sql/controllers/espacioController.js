const EspacioModel = require('../models/espacioModel');

class EspacioController {
    static async getByEstante(req, res) {
        try {
            const { id_estante } = req.params;
            const espacios = await EspacioModel.getByEstante(id_estante);
            res.json(espacios);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo espacios del estante' });
        }
    }

    static async getByAlmacen(req, res) {
            try {
                const { id_almacen } = req.params;
                const espacios = await EspacioModel.getByAlmacen(id_almacen);
                res.json(espacios);
            } catch (error) {
                console.error('Error al obtener espacios por almacén:', error);
                res.status(500).json({ error: 'Error al obtener espacios' });
            }
    }

    static async getAll(req, res) {
        try {
            const espacios = await EspacioModel.getAll();
            res.json(espacios);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo todos los espacios' });
        }
    }
}

module.exports = EspacioController;
