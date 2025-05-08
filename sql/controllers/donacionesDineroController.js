const DonacionesEnDineroModel = require('../models/donacionesDineroModel');

class DonacionesEnDineroController {
    static async getAll(req, res) {
        try {
            const donaciones = await DonacionesEnDineroModel.getAll();
            res.json(donaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donaciones en dinero' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const donacion = await DonacionesEnDineroModel.getById(id);
            if (donacion) res.json(donacion);
            else res.status(404).json({ error: 'Donación en dinero no encontrada' });
        } catch (error) {
            res.status(500).json({ error: 'Error obteniendo donación en dinero' });
        }
    }

         static async getAllNombreCuenta(req, res) {
    try {
      const nombres = await DonacionesEnDineroModel.getAllNombreCuenta();
      res.json(nombres);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo nombres de cuenta' });
    }
  }

  // Obtener todos los números de cuenta
  static async getAllNumeroCuenta(req, res) {
    try {
      const numeros = await DonacionesEnDineroModel.getAllNumeroCuenta();
      res.json(numeros);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo números de cuenta' });
    }
  }

  // Obtener donaciones por nombre de cuenta
  static async getByNombreCuenta(req, res) {
    try {
      const { nombre_cuenta } = req.params;
      const donaciones = await DonacionesEnDineroModel.getByNombreCuenta(nombre_cuenta);
      if (donaciones.length > 0) {
        res.json(donaciones);
      } else {
        res.status(404).json({ error: 'No se encontraron donaciones con ese nombre de cuenta' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo donaciones por nombre de cuenta' });
    }
  }

  // Obtener donaciones por número de cuenta
  static async getByNumeroCuenta(req, res) {
    try {
      const { numero_cuenta } = req.params;
      const donaciones = await DonacionesEnDineroModel.getByNumeroCuenta(numero_cuenta);
      if (donaciones.length > 0) {
        res.json(donaciones);
      } else {
        res.status(404).json({ error: 'No se encontraron donaciones con ese número de cuenta' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo donaciones por número de cuenta' });
    }
  }


        static async create(req, res) {
        try {
            const { id_donacion, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion } = req.body;
            await DonacionesEnDineroModel.create(id_donacion, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion);
            res.status(201).json({ message: 'Donación en dinero creada' });
        } catch (error) {
            res.status(500).json({ error: 'Error creando donación en dinero' });
        }
    }

        static async update(req, res) {
        try {
            const { id } = req.params;
            const { monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion } = req.body;
            await DonacionesEnDineroModel.update(id, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion);
            res.json({ message: 'Donación en dinero actualizada' });
        } catch (error) {
            res.status(500).json({ error: 'Error actualizando donación en dinero' });
        }
    }

        static async delete(req, res) {
        try {
            const { id } = req.params;
            await DonacionesEnDineroModel.delete(id);
            res.json({ message: 'Donación en dinero eliminada' });
        } catch (error) {
            res.status(500).json({ error: 'Error eliminando donación en dinero' });
        }
    }
}

module.exports = DonacionesEnDineroController;
