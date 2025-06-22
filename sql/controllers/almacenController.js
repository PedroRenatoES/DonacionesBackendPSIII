const AlmacenModel = require('../models/almacenModel');

class AlmacenController {
    static async getAll(req, res) {
        try {
            const almacenes = await AlmacenModel.getAll();
            res.json(almacenes);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo almacenes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenModel.getById(id);
            if (almacen) res.json(almacen);
            else res.status(404).json({ error: 'Almacén no encontrado' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo almacén' });
        }
    }

    static async getByAlmacenes(req, res) {
        try {
            const { id_almacen } = req.params;
            const espacios = await AlmacenModel.getByAlmacen(id_almacen);
            res.json(espacios);
        } catch (error) {
            console.error('Error al obtener espacios por almacén:', error);
            res.status(500).json({ error: 'Error al obtener espacios' });
        }
        
    }

    static async getAlmacenesConContenido(req, res) {
  try {
    const resultado = await AlmacenModel.getAlmacenesConContenido();

    // Agrupamos la data para que sea más útil en el frontend
    const agrupado = {};

    for (const row of resultado) {
      const id_almacen = row.id_almacen;
      if (!agrupado[id_almacen]) {
        agrupado[id_almacen] = {
          id_almacen: row.id_almacen,
          nombre_almacen: row.nombre_almacen,
          ubicacion: row.ubicacion,
          estantes: {},
        };
      }

      const estantes = agrupado[id_almacen].estantes;
      if (!estantes[row.id_estante]) {
        estantes[row.id_estante] = {
          id_estante: row.id_estante,
          nombre_estante: row.nombre_estante,
          espacios: {},
        };
      }

      const espacios = estantes[row.id_estante].espacios;
      if (!espacios[row.id_espacio]) {
        espacios[row.id_espacio] = {
          id_espacio: row.id_espacio,
          codigo_espacio: row.codigo_espacio,
          lleno: row.lleno,
          articulos: [],
        };
      }

      if (row.id_articulo) {
        espacios[row.id_espacio].articulos.push({
          id_articulo: row.id_articulo,
          nombre_articulo: row.nombre_articulo,
          cantidad: row.cantidad,
          nombre_unidad: row.nombre_unidad,
          nombre_categoria: row.nombre_categoria,
        });
      }
    }

    res.json(Object.values(agrupado));
  } catch (error) {
    console.error('Error al obtener almacenes con contenido:', error);
    res.status(500).json({ error: 'Error obteniendo datos del almacén' });
  }
}


static async create(req, res) {
    try {
        const { nombre_almacen, ubicacion, latitud, longitud } = req.body;
        await AlmacenModel.create(nombre_almacen, ubicacion, latitud, longitud);
        res.status(201).json({ message: 'Almacén creado' });
    } catch (error) {
        console.error('Error al crear almacén:', error); // <-- útil para debug
        res.status(500).json({ error: 'Error creando almacén' });
    }
}


    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre_almacen, ubicacion } = req.body;
            await AlmacenModel.update(id, nombre_almacen, ubicacion);
            res.json({ message: 'Almacén actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando almacén' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await AlmacenModel.delete(id);
            res.json({ message: 'Almacén eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando almacén' });
        }
    }
}

module.exports = AlmacenController;
