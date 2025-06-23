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

    static async getBajoStockPorAlmacen(req, res) {
    try {
        const { idAlmacen } = req.params;
        const donaciones = await DonacionesEnEspecieModel.getBajoStockPorAlmacen(idAlmacen);
        res.json(donaciones);
    } catch (error) {
        console.error('Error obteniendo donaciones en bajo stock:', error);
        res.status(500).json({ error: 'Error obteniendo donaciones en bajo stock' });
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

static async getByCampanaId(req, res) {
    try {
      const { id_campana } = req.params;
      const donaciones = await DonacionesEnEspecieModel.getByCampanaId(id_campana);
      if (donaciones.length > 0) {
        res.json(donaciones);
      } else {
        res.status(404).json({ error: 'No se encontraron donaciones con esa campana' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo donaciones por campana' });
    }
}

static async getDonantesPorArticulo(req, res) {
    const id_articulo = parseInt(req.params.id);
    if (isNaN(id_articulo)) {
        return res.status(400).json({ message: 'ID de artículo inválido' });
    }

    try {
        const donantes = await DonacionesEnEspecieModel.getDonantesPorArticulo(id_articulo);
        res.json(donantes);
    } catch (error) {
        console.error('Error al obtener donantes por artículo:', error);
        res.status(500).json({ message: 'Error del servidor' });
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
                cantidad_restante,  // NUEVO: recibimos cantidad restante
                fecha_vencimiento   // NUEVO: recibimos fecha de vencimiento
            } = req.body;

            await DonacionesEnEspecieModel.update(
                id,
                id_articulo,
                id_espacio,
                id_unidad,         // <- pasamos unidad al modelo
                cantidad,
                estado_articulo,
                cantidad_restante, // NUEVO: pasamos cantidad restante
                fecha_vencimiento  // NUEVO: pasamos fecha de vencimiento
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

    static async updateEspacio(req, res) {
        try {
            const { id_donacion_especie, id_espacio } = req.body;
            await DonacionesEnEspecieModel.actualizarEspacio(id_donacion_especie, id_espacio);
            res.json({ message: 'Espacio actualizado para la donación en especie' });
        } catch (error) {   
            console.error('Error actualizando espacio:', error);
            res.status(500).json({ error: 'Error actualizando espacio de donación en especie' });
        }
    }

    static async updateEspacioExterno(req, res) {
        try {
            const { id_donacion_especie, id_espacio, id_usuario } = req.body;

            await DonacionesEnEspecieModel.cambiarEspacioYRegistrarMovimiento(
            id_donacion_especie,
            id_espacio,
            id_usuario
            );

            res.json({ message: 'Espacio actualizado y movimiento registrado' });
        } catch (error) {
            console.error('Error actualizando espacio y registrando movimiento:', error);
            res.status(500).json({ error: 'Error procesando movimiento' });
        }
    }



      
}

module.exports = DonacionesEnEspecieController;
