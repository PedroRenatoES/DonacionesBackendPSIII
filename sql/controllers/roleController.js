const RoleModel = require('../models/roleModel');

class RoleController {
    static async getAll(req, res) {
        try {
            const roles = await RoleModel.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo roles' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const role = await RoleModel.getById(id);
            if (role) res.json(role);
            else res.status(404).json({ error: 'Rol no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo rol' });
        }
    }

    static async create(req, res) {
        try {
            const { nombre_rol, descripcion } = req.body;
            await RoleModel.create(nombre_rol, descripcion);
            res.status(201).json({ message: 'Rol creado' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando rol' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_rol, descripcion } = req.body;
            await RoleModel.update(id, nombre_rol, descripcion);
            res.json({ message: 'Rol actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando rol' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await RoleModel.delete(id);
            res.json({ message: 'Rol eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando rol' });
        }
    }
}

module.exports = RoleController;