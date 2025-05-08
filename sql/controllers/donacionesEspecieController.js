const DonacionesEnEspecieModel = require('../models/donacionesEspecieModel');

class DonacionesEnEspecieController {
    static async getAll(req, res) {
        try {
            const donaciones = await DonacionesEnEspecieModel.getAll();
            res.json(donaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donaciones en especie' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const donacion = await DonacionesEnEspecieModel.getById(id);
            if (donacion) res.json(donacion);
            else res.status(404).json({ error: 'Donación en especie no encontrada' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donación en especie' });
        }
    }

    static async getByDonanteId(req, res) {
    try {
        const { id } = req.params;
        const donaciones = await DonacionesEnEspecieModel.getByDonanteId(id);
        res.json(donaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo donaciones en especie del donante' });
    }
}


    static async create(req, res) {
        try {
            const { id_donacion, id_articulo, cantidad, estado_articulo, destino_donacion } = req.body;
            await DonacionesEnEspecieModel.create(id_donacion, id_articulo, cantidad, estado_articulo, destino_donacion);
            res.status(201).json({ message: 'Donación en especie creada' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando donación en especie' });
        }
    }

    static async update(req, res) {
        try {
          const { id } = req.params;
          const {
            id_articulo,
            id_espacio,
            id_unidad,          // <- recibimos unidad
            cantidad,
            estado_articulo,
            destino_donacion
          } = req.body;
      
          await DonacionesEnEspecieModel.update(
            id,
            id_articulo,
            id_espacio,
            id_unidad,         // <- pasamos unidad al modelo
            cantidad,
            estado_articulo,
            destino_donacion
          );
      
          res.json({ message: 'Donación en especie actualizada' });
        } catch (error) {
          console.error('Error actualizando donación en especie:', error);
          res.status(500).json({ error: 'Error actualizando donación en especie' });
        }
      }
    
    

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await DonacionesEnEspecieModel.delete(id);
            res.json({ message: 'Donación en especie eliminada' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando donación en especie' });
        }
    }
}

module.exports = DonacionesEnEspecieController;
