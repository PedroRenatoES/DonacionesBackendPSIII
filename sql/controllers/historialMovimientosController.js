const HistorialMovimientosModel = require('../models/historialMovimientosModel');

class HistorialMovimientosController {
  static async getAll(req, res) {
    try {
      const movimientos = await HistorialMovimientosModel.getAll();
      res.json(movimientos);
    } catch (error) {
      console.error('Error obteniendo historial de movimientos:', error);
      res.status(500).json({ error: 'Error obteniendo historial de movimientos' });
    }
  }

  static async create(req, res) {
    try {
      const { id_usuario, id_donacion_especie, id_almacen_origen, id_almacen_destino } = req.body;
      await HistorialMovimientosModel.create(id_usuario, id_donacion_especie, id_almacen_origen, id_almacen_destino);
      res.status(201).json({ message: 'Movimiento registrado exitosamente' });
    } catch (error) {
      console.error('Error creando historial de movimiento:', error);
      res.status(500).json({ error: 'Error creando historial de movimiento' });
    }
  }
}

module.exports = HistorialMovimientosController;



