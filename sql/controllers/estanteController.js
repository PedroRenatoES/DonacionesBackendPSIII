const EstanteModel = require('../models/estanteModel');

class EstanteController {
    static async getAll(req, res) {
        try {
            const estantes = await EstanteModel.getAll();
            res.json(estantes);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo estantes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const estante = await EstanteModel.getById(id);
            if (estante) res.json(estante);
            else res.status(404).json({ error: 'Estante no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo estante' });
        }
    }

    static async create(req, res) {
        try {
            const { id_almacen, nombre, cantidad_filas, cantidad_columnas } = req.body;
            await EstanteModel.create(id_almacen, nombre, cantidad_filas, cantidad_columnas);
            res.status(201).json({ message: 'Estante creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando estante' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { id_almacen, nombre, cantidad_filas, cantidad_columnas } = req.body;
            await EstanteModel.update(id, id_almacen, nombre, cantidad_filas, cantidad_columnas);
            res.json({ message: 'Estante actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando estante' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await EstanteModel.delete(id);
            res.json({ message: 'Estante eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando estante' });
        }
    }
}

module.exports = EstanteController;
