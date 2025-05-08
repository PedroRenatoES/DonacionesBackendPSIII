const DonacionesRopaModel = require('../models/DonacionesRopaModel');

class DonacionesRopaController {

  static async create(req, res) {
    try {
      const { id_donacion_especie, id_genero, id_talla } = req.body;
      await DonacionesRopaModel.create(id_donacion_especie, id_genero, id_talla);
      res.status(201).json({ message: 'Datos de ropa registrados' });
    } catch (error) {
      console.error('Error creando datos de ropa:', error);
      res.status(500).json({ error: 'Error registrando género y talla' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { id_genero, id_talla } = req.body;
      await DonacionesRopaModel.update(id, id_genero, id_talla);
      res.json({ message: 'Género y talla actualizados' });
    } catch (error) {
      console.error('Error actualizando datos de ropa:', error);
      res.status(500).json({ error: 'Error actualizando género y talla' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await DonacionesRopaModel.getByDonacionEspecie(id);
      res.json(data);
    } catch (error) {
      console.error('Error obteniendo datos de ropa:', error);
      res.status(500).json({ error: 'Error obteniendo datos de ropa' });
    }
  }

  static async getGeneros(req, res) {
    try {
      const generos = await DonacionesRopaModel.getAllGeneros();
      res.json(generos);
    } catch (error) {
      console.error('Error obteniendo géneros:', error);
      res.status(500).json({ error: 'Error obteniendo géneros' });
    }
  }

  static async getTallas(req, res) {
    try {
      const tallas = await DonacionesRopaModel.getAllTallas();
      res.json(tallas);
    } catch (error) {
      console.error('Error obteniendo tallas:', error);
      res.status(500).json({ error: 'Error obteniendo tallas' });
    }
  }
}

module.exports = DonacionesRopaController;
