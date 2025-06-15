const SalidasAlmacenModel = require('../models/salidasAlmacenModel');

class SalidasAlmacenController {
  static async getAll(req, res) {
    try {
      const salidas = await SalidasAlmacenModel.getAll();
      res.json(salidas);
    } catch (error) {
      console.error('Error al obtener salidas de almacén:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const { id_paquete, id_usuario } = req.body;
      if (!id_paquete || !id_usuario) {
        return res.status(400).json({ error: 'id_paquete e id_usuario son requeridos' });
      }

      await SalidasAlmacenModel.create(id_paquete, id_usuario);
      res.status(201).json({ message: 'Salida registrada correctamente' });
    } catch (error) {
      console.error('Error al crear salida:', error);
      res.status(500).json({ error: 'Error al registrar salida' });
    }
  }
}

module.exports = SalidasAlmacenController;

