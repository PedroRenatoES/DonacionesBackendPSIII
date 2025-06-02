const CajaModel = require('../models/cajasModel');

const CajaController = {
  async getAll(req, res) {
    try {
      const cajas = await CajaModel.getAll();
      res.json(cajas);
    } catch (error) {
      console.error('Error al obtener cajas:', error);
      res.status(500).json({ error: 'Error al obtener cajas' });
    }
  },

  async getById(req, res) {
    try {
      const caja = await CajaModel.getById(req.params.id);
      if (!caja) {
        return res.status(404).json({ error: 'Caja no encontrada' });
      }
      res.json(caja);
    } catch (error) {
      console.error('Error al obtener caja:', error);
      res.status(500).json({ error: 'Error al obtener caja' });
    }
  },

  async getByPaquete(req, res) {
    try {
      const id_paquete = req.params.id_paquete;
      const data = await CajaModel.getByPaqueteWithDetails(id_paquete);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No se encontraron cajas para este paquete' });
      }
  
      res.json(data);
    } catch (error) {
      console.error('Error al obtener cajas por paquete:', error);
      res.status(500).json({ error: 'Error al obtener cajas por paquete' });
    }
  },
  
  async create(req, res) {
    try {
      const { codigo_caja, id_paquete, cantidad_maxima, cantidad_asignada, estado } = req.body;
      const id = await CajaModel.create(codigo_caja, id_paquete, cantidad_maxima, cantidad_asignada, estado);
      res.status(201).json({ message: 'Caja creada', id });
    } catch (error) {
      console.error('Error al crear caja:', error);
      res.status(500).json({ error: 'Error al crear caja' });
    }
  },

  async update(req, res) {
    try {
      const { codigo_caja, id_paquete, cantidad_maxima, cantidad_asignada, estado } = req.body;
      await CajaModel.update(req.params.id, codigo_caja, id_paquete, cantidad_maxima, cantidad_asignada, estado);
      res.json({ message: 'Caja actualizada' });
    } catch (error) {
      console.error('Error al actualizar caja:', error);
      res.status(500).json({ error: 'Error al actualizar caja' });
    }
  },

  async delete(req, res) {
    try {
      await CajaModel.delete(req.params.id);
      res.json({ message: 'Caja eliminada' });
    } catch (error) {
      console.error('Error al eliminar caja:', error);
      res.status(500).json({ error: 'Error al eliminar caja' });
    }
  }
};

module.exports = CajaController;
