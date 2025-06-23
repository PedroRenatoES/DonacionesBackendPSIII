const express = require('express');
const router = express.Router();
const HistorialMovimientosController = require('../controllers/historialMovimientosController');

router.get('/', HistorialMovimientosController.getAll);
router.post('/', HistorialMovimientosController.create);

module.exports = router;




server.js

const historialMovimientosRoutes = require('./sql/routes/historialMovimientosRoutes.js')

app.use('/api/historial-movimientos', historialMovimientosRoutes);


