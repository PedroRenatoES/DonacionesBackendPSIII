const DonacionesEnEspecieModel = require('../models/donacionesEspecieModel');

class InventarioController {
  static async getInventarioConUbicaciones(req, res) {
    try {
      const { idAlmacen } = req.query;

      if (!idAlmacen) {
        return res.status(400).json({ error: 'Se requiere el idAlmacen' });
      }

      const datos = await DonacionesEnEspecieModel.getInventarioConUbicacion(idAlmacen);

      const agrupado = {};
      datos.forEach(item => {
        const nombre = item.nombre_articulo;
        if (!agrupado[nombre]) {
          agrupado[nombre] = {
            id_articulo: item.id_articulo,
            nombre_articulo: nombre,
            nombre_categoria: item.nombre_categoria,
            nombre_unidad: item.nombre_unidad,
            cantidad_total: 0,
            ubicaciones: []
          };
        }

        agrupado[nombre].cantidad_total += item.cantidad;
        agrupado[nombre].ubicaciones.push({
          espacio: item.espacio,
          estante: item.estante,
          almacen: item.nombre_almacen
        });
      });

      res.json(Object.values(agrupado));
    } catch (err) {
      console.error('Error en InventarioController:', err);
      res.status(500).send('Error interno del servidor');
    }
  }


  static async getStockPorArticulo(req, res) {
    try {
      const datos = await DonacionesEnEspecieModel.getStockPorArticulo();
      res.json(datos);
    } catch (err) {
      console.error('Error en InventarioController.getStockPorArticulo:', err);
      res.status(500).send('Error interno del servidor');
    }
  }

  static async getStockPorArticuloPorId(req, res) {
    try {
      const { id } = req.params;
      const datos = await DonacionesEnEspecieModel.getStockPorArticuloPorId(parseInt(id));
      res.json(datos);
    } catch (err) {
      console.error('Error en InventarioController.getStockPorArticuloPorId:', err);
      res.status(500).send('Error interno del servidor');
    }
  }

  static async getStockPorEstanteId(req, res) {
    const { id_estante } = req.params;
    try {
      const datos = await DonacionesEnEspecieModel.getStockPorEstanteId(id_estante);
      res.json(datos);
    } catch (err) {
      console.error('Error en getStockPorEstanteId:', err);
      res.status(500).send('Error interno del servidor');
    }
  }

  

  
}

module.exports = InventarioController;
