const DonacionesEnEspecieModel = require('../models/donacionesEspecieModel');

class InventarioController  {
  static async getInventarioConUbicaciones(req, res) {
    try {
      const datos = await DonacionesEnEspecieModel.getInventarioConUbicacion();

      const agrupado = {};
      datos.forEach(item => {
        const nombre = item.nombre_articulo;
        if (!agrupado[nombre]) {
          agrupado[nombre] = {
            id_articulo: item.id_articulo,
            nombre_articulo: nombre,
            cantidad_total: 0,
            ubicaciones: []
          };
        }

        agrupado[nombre].cantidad_total += item.cantidad;
        agrupado[nombre].ubicaciones.push({
          espacio: item.espacio,
          estante: item.nombre_estante,
          almacen: item.nombre_almacen
        });
      });

      res.json(Object.values(agrupado));
    } catch (err) {
      console.error('Error en InventarioController:', err);
      res.status(500).send('Error interno del servidor');
    }
  }
};

module.exports = InventarioController;
