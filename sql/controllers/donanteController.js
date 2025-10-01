const DonanteModel = require('../models/donanteModel');

class DonanteController {
    static async getAll(req, res) {
        try {
            const donantes = await DonanteModel.getAll();
            res.json(donantes);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donantes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const donante = await DonanteModel.getById(id);
            if (donante) res.json(donante);
            else res.status(404).json({ error: 'Donante no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donante' });
        }
    }

    static async getDonacionesByDonante(req, res) {
        try {
            const { id } = req.params;
            const donaciones = await DonanteModel.getDonacionesByDonante(id);
            if (donaciones.length) {
                res.json(donaciones);
            } else {
                res.status(404).json({ message: 'No se encontraron donaciones para este donante' });
            }
        } catch (error) {
            console.error('Error obteniendo donaciones del donante:', error);
            res.status(500).json({ error: 'Error obteniendo las donaciones del donante' });
        }
    }

    static async create(req, res) {
        try {
            const { nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash } = req.body;
            const id_donante = await DonanteModel.create(nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash);
            const newDonor = await DonanteModel.getById(id_donante);

            if (!newDonor) {
                return res.status(201).json({ message: "Donante creado, pero no se pudo obtener los datos" });
            }

            res.status(201).json(newDonor);
        } catch (error) {
            console.error("Error en DonanteController.create:", error); // <-- importante
            res.status(500).json({ error: 'Error creando donante', detalle: error.message });
        }
    }


    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash } = req.body;
            await DonanteModel.update(id, nombres, apellido_paterno, apellido_materno, correo, telefono, usuario, contraseña_hash);
            res.json({ message: 'Donante actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando donante' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await DonanteModel.delete(id);
            res.json({ message: 'Donante eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando donante' });
        }
    }
}

module.exports = DonanteController;
