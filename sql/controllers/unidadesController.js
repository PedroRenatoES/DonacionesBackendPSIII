const UnidadesModel = require('../models/unidadesModel');

class UnidadesController {
  // GET /unidades
  static async getAll(req, res) {
    try {
      const unidades = await UnidadesModel.getAll();
      res.json(unidades);
    } catch (error) {
      console.error('Error al obtener unidades:', error);
      res.status(500).json({ error: 'Error obteniendo unidades de medida' });
    }
  }

  // GET /unidades/categoria/:nombre_categoria
  static async getByCategoria(req, res) {
    try {
      const { nombre_categoria } = req.params;
      const unidades = await UnidadesModel.getByCategoria(nombre_categoria);
      res.json(unidades);
    } catch (error) {
      console.error('Error al obtener unidades por categoría:', error);
      res.status(500).json({ error: 'Error obteniendo unidades por categoría' });
    }
  }
}

module.exports = UnidadesController;