const DonacionesModel = require('../models/donacionesModel');

class DonacionesController {
    static async getAll(req, res) {
        try {
            const donaciones = await DonacionesModel.getAll();
            res.json(donaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donaciones' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const donacion = await DonacionesModel.getById(id);
            if (donacion) res.json(donacion);
            else res.status(404).json({ error: 'Donación no encontrada' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donación' });
        }
    }

    static async create(req, res) {
        try {
            const {
            tipo_donacion,
            fecha_donacion,
            id_donante,
            id_campana,
            id_unidad            // <- ahora lo recibimos en el body
            } = req.body;

            const id_result = await DonacionesModel.create(
            tipo_donacion,
            fecha_donacion,
            id_donante,
            id_campana,
            'pendiente',
            id_unidad            // <- pasamos unidad al modelo
            );

            res.status(201).json({
            message: 'Donación creada',
            id: id_result
            });
        } catch (error) {
            console.error('Error creando donación:', error);
            res.status(500).json({ error: 'Error creando donación' });
        }
    }
    

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { tipo_donacion, fecha_donacion, id_donante, id_campana, id_almacen } = req.body;
            await DonacionesModel.update(id, tipo_donacion, fecha_donacion, id_donante, id_campana, id_almacen);
            res.json({ message: 'Donación actualizada' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando donación' });
        }
    }
    static async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado_validacion } = req.body;
            await DonacionesModel.updateEstado(id, estado_validacion);
            res.json({ message: 'Estado de donación actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando estado de donación' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await DonacionesModel.delete(id);
            res.json({ message: 'Donación y su detalle asociada eliminadas correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando donación' });
        }
    }
}

module.exports = DonacionesController;
