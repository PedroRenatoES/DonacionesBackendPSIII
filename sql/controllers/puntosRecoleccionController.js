const PuntosDeRecoleccionModel = require('../models/puntosRecoleccionModel');

class PuntosDeRecoleccionController {
    static async getAll(req, res) {
        try {
            const puntos = await PuntosDeRecoleccionModel.getAll();
            res.json(puntos);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo puntos de recolección' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const punto = await PuntosDeRecoleccionModel.getById(id);
            if (punto) res.json(punto);
            else res.status(404).json({ error: 'Punto de recolección no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo punto de recolección' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre_punto, direccion, id_campaña } = req.body;
            await PuntosDeRecoleccionModel.create(nombre_punto, direccion, id_campaña);
            res.status(201).json({ message: 'Punto de recolección creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando punto de recolección' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_punto, direccion, id_campaña } = req.body;
            await PuntosDeRecoleccionModel.update(id, nombre_punto, direccion, id_campaña);
            res.json({ message: 'Punto de recolección actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando punto de recolección' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await PuntosDeRecoleccionModel.delete(id);
            res.json({ message: 'Punto de recolección eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando punto de recolección' });
        }
    }
}

module.exports = PuntosDeRecoleccionController;
