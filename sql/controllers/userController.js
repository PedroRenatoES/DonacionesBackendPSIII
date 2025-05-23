const UserModel = require('../models/userModel');

class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserModel.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error getting users' });
        }
    }

    static async getAllSimple(req, res) {
        try {
            const users = await UserModel.getAllSimple();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener usuarios simples' });
        }
    }


    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.getById(id);
            if (user) res.json(user);
            else res.status(404).json({ error: 'User not found' });
        } catch (error) {
            res.status(500).json({ error: 'Error getting user' });
        }
    }
    
    static async create(req, res) {
        try {
            const {
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                contrasena,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia
            } = req.body;

            await UserModel.create(
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                contrasena,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia
            );
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }


    static async createSimple(req, res) {
        try {
            const {
                nombres,
                apellido,
                email,
                ci,
                password,
                telefono
            } = req.body;

            await UserModel.createSimple(nombres, apellido, email, ci, password, telefono);

            res.status(201).json({ message: 'Usuario creado con datos mínimos' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creando usuario con datos mínimos' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                contrasena,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia
            } = req.body;

            await UserModel.update(
                id,
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                contrasena,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia
            );
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating user' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await UserModel.delete(id);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    }
}

module.exports = UserController;
