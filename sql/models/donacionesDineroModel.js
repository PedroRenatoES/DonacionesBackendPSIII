const { sql, poolPromise } = require(require('../config').dbConnection);

class DonacionesEnDineroModel {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM DonacionesEnDinero');
        return result.recordset;
    }

    static async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM DonacionesEnDinero WHERE id_donacion = @id');
        return result.recordset[0];
    }


// Obtener todos los nombres de cuenta
static async getAllNombreCuenta() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT DISTINCT nombre_cuenta FROM DonacionesEnDinero');
  return result.recordset;
}

// Obtener todos los números de cuenta
static async getAllNumeroCuenta() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT DISTINCT numero_cuenta FROM DonacionesEnDinero');
  return result.recordset;
}

// Obtener donaciones por nombre de cuenta (filtro con comodines)
static async getByNombreCuenta(nombre_cuenta) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('nombre_cuenta', sql.VarChar, `%${nombre_cuenta}%`)
    .query('SELECT * FROM DonacionesEnDinero WHERE nombre_cuenta LIKE @nombre_cuenta');
  return result.recordset;
}

// Obtener donaciones por número de cuenta (filtro con comodines)
static async getByNumeroCuenta(numero_cuenta) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('numero_cuenta', sql.VarChar, `%${numero_cuenta}%`)
    .query('SELECT * FROM DonacionesEnDinero WHERE numero_cuenta LIKE @numero_cuenta');
  return result.recordset;
}


    static async create(id_donacion, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion) {
        const pool = await poolPromise;
        await pool.request()
            .input('id_donacion', sql.Int, id_donacion)
            .input('monto', sql.Decimal(18, 2), monto)
            .input('divisa', sql.VarChar, divisa)
            .input('nombre_cuenta', sql.VarChar, nombre_cuenta)
            .input('numero_cuenta', sql.VarChar, numero_cuenta)
            .input('comprobante_url', sql.VarChar, comprobante_url)
            .input('estado_validacion', sql.VarChar, estado_validacion)
            .query('INSERT INTO DonacionesEnDinero (id_donacion, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url, estado_validacion) VALUES (@id_donacion, @monto, @divisa, @nombre_cuenta, @numero_cuenta, @comprobante_url, @estado_validacion)');
    }

    static async update(id, monto, divisa, nombre_cuenta, numero_cuenta, comprobante_url) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('monto', sql.Decimal(18, 2), monto)
            .input('divisa', sql.VarChar, divisa)
            .input('nombre_cuenta', sql.VarChar, nombre_cuenta)
            .input('numero_cuenta', sql.VarChar, numero_cuenta)
            .input('comprobante_url', sql.VarChar, comprobante_url)
            .query(`
                UPDATE DonacionesEnDinero 
                SET 
                    monto = @monto, 
                    divisa = @divisa, 
                    nombre_cuenta = @nombre_cuenta, 
                    numero_cuenta = @numero_cuenta, 
                    comprobante_url = @comprobante_url
                WHERE id_donacion_dinero = @id
            `);
    }
    

    static async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM DonacionesEnDinero WHERE id_donacion = @id');
    }
}

module.exports = DonacionesEnDineroModel;
