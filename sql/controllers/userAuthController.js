const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const PasswordModel = require('../../mongo/models/passwordModel'); // Modelo de Mongo

class AuthController {
  static async login(req, res) {
    const { ci, contrasena } = req.body;

    try {
      const user = await UserModel.getByCi(ci);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificación de contraseña con bcrypt
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      if (user.estado == 0) {
        return res.status(401).json({ error: 'Usuario No Activo' });
      }

      let cambiarPassword = false;
      const passwordsMongo = await PasswordModel.find({ userId: user.id_usuario });

      if (passwordsMongo.some(pw => pw.password === contrasena)) {
        cambiarPassword = true;
      }

      const token = jwt.sign(
        {
          id: user.id_usuario,
          ci: user.ci,
          rol: user.id_rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({
        message: 'Login exitoso',
        token,
        cambiarPassword,
        usuario: {
          id: user.id_usuario,
          nombres: user.nombres,
          ci: user.ci,
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
