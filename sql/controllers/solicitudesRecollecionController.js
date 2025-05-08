const SolicitudesRecoleccionModel = require('../models/solicitudesRecoleccionModel');

class SolicitudesRecoleccionController {
  static async create(req, res) {
    try {
      const { id_donante, ubicacion, detalle_solicitud } = req.body;
      const id_solicitud = await SolicitudesRecoleccionModel.create(
        id_donante,
        ubicacion,
        detalle_solicitud
      );
      res.status(201).json({ message: 'Solicitud creada', id_solicitud });
    } catch (error) {
      console.error('Error creando solicitud de recolección:', error);
      res.status(500).json({ error: 'Error creando solicitud de recolección' });
    }
  }

  static async getAll(req, res) {
    try {
      const solicitudes = await SolicitudesRecoleccionModel.getAll();
      res.json(solicitudes);
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      res.status(500).json({ error: 'Error obteniendo solicitudes' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudesRecoleccionModel.getById(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      console.error('Error obteniendo solicitud:', error);
      res.status(500).json({ error: 'Error obteniendo solicitud' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { id_donante, ubicacion, detalle_solicitud } = req.body;
      await SolicitudesRecoleccionModel.update(
        id,
        id_donante,
        ubicacion,
        detalle_solicitud
      );
      res.json({ message: 'Solicitud actualizada' });
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
      res.status(500).json({ error: 'Error actualizando solicitud' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await SolicitudesRecoleccionModel.delete(id);
      res.json({ message: 'Solicitud eliminada' });
    } catch (error) {
      console.error('Error eliminando solicitud:', error);
      res.status(500).json({ error: 'Error eliminando solicitud' });
    }
  }
}

module.exports = SolicitudesRecoleccionController;