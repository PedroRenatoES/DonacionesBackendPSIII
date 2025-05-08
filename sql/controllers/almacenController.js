const AlmacenModel = require('../models/almacenModel');

class AlmacenController {
    static async getAll(req, res) {
        try {
            const almacenes = await AlmacenModel.getAll();
            res.json(almacenes);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo almacenes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenModel.getById(id);
            if (almacen) res.json(almacen);
            else res.status(404).json({ error: 'Almacén no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo almacén' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre_almacen, ubicacion } = req.body;
            await AlmacenModel.create(nombre_almacen, ubicacion);
            res.status(201).json({ message: 'Almacén creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando almacén' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_almacen, ubicacion } = req.body;
            await AlmacenModel.update(id, nombre_almacen, ubicacion);
            res.json({ message: 'Almacén actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando almacén' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await AlmacenModel.delete(id);
            res.json({ message: 'Almacén eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando almacén' });
        }
    }
}

module.exports = AlmacenController;
