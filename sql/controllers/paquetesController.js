const PaquetesModel = require('../models/paquetesModel');

class PaquetesController {
  // POST /paquetes
  static async create(req, res) {
    try {
      const { nombre_paquete, descripcion, id_pedido, donaciones } = req.body;
      const result = await PaquetesModel.create(
        nombre_paquete,
        descripcion,
        id_pedido,
        donaciones
      );

      if (result.success) {
        res.status(201).json({ message: 'Paquete creado', id_paquete: result.id_paquete });
      } else {
        res.status(400).json({ message: 'Error creando paquete', errors: result.errors });
      }
    } catch (error) {
      console.error('Error creando paquete:', error);
      res.status(500).json({ error: 'Error creando paquete' });
    }
  }

  // GET /paquetes
  static async getAll(req, res) {
    try {
      const paquetes = await PaquetesModel.getAll();
      res.json(paquetes);
    } catch (error) {
      console.error('Error obteniendo paquetes:', error);
      res.status(500).json({ error: 'Error obteniendo paquetes' });
    }
  }

  // GET /paquetes/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const paquete = await PaquetesModel.getById(parseInt(id, 10));
      if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
      res.json(paquete);
    } catch (error) {
      console.error('Error obteniendo paquete:', error);
      res.status(500).json({ error: 'Error obteniendo paquete' });
    }
  }

  static async getAllWithDonaciones(req, res) {
    try {
      const paquetes = await PaquetesModel.getAllWithDonaciones();
      res.json(paquetes);
    } catch (error) {
      console.error('Error al obtener paquetes con donaciones:', error);
      res.status(500).json({ error: 'Error al obtener los paquetes' });
    }
  }

    static async getAllEnviados(req, res) {
    try {
      const paquetes = await PaquetesModel.getAllEnviados();
      res.json(paquetes);
    } catch (error) {
      console.error('Error al obtener paquetes enviados:', error);
      res.status(500).json({ error: 'Error al obtener paquetes con estado 1' });
    }
  }

   static async getPaquetesNoEnviados(req, res) {
    try {
      const paquetes = await PaquetesModel.getPaquetesNoEnviados();
      res.json(paquetes);
    } catch (error) {
      console.error('Error al obtener paquetes no enviados:', error);
      res.status(500).json({ error: 'Error al obtener paquetes no enviados' });
    }
  }

  static async marcarComoEnviado(req, res) {
  try {
    const { id_paquete } = req.body;
    if (!id_paquete) {
      return res.status(400).json({ error: 'Falta el ID del paquete' });
    }

    await PaquetesModel.marcarComoEnviado(id_paquete);
    res.json({ message: 'Paquete marcado como enviado (estado = 1)' });
  } catch (error) {
    console.error('Error al marcar paquete como enviado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del paquete' });
  }
}




  // PUT /paquetes/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre_paquete, descripcion, id_pedido, donaciones } = req.body;
      const result = await PaquetesModel.update(
        parseInt(id, 10),
        nombre_paquete,
        descripcion,
        id_pedido,
        donaciones
      );

      if (result.success) {
        res.json({ message: 'Paquete actualizado' });
      } else {
        res.status(400).json({ message: 'Error actualizando paquete', errors: result.errors });
      }
    } catch (error) {
      console.error('Error actualizando paquete:', error);
      res.status(500).json({ error: 'Error actualizando paquete' });
    }
  }

  // DELETE /paquetes/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await PaquetesModel.delete(parseInt(id, 10));
      res.json({ message: 'Paquete eliminado' });
    } catch (error) {
      console.error('Error eliminando paquete:', error);
      res.status(500).json({ error: 'Error eliminando paquete' });
    }
  }

  static async getDonantesByNombrePaquete(req, res) {
    try {
      const { nombre_paquete } = req.params;
      const donantes = await PaquetesModel.getDonantesByNombrePaquete(nombre_paquete);
      res.json(donantes);
    } catch (error) {
      console.error('Error obteniendo donantes por nombre de paquete:', error);
      res.status(500).json({ error: 'Error obteniendo donantes por nombre de paquete' });
    }
  }


}

module.exports = PaquetesController;
