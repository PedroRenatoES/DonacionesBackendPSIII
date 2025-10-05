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
            const { id } = req.params;  // Este es id_donacion_especie
            const {
                id_donante,
                id_campana,
                id_articulo,
                cantidad,
                estado_articulo,
                fecha_vencimiento
            } = req.body;

            console.log('🚀 Solicitud de actualización recibida:', {
                id_donacion_especie: id,  // ✅ Cambiado
                body: req.body
            });

            const result = await DonacionesModel.update(
                parseInt(id),  // ✅ Este es id_donacion_especie
                id_donante,
                id_campana,
                id_articulo,
                cantidad,
                estado_articulo,
                fecha_vencimiento
            );

            console.log('✅ Actualización completada en modelo');
            res.status(200).json({
                message: 'Donación actualizada exitosamente',
                result
            });

        } catch (error) {
            console.error('💥 Error en controller update:', error);
            res.status(500).json({ 
                error: 'Error actualizando donación',
                details: error.message 
            });
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
            const { id } = req.params; // id_donacion_especie

            console.log('🚀 Solicitud de eliminación recibida:', {
                id_donacion_especie: id
            });

            // Validar que el ID sea un número válido
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ 
                    error: 'ID de donación inválido' 
                });
            }

            const result = await DonacionesModel.delete(parseInt(id));

            console.log('✅ Eliminación completada en modelo');
            res.status(200).json({
                message: result.message,
                result
            });

        } catch (error) {
            console.error('💥 Error en controller delete:', error);
            
            if (error.message.includes('No se encontró')) {
                return res.status(404).json({ 
                    error: 'Donación no encontrada',
                    details: error.message 
                });
            }

            if (error.message.includes('No se puede eliminar')) {
                return res.status(400).json({ 
                    error: 'No se puede eliminar la donación',
                    details: error.message 
                });
            }

            res.status(500).json({ 
                error: 'Error eliminando donación',
                details: error.message 
            });
        }
    }
}

module.exports = DonacionesController;
