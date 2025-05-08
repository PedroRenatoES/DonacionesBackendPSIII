const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class AuthController {
    static async login(req, res) {
        const { correo, contraseña } = req.body;

        try {
            const user = await UserModel.getByEmail(correo);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (user.contraseña !== contraseña) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    correo: user.correo,
                    rol: user.id_rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.status(200).json({
                message: 'Login exitoso',
                token,
                usuario: {
                    id: user.id_usuario,
                    nombres: user.nombres,
                    correo: user.correo,
                    rol: user.id_rol
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el login' });
        }
    }
}

module.exports = AuthController;
