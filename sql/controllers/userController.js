const UserModel = require('../models/userModel');
const PasswordModel = require('../../mongo/models/passwordModel.js');
const bcrypt = require('bcrypt');
const saltRounds = 10; // puedes ajustar este número
const enviarCorreo = require('./emailService'); // ruta según tu estructura


class UserController {
    static async getAll(req, res) {
        try {
            const users = await UserModel.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error getting users' });
        }
    }

    static async getAllInactive(req, res) {
        try {
            const users = await UserModel.getAllInactive();
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
                foto_licencia,
                estado
            } = req.body;

            const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

            const id_usuario = await UserModel.create(
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                hashedPassword,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia,
                estado
            );

            res.status(201).json({ message: 'User created successfully', id_usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }

    

    static async createSimple(req, res) {
        try {
            const {
                nombre,
                apellido,
                email,
                ci,
                password,
                telefono
            } = req.body;
    
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            await UserModel.createSimple(nombre, apellido, email, ci, hashedPassword, telefono);
    
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
                foto_licencia,
                estado
            } = req.body;

            // Encriptar contraseña si viene en la solicitud
            const hashedPassword = contrasena
                ? await bcrypt.hash(contrasena, saltRounds)
                : undefined;

            await UserModel.update(
                id,
                nombres,
                apellido_paterno,
                apellido_materno,
                fecha_nacimiento,
                direccion_domiciliaria,
                correo,
                hashedPassword || contrasena,
                telefono,
                id_rol,
                ci,
                foto_ci,
                licencia_conducir,
                foto_licencia,
                estado
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

    static async activateAndGeneratePassword(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.getById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (user.estado === 1) {
                return res.status(400).json({ error: 'El usuario ya está activo' });
            }

            const newPassword = UserController.#generateRandomPassword();
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await UserModel.update(
                id,
                user.nombres,
                user.apellido_paterno,
                user.apellido_materno,
                user.fecha_nacimiento,
                user.direccion_domiciliaria,
                user.correo,
                hashedPassword,
                user.telefono,
                user.id_rol,
                user.ci,
                user.foto_ci,
                user.licencia_conducir,
                user.foto_licencia,
                1 // Activar usuario
            );

            await PasswordModel.create({
                userId: id,
                password: hashedPassword
            });

            await enviarCorreo({
                to: user.correo,
                subject: 'Tu cuenta ha sido activada',
                text: `Hola ${user.nombres}, tu cuenta ha sido activada.\n\nTu contraseña temporal es: ${newPassword}\n\nPor favor cámbiala al iniciar sesión.`,
              });          

            return res.json({
                message: 'Usuario activado y contraseña generada',
                password: newPassword
            });

        } catch (error) {
            console.error('Error activando usuario:', error);
            res.status(500).json({ error: 'Error al activar usuario' });
        }
    }


    static #generateRandomPassword(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    static async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword) {
                return res.status(400).json({ error: 'Nueva contraseña requerida' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await UserModel.updatePasswordOnly(id, hashedPassword);

            await PasswordModel.deleteOne({ userId: parseInt(id) });

            res.json({ message: 'Contraseña actualizada y contraseña antigua eliminada de MongoDB' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error actualizando la contraseña' });
        }
    }
}

module.exports = UserController;
