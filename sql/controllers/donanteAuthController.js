// controllers/donanteAuthController.js
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require(require('../config').dbConnection);

const JWT_SECRET = process.env.JWT_SECRET;

class DonanteAuthController {
    static async login(req, res) {
        const { usuario, contraseña_hash } = req.body;

        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('usuario', sql.VarChar, usuario)
                .query('SELECT * FROM Donantes WHERE usuario = @usuario');

            const donante = result.recordset[0];

            if (!donante) {
                return res.status(404).json({ error: 'Donante no encontrado' });
            }

            if (donante.contraseña_hash !== contraseña_hash) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                {
                    id: donante.id_donante,
                    usuario: donante.usuario,
                    tipo: 'donante'
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login exitoso',
                token,
                donante: {
                    id: donante.id_donante,
                    nombres: donante.nombres,
                    apellidos: donante.apellidos,
                    usuario: donante.usuario,
                    correo: donante.correo,
                    tipo: 'donante'
                }
            });
        } catch (error) {
            console.error('Error en login donante:', error);
            res.status(500).json({ error: 'Error en login' });
        }
    }
}

module.exports = DonanteAuthController;
